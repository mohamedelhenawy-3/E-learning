const router=require('express').Router();
const Upload=require('../utils/multer')
const Doctor=require('../Models/doctor-model');
const Cloudinary=require('../utils/clouodinry')
const bcrypt = require("bcrypt")
const auth=require('../middlware/authMiddleware')
// const user=require('../Models/user-model')
const admin=require('../middlware/adminMiddleware')
const Code=require('../Models/specialCode-model')

//signUp
router.post('/signupp',async(req,res)=>{

  let doctor = await Doctor.findOne({ email: req.body.email });
    if (doctor) return res.status(400).send("user already exists!");
   const specialCode= await Code.findOne({code:req.body.code})
   console.log(specialCode.emailDoc)
   if(!specialCode||specialCode.emailDoc!="") return res.status(400).send("ckeck your data inputs")
    const  newdoctor = new Doctor({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        phoneNumber:req.body.phoneNumber,
        email:req.body.email,
        password:req.body.password,
        code:req.body.code
    })
    const salt = await bcrypt.genSalt(10);  
    specialCode.emailDoc=newdoctor.email
    await specialCode.save()
    newdoctor.password = await bcrypt.hash(newdoctor.password, salt);
   const saveddoctor= await newdoctor.save();
    //For make the user register and created the token by the way
    res
      .header("x-auth-token", newdoctor.generateAuthToken())
      .status(200)
      .json(saveddoctor);
})

router.post("/login",async (req, res) => {
  //find user by one of his attributes
  let doctor = await Doctor.findOne({ email: req.body.email });
  if (!doctor) return res.status(400).send("Email or Password invalid!!");

  const validPassword = await bcrypt.compare(
    req.body.password,
    doctor.password
  );
  if (!validPassword)
  return res.status(400).send("Email or Password invalid!!");
  res.json(doctor.generateAuthToken());
});

router.get("/",[auth],async(req,res)=>{
    const doctors =await Doctor.find();
    res.json({doctors})
})
router.get("/:docId",[auth],async(req,res)=>{
  const doctor=await Doctor.findById(req.params.docId).populate("profileimg")
  console.log(doctor)
   res.json({doctor})
})

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
  

