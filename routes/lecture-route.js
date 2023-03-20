const express = require('express');
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
const { getVideoDurationInSeconds } = require('get-video-duration')
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
// router.put('/:id',[auth],Upload.single('file'),async(req,res,next)=>{
//   try{
    
//     const lec =await Lec.findById(req.params.id)

//     if(req.user._id == lec.doctorData.docId){
//     const cloudinay=await Cloudinary.uploader.upload(req.file.path,{
//       folder:`E-learning/courses/${lec.courseName}/${lec.title}`,
//       resource_type:"video"
//     })

//     let  updatedLec=lec;
//     updatedLec.vedios.push({
//      public_id:cloudinay.public_id,
//      url:cloudinay.url,
//  })
//  await updatedLec.save();
//  res.send(updatedLec)
//   }else{
//   res.send('you should update in your own lecture')
//   }
  
//   }catch(err){
//     next(err)
//   }
  
//   })
router.put('/:id', [auth], Upload.array('files', 1), async (req, res, next) => {
  try {
    const lec = await Lec.findById(req.params.id)
    console.log(req.files)
    if (req.user.id == lec.doctorData.doctorId) {
      const videoss = [];

      if (Array.isArray(req.files)) {
        for (let i = 0; i < req.files.length; i++) {
          const cloudinary = await Cloudinary.uploader.upload(req.files[i].path, {
            folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
            resource_type: "video"
          })
       console.log(req.files[0].path)
          videoss.push({
            public_id: cloudinary.public_id,
            url: cloudinary.url,
          });
          console.log('3')
        }
      }
      else if (req.file) {
        const cloudinary = await Cloudinary.uploader.upload(req.files.path, {
          folder: `E-learning/courses/${lec.courseName}/${lec.title}`,
          resource_type: "video"
        })
        console.log("455")

        videoss.push({
          public_id: cloudinary.public_id,
          url: cloudinary.url,
        });
      }
      const updatedLec = lec;
      updatedLec.vedios.push(...videoss);
      const x= await updatedLec.save();
      const sent = await sendNotify(users, 'there is change in your lecture');
      if(sent){
          return res.json({message:"notify send success",users,x})
     }else{
       res.json({message:"this lecture not related to this course"})
     }
    
    } else {
      res.send('you should update in your own lecture')
    }

  } catch (err) {
    next(err)
  }

});


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




  // router.put('/pdf/:id',Upload.single('file'),async(req,res)=>{
  //    const cloudinay=await Cloudinary.uploader.upload(req.file.path,{folder:"pdf"})
  //   console.log(cloudinay)
  //   const lec =await Lec.findById(req.params.id)
  //   let updatedLec=lec;
  //   updatedLec.decument.push({
  //    public_id:cloudinay.public_id,
  //    url:cloudinay.url
  //   })
  //   await updatedLec.save();
  //   res.send(updatedLec)
  // })

module.exports = router;