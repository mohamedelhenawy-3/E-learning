const { Notification } = require("../Models/notification-model");
const admin = require("firebase-admin");
const serviceAccount = require("../file/code.json");
const User = require('../Models/user-model');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://elearning1-69342.firebaseio.com/'
});


exports.sendNotify = async (courseId, description) => {
  if (typeof courseId !== "string") {
    courseId = courseId.toString();
  }

  console.log("courseId:", courseId);

  const users = await User.find({ enrolledCourses: courseId }).exec();

  const notifications = users.map((user) => {
    console.log("user:", user);

    const notification = new Notification({
      description: description,
      receiver: {
        userData: user,
      },
      courseId: courseId,
    });

    notification.save();
    return notification;
  });

  const validCourseIdRegex = /^[a-zA-Z0-9-_.~%]+$/;

  if (!validCourseIdRegex.test(courseId)) {
    throw new Error('Invalid course ID');
  }

  const sanitizedCourseId = courseId.replace(/[^a-zA-Z0-9-_.~%]+/g, "");

  console.log("sanitizedCourseId:", sanitizedCourseId);

  const topicName = `/topics/${sanitizedCourseId}`;
await admin.messaging().subscribeToTopic(topicName);

 

  const message = {
    topic: topicName,
    notification: {
      title: 'Course Update',
      body: description,
    },
    data: {
      type: 'course-update',
      courseId: courseId,
    },
  };

  await admin.messaging().send(message);

  return notifications;
};
