const { Lec } = require("../Models/lec-model");
const { Doctor } = require("../Models/doctor-model");
const { Course } = require("../Models/course-model");
const Cloudinary = require("../utils/clouodinry");
const { sendNotify } = require("../utils/sendNotifications");
const { formateDuration } = require("../utils/formateDuration");
const { parseDuration } = require("../utils/parseDuration");

const ErrorResponse = require("../utils/errorResponse");

const addLecture = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    const doctor = await Doctor.findById(req.params.docId);
    console.log("courseId", course._id);
    if (req.user.id == course.doctorData.doctorId) {
      const existingLecture = await Lec.findOne({
        title: req.body.title,
        courseName: course.courseName,
      });
      if (existingLecture) {
        return next(
          new ErrorResponse(
            "Lecture with the same title already exists in the course"
          )
        );
      }

      const lec = new Lec({
        title: req.body.title,
        description: req.body.description,
        courseData: {
          courseName: course.courseName,
          courseId: course._id,
        },
        doctorData: {
          doctorName: doctor.firstName,
          doctorId: doctor._id,
        },
      });
      const newlec = await lec.save();
      course.lectureId.push(newlec._id);
      await course.save();
      const description = `new Lecture named "${lec.title}" add  in "${course.courseName}" course.`;
      console.log("desc", description);
      const send = await sendNotify(course._id, description);
      console.log(send);
      if (send) {
        return res.json({ send, newlec });
      } else {
        res.json({ message: "notify err" });
      }
    }
  } catch (err) {
    next(err);
  }
};

const updatelectureData = async (req, res, next) => {
  try {
    const lecture = await Lec.findById(req.params.lecId);
    // console.log(lecture.doctorData.doctorId)
    // console.log('idforuser',req.user.id)
    // console.log('doc',lecture.doctorData.docId)
    if (req.user.id == lecture.doctorData.doctorId) {
      const updatelecture = await Lec.findOneAndUpdate(
        { id: lecture._id },
        {
          $set: {
            title: req.body.title,
            desc: req.body.desc,
          },
        }
      );
      const course = await Course.findOne({ name: lecture.courseName });
      // Set duration to unknown since we are no longer calculating it
      await updatelecture.save();

      // Send notification to all subscribers of the course, if any
      const description = `new Lecture named "${lecture.title}" add  in "${course.courseName}" course.`;
      const send = await sendNotify(course._id, description);
      console.log(send);
      if (send) return res.json({ send: "update data done successful" });
    } else {
      res.send("You can only update your own lecture");
    }
  } catch (err) {
    next(err);
  }
};
const getLecture = async (req, res) => {
  try {
    const { lectureId, courseId } = req.params;

    // Find the course by courseId and populate the lectureId field
    const course = await Course.findOne({ _id: courseId }).populate(
      "lectureId"
    );

    // Check if the course exists
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    const lecture = course.lectureId.find(
      (lec) =>
        lec._id.toString() === lectureId &&
        lec.doctorData.doctorId === req.user.id
    );
    console.log(lecture);

    // Check if the lecture exists
    if (!lecture) {
      return res.status(404).json({ error: "Lecture not found" });
    }

    // Return the lecture
    res.json({ lecture });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updatelectureForVedios = async (req, res, next) => {
  try {
    const lec = await Lec.findById(req.params.id);
    if (req.user.id == lec.doctorData.doctorId) {
      const videos = [];
      if (!req.files || req.files.length === 0) {
        return next(new ErrorResponse("No files uploaded"));
      }
      var totalDuration = 0;
      for (let i = 0; i < req.files.length; i++) {
        const cloudinary = await Cloudinary.uploader.upload(req.files[i].path, {
          folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
          resource_type: "video",
        });
        const durationInSeconds = Math.round(cloudinary.duration);
        const formattedDuration = await formateDuration(durationInSeconds);

        if (isNaN(durationInSeconds)) {
          throw new Error("Invalid duration");
        }
        videos.push({
          public_id: cloudinary.public_id,
          url: cloudinary.url,
          duration: formattedDuration,
        });
        totalDuration += durationInSeconds;
        x = await formateDuration(totalDuration);
      }
      const course = await Course.findOne({ _id: lec.courseData.courseId });
      const oldDurationInSeconds = parseDuration(course.duration);
      const newDurationInSeconds = oldDurationInSeconds + totalDuration;
      course.duration = await formateDuration(newDurationInSeconds);
      await course.save();

      const updatedLec = lec;
      updatedLec.vedios.push(...videos);
      await updatedLec.save();

      res.json({ message: "update done successful" });
    } else {
      re.json({ message: "cant update this lecture " });
    }
  } catch (err) {
    next(err);
  }
};
const updatelectureForImg = async (req, res, next) => {
  try {
    const lec = await Lec.findById(req.params.id);
    const cloudinay = await Cloudinary.uploader.upload(req.file.path, {
      folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
    });
    console.log(cloudinay);
    let updatedLec = lec;
    updatedLec.img.push({
      public_id: cloudinay.public_id,
      url: cloudinay.url,
    });
    await updatedLec.save();

    res.jso(updatedLec);
  } catch (err) {
    next(err);
  }
};

const deleteLecture = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    const lecture = await Lec.findById(req.params.lecId);
    console.log(course.doctorData.doctorId);
    console.log(lecture.doctorData.docId);
    console.log(req.user.id);
    if (
      req.user.id == course.doctorData.doctorId &&
      req.user.id == lecture.doctorData.doctorId
    ) {
      if (!lecture) "course not found";
      await Lec.findByIdAndRemove(lecture);
      if (lecture.length != 0) {
        Cloudinary.api.delete_resources_by_prefix(
          `E-learning/courses/${course.courseName}/${lecture.title}`,
          function (err) {
            if (err && err.http_code !== 404) {
              return callback(err);
            }
            Cloudinary.api.delete_folder(
              `E-learning/courses/${course.courseName}/${lecture.title}`,
              function (err, result) {
                console.log(err);
              }
            );
          }
        );
      }
      res.status(200).json({ Message: "delete lecture successfully" });
    } else {
      res.json({ message: "another user want delete this lecture " });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addLecture,
  updatelectureData,
  updatelectureForVedios,
  deleteLecture,
  updatelectureForImg,
  getLecture,
};
