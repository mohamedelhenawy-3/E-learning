const router=require('express').Router();
const Upload=require('../utils/multer')
const Doctor=require('../Models/doctor-model');
const Cloudinary=require('../utils/clouodinry')
const Course=require('../Models/course-model')

router.get("/",async(req,res)=>{
    const doctors =await Doctor.find();
    res.json({doctors})
})
router.get("/:docId",async(req,res)=>{
  const doctor=await Doctor.findById(req.params.docId).populate("profileimg")
  console.log(doctor)
   res.json({doctor})
})

  router.post("/dds",async(req,res)=>{
    const doctor=new Doctor({
        name:req.body.name, 
     })
     const newdoctor=await doctor.save()
     console.log(newdoctor)
     res.json({newdoctor})
}); 
router.put("/doctorprofile/:id",Upload.single('image'),async (req,res)=>{
  const doctor=await Doctor.findById(req.params.id);
  const cloudinay=await Cloudinary.uploader.upload(req.file.path,{
    folder:`${doctor._id}` })

   const updateDoc=doctor
   updateDoc.profileimg.push({
        public_id:cloudinay.public_id,
        url:cloudinay.url
    })
    const updateDoctors=await updateDoc.save()
    res.status(200).json({updateDoctors})
 
  })
  router.put("/docData/:docId",async(req,res)=>{
     const updatedoctor=await Doctor.findOneAndUpdate({"id":req.params.docId},{
          $set:{
               name:req.body.name      
          }
      })
      res.status(200).json(updatedoctor)
  })



  
  module.exports = router;
  

