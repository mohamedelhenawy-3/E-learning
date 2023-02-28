const _ = require("lodash");
const auth=require('../middlware/authMiddleware')
const admin=require('../middlware/adminMiddleware')
const router=require('express').Router();
const bcrypt = require("bcrypt");
const { findOneAndUpdate } = require('../Models/user-model');
const User=require('../Models/user-model');
const Cloudinary=require('../utils/clouodinry')
const Upload=require('../utils/multer')
const  ErrorResponse=require('../utils/errorResponse')
//signUp..
router.post("/signup", async (req, res,next) => {  
    //find one search in db if the customer in db or no if find send aleady exist 
    try{
      
     let user = await User.findOne({ email: req.body.email });
     if (user)  return  next(new ErrorResponse(`user exists `))
     user = new User(
       _.pick(req.body, [
         "firstName",
         "lastName",
         "phoneNumber",
         "dateOfBirth",
         "jobTitle",
         "country",
         "email",
         "password"
       ])
     );
                  //#####RRRTTRTWRTRjkbhwuigybvrfhjvuer###%#
   
     //salt for add ######## when using hash pass 
          
     const salt = await bcrypt.genSalt(10);  
     user.password = await bcrypt.hash(user.password, salt);
    const saveduser= await user.save();
   
     //For make the user register and created the token by the way
     res
       .header("x-auth-token", user.generateAuthToken())
       .status(200)
       .json(saveduser); //send token//................................
    }catch(err){
      next(err)
    }
  });
  //login
  router.post("/login",async (req, res,next) => {
    try{
     //find user by one of his attributes
  let user = await User.findOne({ email: req.body.email });
  if (!user) return  next(new ErrorResponse(`Email or Password invalid!!`))

  const validPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validPassword) return  next(new ErrorResponse(`Email or Password invalid!!`))
  res.json(user.generateAuthToken());
    }catch(err){
      next(err)
    }
  
});
//upload images or files
router.post('/',[auth],async(req,res,next)=>{
  try{
  
    const user=new User({
      name:req.body.name,
   })
   console.log(user)
   const newuser=await user.save()
   console.log(newuser)
   res.json({newuser})
  }catch(err){
    next(err)
  }
})

router.get('/',[auth],async(req,res,next)=>{
  try{
    const user=await User.find()
    if(!user)   return  next(new ErrorResponse(`cant find that user`))
    res.json({user})
  }catch(err){
    next(err)
  }
    
})
router.put('/:id',[auth],Upload.single('image'),async(req,res,next)=>{
  try{
    const cloudinay=await Cloudinary.uploader.upload(req.file.path)
    return  findOneAndUpdate({"id":req.params.id},{
        $set:{
            cloudinary_id:cloudinay.public_id,
            url:cloudinay.url,
            phoneNumber:req.body.phoneNumber,
            dateOfBirth:req.body.dateOfBirth,
            jobTitle:req.body.jobTitle,
            country:req.country,
        }
    })
  }catch(err){
     next(err)
  }
  
})

function getRandom(length) {
  return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  //ratingfortheCourse

//update for special code 
router.put('/:id',[auth,admin],async(req,res)=>{
  try{
    const user=await User.findById(req.params.id)
    let updateuser= user
    console.log(updateuser)
    updateuser.specialCode.push({
     code:getRandom(9)
    })
    console.log(updateuser)
    const updateadmin=await updateuser.save()
     res.json(updateadmin)
}catch(err){
  next(err)
}
  
})




module.exports=router;