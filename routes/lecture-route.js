const express = require('express');
const moment = require('moment');
const router = express.Router();
const Lec = require('../Models/lec-model');
const Doctor=require('../Models/doctor-model')
const Course=require('../Models/course-model')
const Cloudinary=require('../utils/clouodinry')
const Upload=require('../utils/multer')
const  ErrorResponse=require('../utils/errorResponse')
const auth=require('../middlware/authMiddleware')
const {sendNotify}=require('../utils/sendNotifications')
// const {calculateDuration, getDuration}=require('../utils/calculateDuration')
// const { getVideoDurationInSeconds } = require('get-video-duration')
router.post('/lec/:courseId/:docId',[auth],async (req, res,next) => {
  try{
    const course=await Course.findById(req.params.courseId)
    const doctor=await Doctor.findById(req.params.docId)

    const users=course.enroll
  
console.log(course.doctorData.doctorId)
console.log(req.user.id)

    if(req.user.id == course.doctorData.doctorId){
      let lec = await Lec.findOne({ title: req.body.title });
      if (lec) return next(new ErrorResponse(`the lecture already existed`))
        lec = new Lec({
         title: req.body.title,
         description: req.body.description,
         courseName:course.courseName,
         doctorData:{
               doctorName:doctor.firstName,
               doctorId:doctor._id
           },
       })
       const newlec = await lec.save();
       course.lectureId.push(newlec._id)
       await course.save()
       const sent = await sendNotify(users, 'there is change in your lecture');
       if(sent){
           return res.json({message:"notify send success",users,newlec})
      }else{
        res.json({message:"this lecture not related to this course"})
      }
    }
  }catch(err){
    next(err)
  }

});
router.put('/lecimg/:id',[auth],Upload.single('image'),async(req,res,next)=>{
  try{
    const lec =await Lec.findById(req.params.id)
    const cloudinay=await Cloudinary.uploader.upload(req.file.path,{
      folder:`E-learning/courses/${lec.courseName}/${lec.title}`
    })
    console.log(cloudinay)
     let updatedLec=lec;
     updatedLec.img.push({
      public_id:cloudinay.public_id,
      url:cloudinay.url,

  })
     await updatedLec.save();
     res.send(updatedLec)
  
  }catch(err){
    next(err)
  }
  
})


  //update data for lec
  router.put("/lectureData/:lecId",[auth],async(req,res,next)=>{

    
    try{
      const lecture=await Lec.findById(req.params.lecId)
      if(req.user.id == lecture.doctorData.docId){
        const updatelecture=await Lec.findOneAndUpdate({"id":lecture._id},{
          $set:{
               title:req.body.title,
               desc:req.body.desc      
          }
      })
      res.status(200).json(updatelecture)
      }else{
        res.json({message: "another user update this lecture "})
      }
     
    }catch(err){
      next(err)
    }

 })
 //delete lecture only in spacifice course
 router.delete("/lecture/:lecId/course/:id",[auth],async(req,res)=>{
  try{
  const course= await Course.findById(req.params.id)
  const lecture=await Lec.findById(req.params.lecId)
  console.log(lecture._id)
  if(req.user.id == course.doctorData.doctorId && req.user.id == lecture.doctorData.docId){
    if(!lecture)  "course not found"
    await Lec.findByIdAndRemove(lecture)
    if(lecture.length != 0 ){
    Cloudinary.api.delete_resources_by_prefix(`E-learning/courses/${course.courseName}/${lecture.title}`, function (err) {
    if (err && err.http_code !== 404) {
        return callback(err);
    }
     Cloudinary.api.delete_folder(`E-learning/courses/${course.courseName}/${lecture.title}`,function(err,result){
            console.log(err)
        });
      })
  }
  res.status(200).json({Message:"delete lecture successfully"})
  }else{
    res.json({message:"another user want delete this lecture "})
  }
  }catch(err){
    next(err)
  }
  
})

