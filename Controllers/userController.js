const _ = require("lodash");
const bcrypt = require("bcrypt");
const {User,validateUser}=require('../Models/user-model');
const Cloudinary=require('../utils/clouodinry')
const Upload=require('../utils/multer')
const  ErrorResponse=require('../utils/errorResponse')

const SignUp=async (req, res,next) => {  
    try{

      const { error } = validateUser(req.body);
      if (error) return next(new ErrorResponse(error.details[0].message));
      
     let user = await User.findOne({ email: req.body.email });
     if (user)  return  next(new ErrorResponse(`user exists `))
     user = new User(
       _.pick(req.body, [
         "firstName",
         "lastName",
         "email",
         "password"
       ])
     );
     const salt = await bcrypt.genSalt(10);  
     user.password = await bcrypt.hash(user.password, salt);
    const saveduser= await user.save();
     res
       .header("x-auth-token", user.generateAuthToken())
       .status(200)
       .json(saveduser); //send token//................................
    }catch(err){
      next(err)
    }
  };

  const getUsers=async(req,res,next)=>{
    try{
      const allUsers=await User.find()
      if(!allUsers)   return  next(new ErrorResponse(`cant find that user`))
      res.json({allUsers})
    }catch(err){
      next(err)
    }
      
  };

  const updateProfile=(Upload.single('image'),async(req,res,next)=>{
    try {
    
  
      const user = await User.findById(req.params.userId);
      console.log(user._id)
      const cloudinary = await Cloudinary.uploader.upload(req.file.path, {
        folder: `${user._id}`
      })
  
      const updateUser = user;
      if (updateUser.profileimg) {
        updateUser.profileimg.public_id = cloudinary.public_id;
        updateUser.profileimg.url = cloudinary.url;
      } else {
        updateUser.profileimg = {
          public_id: cloudinary.public_id,
          url: cloudinary.url
        };
      }
  
      const update = await updateUser.save();
      res.status(200).json({
        update
      });
    } catch (err) {
      next(err)
    }
})
const updateUser=async(req,res,next)=>{

    try{
       const updateData=await User.findOneAndUpdate({"id":req.params.userId},{
      $set:{
           firstName:req.body.firstName,
           lastName:req.body.lastName      
      }
  })
  await updateData.save()
  res.status(200).json({message:"profile data updated success"})
  }catch(err){
    next(err)
  }
    
  }

 module.exports = {
    SignUp,
    getUsers,
    updateProfile,
    updateUser
  };
  