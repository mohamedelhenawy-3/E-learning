const { Course, validateCourse } = require("../Models/course-model");
const { Doctor } = require("../Models/doctor-model");
const Cloudinary = require("../utils/clouodinry");
const { Lecture } = require("../Models/lec-model");
const ErrorResponse = require("../utils/errorResponse");
const { User } = require("../Models/user-model");

const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate("lectureId");
    if (!course)
      return next(
        new ErrorResponse(`Cant find Cours with id ${req.params.id}`)
      );
    res.status(200).json(course);
  } catch (err) {
    next(err);
  }
};
const postCourse = async (req, res, next) => {
  try {
    const { error } = validateCourse(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message));

    let course = await Course.findOne({ courseName: req.body.courseName });
    if (course) return next(new ErrorResponse(`the coures already existed`));
    const doctor = await Doctor.findById(req.params.docId);
    course = new Course({
      courseName: req.body.courseName,
      doctorData: {
        firstName: doctor.firstName,
        doctorId: doctor._id,
      },
      description: req.body.description,
    });
    const newcourse = await course.save();
    console.log(newcourse._id);
    doctor.courses.push(newcourse._id);
    await doctor.save();
    res.status(200).json({ newcourse });
  } catch (err) {
    next(err);
  }
};
const updateCourseData = async (req, res, next) => {
  try {
    const { error } = validateCourse(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message));
    const course = await Course.findById(req.params.courseId);
    if (req.user._id == course.doctorData.doctorId) {
      const updateCourseData = await Course.findOneAndUpdate(
        { id: course._id },
        {
          $set: {
            courseName: req.body.courseName,
            description: req.body.description,
          },
        }
      );
      res.status(200).json(updateCourseData);
    } else {
      res.json({ message: "another user want to update the course " });
    }
  } catch (err) {
    next(err);
  }
};

const updateCourse = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const course = await Course.findById(courseId);
    if (!course) {
      return next(new ErrorResponse('cant find this course'))
    }

    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new ErrorResponse( 'cant find this use'))
    }

    if (user.enrolledCourses.includes(courseId)) {
      await user.updateOne({ $pull: { enrolledCourses: courseId } });
      await course.updateOne({ $pull: { enroll: userId } });
      res.status(200).send("Unenrolled from course");
    } else {
      await user.updateOne({ $push: { enrolledCourses: courseId } });
      await course.updateOne({ $push: { enroll: userId } });
      res.status(200).send("Enrolled in course");
    }
  } catch (err) {
    next(err);
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate(
      "lectureId"
    );
    if (req.user._id == course.doctorData.doctorId) {
      if (!course)
        return next(
          new ErrorResponse(`Cant find Course with rhis id : ${req.params.courseId}`)
        );
      course.lectureId.map(async (lecture) => {
        await Lecture.findByIdAndDelete(lecture._id);
      });
      await Course.findByIdAndRemove(course);
      if (course.lectureId.length != 0) {
        Cloudinary.api.delete_resources_by_prefix(
          `E-learning/courses/${course.courseName}`,
          function (err) {
            if (err && err.http_code !== 404) {
              return callback(err);
            }
            Cloudinary.api.delete_folder(
              `E-learning/courses/${course.courseName}`,
              function (err, result) {
                console.log(err);
              }
            );
          }
        );
      }
    }
  } catch (err) {
    next(err);
  }
};
const getCourses = async (req, res) => {
  try {
    const course = await Course.find();
    if (!course) return next(new ErrorResponse(`Cant find any Courses`));

    res.status(200).json({ course });
  } catch (err) {
    next(err);
  }
};
const getquizResponses = async (req, res) => {
  const { courseId } = req.params;

  try {
    const course = await Course.findById(courseId).populate({
      path: "quizResponses",
      populate: [
        { path: "userId", model: "User", select: "firstName lastName" },
        {
          path: "quizId",
          model: "Quiz",
          populate: { path: "questions", model: "Question", select: "mark" },
        },
      ],
    });

    if (!course) {
      return next(new ErrorResponse( 'Course not found'))
    }
    const user = await User.findById(req.user._id);
    console.log(course.doctorData);
    if (course.doctorData && course.doctorData.doctorId === req.user.id) {
      const quizResponses = course.quizResponses;
      res.send(quizResponses);
    } else {
      return res
        .status(403)
        .send(
          "Unauthorized access. Only the course creator can create quizzes for the course."
        );
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while fetching quiz responses.");
  }
};

module.exports = {
  getquizResponses,
  getCourse,
  postCourse,
  updateCourse,
  deleteCourse,
  updateCourseData,
  getCourses,
};
