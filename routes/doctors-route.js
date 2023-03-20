const router=require('express').Router();
const Upload=require('../utils/multer')
const Doctor=require('../Models/doctor-model');
const Cloudinary=require('../utils/clouodinry')
const bcrypt = require("bcrypt")
const auth=require('../middlware/authMiddleware')
// const user=require('../Models/user-model')
const admin=require('../middlware/adminMiddleware')
const Code=require('../Models/specialCode-model')
const ErrorResponse=require('../utils/errorResponse')
//signUp
router.post('/signup',async(req,res,next)=>{
try{  let doctor = await Doctor.findOne({ email: req.body.email });
if (doctor) return next(new ErrorResponse(`email or pass omvalid `))
const specialCode= await Code.findOne({code:req.body.code})
console.log(specialCode.emailDoc)
if(!specialCode||specialCode.emailDoc!="") return next(new ErrorResponse(`check you input data`))
const  newdoctor = new Doctor({
    firstName:req.body.firstName,
    lastName:req.body.lastName,
    email:req.body.email,
    password:req.body.password,
    code:req.body.code,
  
  
})
const salt = await bcrypt.genSalt(10);  
specialCode.emailDoc=newdoctor.email
await specialCode.save()
newdoctor.password = await bcrypt.hash(newdoctor.password, salt);
const saveddoctor= await newdoctor.save();
res
  .header("x-auth-token", newdoctor.generateAuthToken())
  .status(200)
  .json(saveddoctor);}
  catch(err){
    next(err)
  }

})

router.post("/login",async (req, res,next) => {
  try{
      //find user by one of his attributes
  let doctor = await Doctor.findOne({ email: req.body.email });
  if (!doctor) return  next(new ErrorResponse(`email or password invalid`))
  const validPassword = await bcrypt.compare(
    req.body.password,
    doctor.password
  );
  if (!validPassword)  return  next(new ErrorResponse(`email or password invalid`))
  res.json(doctor.generateAuthToken());
  }
  catch(err){
    next(err)
  }

});

router.get("/",[auth],async(req,res,next)=>{
  try{
    const doctors =await Doctor.find();
    if(!doctors) return  next(new ErrorResponse(`cant find any doctors`))
    res.json({doctors})
  }catch(err){
    next(err)
  }
})
router.get("/:docId",[auth],async(req,res,next)=>{
  try{
    const doctor=await Doctor.findById(req.params.docId).populate("profileimg")
    console.log(doctor)
    if(!doctor)  return  next(new ErrorResponse(`cant find that doctor ${req.params.docId}`))
     res.json({doctor})
  }catch(err){
    next(err)
  }

})

router.put("/doctorprofile/:id",[auth],Upload.single('image'),async (req,res,next)=>{
  try{
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
  }catch(err){
      next(err)
  }

 
  })
  router.put("/docData/:docId",[auth],async(req,res,next)=>{
    try{
       const updatedoctor=await Doctor.findOneAndUpdate({"id":req.params.docId},{
      $set:{
           name:req.body.name      
      }
  })
  res.status(200).json(updatedoctor)
  }catch(err){
    next(err)
  }
    
  })



  
  module.exports = router;
  

