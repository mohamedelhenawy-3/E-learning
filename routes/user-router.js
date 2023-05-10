const router=require('express').Router();
const admin=require('../middlware/adminMiddleware');
const auth=require('../middlware/authMiddleware');


const Upload=require('../utils/multer')
const {
  getUsers,
  SignUp,
  enrolledCourses,
  updateProfile,
  updateUser,
  deleteProfilePicture,
  getUserProfile,
  lecView
} = require("../Controllers/userController");

router.get("/",[auth,admin],getUsers); 

router.post("/signup",SignUp); 
router.get("/enrolledCourses/:userId",[auth],enrolledCourses)
router.put("/updateProfile/:userId",[auth],Upload.single('image'),updateProfile);
router.put("/:userId",[auth],updateUser);
router.delete("/:userId/profileImage",[auth],deleteProfilePicture)
router.get('/:userId/userProfile',[auth],getUserProfile)
//lecture view 
router.get('/:userId/:courseId/:lectureId',[auth],lecView)

module.exports=router;














// router.post("/signup", async (req, res,next) => {  
//     try{

//       const { error } = validateUser(req.body);
//       if (error) return next(new ErrorResponse(error.details[0].message));
      
//      let user = await User.findOne({ email: req.body.email });
//      if (user)  return  next(new ErrorResponse(`user exists `))
//      user = new User(
//        _.pick(req.body, [
//          "firstName",
//          "lastName",
//          "email",
//          "password"
//        ])
//      );
//      const salt = await bcrypt.genSalt(10);  
//      user.password = await bcrypt.hash(user.password, salt);
//     const saveduser= await user.save();
//      res
//        .header("x-auth-token", user.generateAuthToken())
//        .status(200)
//        .json(saveduser); //send token//................................
//     }catch(err){
//       next(err)
//     }
//   });


// router.get('/',[auth],async(req,res,next)=>{
//   try{
//     const user=await User.find()
//     if(!user)   return  next(new ErrorResponse(`cant find that user`))
//     res.json({user})
//   }catch(err){
//     next(err)
//   }
    
// })

//Update profile
// router.put('/:id',[auth],Upload.single('image'),async(req,res,next)=>{

//   try {
//     const { error } = validateUser(req.body);
//       if (error) return next(new ErrorResponse(error.details[0].message));

//     const user = await User.findById(req.params.id);
//     const cloudinary = await Cloudinary.uploader.upload(req.file.path, {
//       folder: `${doctor._id}`
//     })

//     const updateUser = user;
//     if (updateUser.profileimg) {
//       updateUser.profileimg.public_id = cloudinary.public_id;
//       updateUser.profileimg.url = cloudinary.url;
//     } else {
//       updateUser.profileimg = {
//         public_id: cloudinary.public_id,
//         url: cloudinary.url
//       };
//     }

//     const update = await updateUser.save();
//     res.status(200).json({
//       update
//     });
//   } catch (err) {
//     next(err)
//   }
  //Update userData
  // router.put("/:userId",[auth],async(req,res,next)=>{

  //   try{
  //     const { error } = validateUser(req.body);
  //     if (error) return next(new ErrorResponse(error.details[0].message));

  //      const updateUser=await User.findOneAndUpdate({"id":req.params.userId},{
  //     $set:{
  //          firstName:req.body.firstName,
  //          lastName:req.body.lastName      
  //     }
  // })
  // res.status(200).json(updateUser)
  // }catch(err){
  //   next(err)
  // }
    
  // })
 
// })

// function getRandom(length) {
//   return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
//   }

// router.put('/:adminId',[auth,admin],async(req,res)=>{
//   try{
//     const user=await User.findById(req.params.adminId)
//     let updateuser= user
//     console.log(updateuser)
//     updateuser.specialCode.push({
//      code:getRandom(9)
//     })
//     console.log(updateuser)
//     const updateadmin=await updateuser.save()
//      res.json(updateadmin)
// }catch(err){
//   next(err)
// }
  
// })




