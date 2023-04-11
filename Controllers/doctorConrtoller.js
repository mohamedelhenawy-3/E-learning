
const {Doctor,validateDoctor}=require('../Models/doctor-model');
const Cloudinary=require('../utils/clouodinry')
const bcrypt = require("bcrypt")
const ErrorResponse=require('../utils/errorResponse')

const SignUp=async(req,res,next)=>{
    const { error } =validateDoctor(req.body);
    if (error) return next(new ErrorResponse(error.details[0].message));
  
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
    .json({saveddoctor});}
    catch(err){
      next(err)
    }
  
  }
  

  const getAllDoctors=async(req,res,next)=>{
    try{
      const doctors =await Doctor.find();
      if(!doctors) return  next(new ErrorResponse(`cant find any doctors`))
      res.json({doctors})
    }catch(err){
      next(err)
    }
  }
  const updateProfile= async (req, res, next) => {
    try {
      const doctor = await Doctor.findById(req.params.doctorId);
      const cloudinary = await Cloudinary.uploader.upload(req.file.path, {
        folder: `/ProfileDoctor/${doctor._id}`
      })
  
      const updateDoc = doctor;
      if (updateDoc.profileimg) {
        updateDoc.profileimg.public_id = cloudinary.public_id;
        updateDoc.profileimg.url = cloudinary.url;
      } else {
        updateDoc.profileimg = {
          public_id: cloudinary.public_id,
          url: cloudinary.url
        };
      }
  
      const updateDoctors = await updateDoc.save();
      res.status(200).json({
        updateDoctors
      });
    } catch (err) {
      next(err)
    }
  };
const updateDoctor=async(req,res,next)=>{

    try{
     const updateData=await Doctor.findOneAndUpdate({"id":req.params.docId},{
      $set:{
        firstName :req.body.firstName,
        lastName: req.body.firstName
      }
  })
  await updateData.save();
  res.status(200).json({message:"profile data updated success"})
  }catch(err){
    next(err)
  }
    
  }
  const deleteProfilePicture=async(req,res,next)=>{
    try{
    const doctor=await Doctor.findById(req.params.doctorId);
    if(doctor._id == req.user.id){
      if (doctor.profileimg.length != 0) {
        Cloudinary.api.delete_resources_by_prefix(
          `/ProfileDoctor/${doctor._id}`,
          function (err) {
            if (err && err.http_code !== 404) {
              return callback(err);
            }
            Cloudinary.api.delete_folder(
              `/ProfileDoctor/${doctor._id}`,
              function (err, result) {
                console.log(err);
              }
            );
          }
        );
      }
      doctor.profileimg = null;
      await doctor.save();
    }else{
      res.json({message:"another user try to delete profile picture"})
    } 
    res.status(200).json({message:"profile image deleted successfully"})
  }
  catch(err){
    next(err)
  }
  }

 module.exports = {
    SignUp,
    getAllDoctors,
    updateProfile,
    updateDoctor,
    deleteProfilePicture
  };
  