router.put('/:id', [auth], Upload.array('files'), async (req, res, next) => {
  try {
    const lec = await Lec.findById(req.params.id)
    console.log(req.files)
    if (req.user.id == lec.doctorData.doctorId) {
      const videos = [];

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({error: 'No files uploaded'})
      }

      for (let i = 0; i < req.files.length; i++) {
        const cloudinary = await Cloudinary.uploader.upload(req.files[i].path, {
          folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
          resource_type: "video"
        })

        videos.push({
          public_id: cloudinary.public_id,
          url: cloudinary.url,
          duration: cloudinary.video.duration
        });
      }

      const updatedLec = lec;
      updatedLec.vedios.push(...videos);
      await updatedLec.save();

      // Calculate the total duration of all the videos in the course
      const course = await Course.findOne({ name: lec.courseName });
      let totalDuration = 0;
      for (let i = 0; i < course.lectureId.length; i++) {
        const lecture = await Lec.findById(course.lectureId[i]);
        for (let j = 0; j < lecture.vedios.length; j++) {
          totalDuration += lecture.vedios[j].duration;
        }
      }

      const durationInHours = Math.floor(totalDuration / 3600);
      const durationInMinutes = Math.floor((totalDuration % 3600) / 60);
      const durationInSeconds = Math.floor(totalDuration % 60);
      const durationFormatted = `${durationInHours}:${durationInMinutes}:${durationInSeconds}`;

      course.duration = durationFormatted;
      await course.save();

      res.json({ message: "Updated successfully" });

    } else {
      res.send('You can only update your own lecture')
    }

  } catch (err) {
    next(err)
  }
});
async function getVideoDuration(videoUrl) {
  const probe = await ffmpeg.probe(videoUrl);
  const duration = probe.format.duration;

  return duration;
}
router.put('/:id/videos', [auth], Upload.array('videos'), async (req, res, next) => {
  try {
    const lec = await Lec.findById(req.params.id);

    if (req.user.id != lec.doctorData.doctorId) {
      return res.status(403).json({ error: 'You are not authorized to update this lecture' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No videos uploaded' });
    }

    const videos = [];
    for (let i = 0; i < req.files.length; i++) {
      const videoPath = req.files[i].path;
      const cloudinaryResult = await Cloudinary.uploader.upload(videoPath, {
        folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
        resource_type: "video"
      });

      videos.push({
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.url,
        duration: cloudinaryResult.video.duration
      });
    }

    const totalVideoDuration = videos.reduce((acc, video) => acc + video.duration, 0);
    const durationInHours = Math.floor(totalVideoDuration / 3600);
    const durationInMinutes = Math.floor((totalVideoDuration % 3600) / 60);
    const durationInSeconds = Math.floor(totalVideoDuration % 60);
    const durationFormatted = `${durationInHours}:${durationInMinutes}:${durationInSeconds}`;

    const updatedLec = await Lec.findByIdAndUpdate(
      req.params.id,
      {
        $push: { vedios: { $each: videos } },
        durationOfLecture: totalVideoDuration,
        durationOfLectureFormatted: durationFormatted
      },
      { new: true }
    );

    const course = await Course.findOne({ name: lec.courseName });
    const lectureDurations = await Lec.aggregate([
      { $match: { _id: { $in: course.lectureId } } },
      { $group: { _id: null, totalDuration: { $sum: "$durationOfLecture" } } }
    ]);
    
    const totalCourseDuration = (lectureDurations && lectureDurations.length > 0) ? lectureDurations[0].totalDuration : 0;
    
    // const lectureDurations = await Lec.aggregate([
    //   { $match: { _id: { $in: course.lectureId } } },
    //   { $group: { _id: null, totalDuration: { $sum: "$durationOfLecture" } } }
    // ]);

    // const totalCourseDuration = lectureDurations[0].totalDuration;
    const courseDurationInHours = Math.floor(totalCourseDuration / 3600);
    const courseDurationInMinutes = Math.floor((totalCourseDuration % 3600) / 60);
    const courseDurationInSeconds = Math.floor(totalCourseDuration % 60);
    const courseDurationFormatted = `${courseDurationInHours}:${courseDurationInMinutes}:${courseDurationInSeconds}`;

    course.duration = totalCourseDuration;
    course.durationFormatted = courseDurationFormatted;
    await course.save();

    res.json({ message: "Videos uploaded successfully", lecture: updatedLec, courseDuration: courseDurationFormatted });
  } catch (err) {
    next(err);
  }
});
router.put('/:id/videos', [auth], Upload.array('videos'), async (req, res, next) => {
  try {
    const lec = await Lec.findById(req.params.id);

    if (req.user.id != lec.doctorData.doctorId) {
      return res.status(403).json({ error: 'You are not authorized to update this lecture' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No videos uploaded' });
    }

    const videos = [];
    for (let i = 0; i < req.files.length; i++) {
      const videoPath = req.files[i].path;
      const cloudinaryResult = await Cloudinary.uploader.upload(videoPath, {
        folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
        resource_type: "video"
      });

      videos.push({
        public_id: cloudinaryResult.public_id,
        url: cloudinaryResult.url,
        duration: cloudinaryResult.video.duration
      });
    }

    const totalVideoDuration = videos.reduce((acc, video) => acc + video.duration, 0);
    const durationInHours = Math.floor(totalVideoDuration / 3600);
    const durationInMinutes = Math.floor((totalVideoDuration % 3600) / 60);
    const durationInSeconds = Math.floor(totalVideoDuration % 60);
    const durationFormatted = `${durationInHours}:${durationInMinutes}:${durationInSeconds}`;

    const updatedLec = await Lec.findByIdAndUpdate(
      req.params.id,
      {
        $push: { vedios: { $each: videos } },
        durationOfLecture: totalVideoDuration,
        durationOfLectureFormatted: durationFormatted
      },
      { new: true }
    );
 console.log(durationOfLecture)
    const course = await Course.findOne({ name: lec.courseName });
    const lectureDurations = await Lec.aggregate([
      { $match: { _id: { $in: course.lectureId } } },
      { $group: { _id: null, totalDuration: { $sum: "$durationOfLecture" } } }
    ]);
    
    const totalCourseDuration = (lectureDurations && lectureDurations.length > 0) ? lectureDurations[0].totalDuration : 0;
    
    const courseDurationInHours = Math.floor(totalCourseDuration / 3600);
    const courseDurationInMinutes = Math.floor((totalCourseDuration % 3600) / 60);
    const courseDurationInSeconds = Math.floor(totalCourseDuration % 60);
    const courseDurationFormatted = `${courseDurationInHours}:${courseDurationInMinutes}:${courseDurationInSeconds}`;

    course.duration = totalCourseDuration;
    course.durationFormatted = courseDurationFormatted;
    await course.save();

    res.json({ message: "Videos uploaded successfully", lecture: updatedLec, courseDuration: courseDurationFormatted });
      
        } catch (err) {
          next(err)
        }
      });



  
module.exports = router;