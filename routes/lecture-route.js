const express = require('express');
const router = express.Router();
const Lec = require('../Models/lec-model');
const Course=require('../Models/course-model')
const Cloudinary=require('../utils/clouodinry')
const Upload=require('../utils/multer')
const  ErrorResponse=require('../utils/errorResponse')
const auth=require('../middlware/authMiddleware')

router.post('/lec/:courseId',[auth],async (req, res,next) => {
  try{
    const course=await Course.findById(req.params.courseId)
console.log(course)
const lec = new Lec({
        title: req.body.title,
        desc: req.body.desc,
        courseName:course.course_name
    })
    const newlec = await lec.save();
    console.log(newlec)
    course.lectureId.push(newlec._id)
    await course.save()
    res.status(200).json({
        success: true,
        newlec
    })
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
      url:cloudinay.url
  })
     await updatedLec.save();
     res.send(updatedLec)
  
  }catch(err){
    next(err)
  }
  
})
router.put('/lecvedio/:id',[auth],Upload.single('file'),async(req,res,next)=>{
  try{
    const lec =await Lec.findById(req.params.id)
    const cloudinay=await Cloudinary.uploader.upload(req.file.path,{
      folder:`E-learning/courses/${lec.courseName}/${lec.title}`
    })
    console.log(cloudinay)
    const  updatedLec=lec;
    updatedLec.vedios.push({
     public_id:cloudinay.public_id,
     url:cloudinay.url
 })
 const updatLec= await updatedLec.save();
 res.send(updatLec)
  
  }catch(err){
    next(err)
  }
  
  })
  //update data for lec
  router.put("/lecData/:lecId",[auth],async(req,res,next)=>{
    try{
      const updatelecture=await Lec.findOneAndUpdate({"id":req.params.lecId},{
        $set:{
             title:req.body.title,
             desc:req.body.desc      
        }
    })
    res.status(200).json(updatelecture)
    }catch(err){
      next(err)
    }

 })
 //delete lecture only in spacifice course
 router.delete("/lecture/:lecId/course/:id",[auth],async(req,res)=>{
  try{
    const course= await Course.findById(req.params.id)
  console.log(course._id)
  const lecture=await Lec.findById(req.params.lecId)
  console.log(lecture._id)
  if(!lecture) return "course not found"
  await Lec.findByIdAndRemove(lecture)
  if(lecture.length != 0 ){
  Cloudinary.api.delete_resources_by_prefix(`E-learning/courses/${course.course_name}/${lecture.title}`, function (err) {
  if (err && err.http_code !== 404) {
      return callback(err);
  }
   Cloudinary.api.delete_folder(`E-learning/courses/${course.course_name}/${lecture.title}`,function(err,result){
          console.log(err)
      });
    })
}
res.status(200).json({Message:"delete lecture successfully"})
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