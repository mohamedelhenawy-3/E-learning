const { Lec, validateLec } = require("../Models/lec-model");
const { Doctor } = require("../Models/doctor-model");
const { Course } = require("../Models/course-model");
const Cloudinary = require("../utils/clouodinry");
const Upload = require("../utils/multer");
const ErrorResponse = require("../utils/errorResponse");
const auth = require("../middlware/authMiddleware");
const { sendNotify } = require("../utils/sendNotifications");





const addLecture=async (req, res, next) => {
    try {
      const course = await Course.findById(req.params.courseId);
      const doctor = await Doctor.findById(req.params.docId);
      console.log("courseId", course._id);
      if (req.user.id == course.doctorData.doctorId) {
        let lec = await Lec.findOne({ title: req.body.title });
        if (lec) return next(new ErrorResponse(`the lecture already existed`));
        lec = new Lec({
          title: req.body.title,
          description: req.body.description,
          courseName: course.courseName,
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

const updatelectureData= async (req, res, next) => {
    try {
      const lecture = await Lec.findById(req.params.lecId);
      if (req.user.id == lecture.doctorData.docId) {
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

const updatelectureForVedios= (Upload.array("files"),async (req, res, next) => {
    try {
      const lec = await Lec.findById(req.params.id);
      console.log(req.files);
      if (req.user.id == lec.doctorData.doctorId) {
        const videos = [];

        if (!req.files || req.files.length === 0) {
          return res.status(400).json({ error: "No files uploaded" });
        }

        for (let i = 0; i < req.files.length; i++) {
          const cloudinary = await Cloudinary.uploader.upload(
            req.files[i].path,
            {
              folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
              resource_type: "video",
            }
          );

          videos.push({
            public_id: cloudinary.public_id,
            url: cloudinary.url,
          });
        }

        const updatedLec = lec;
        updatedLec.vedios.push(...videos);
        await updatedLec.save();

        const course = await Course.findOne({ name: lec.courseName });
        course.duration = "Unknown"; // Set duration to unknown since we are no longer calculating it
        await course.save();

        // Send notification to all subscribers of the course, if any
        const description = `new Lecture named "${lec.title}" add  in "${course.courseName}" course.`;
        const send = await sendNotify(course._id, description);
        console.log(send);
        if (send) return res.json({ send: "update done successful" });
      } else {
        res.send("You can only update your own lecture");
      }
    } catch (err) {
      next(err);
    }
  })
const updatelectureForImg=(Upload.single("image"),async (req, res, next) => {
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
})

 const deleteLecture=async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      const lecture = await Lec.findById(req.params.lecId);
      console.log(lecture._id);
      if (
        req.user.id == course.doctorData.doctorId &&
        req.user.id == lecture.doctorData.docId
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
    updatelectureForImg

  };
  