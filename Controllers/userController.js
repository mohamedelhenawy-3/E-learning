const _ = require("lodash");
const bcrypt = require("bcrypt");
const {User,validateUser}=require('../Models/user-model');
const Cloudinary=require('../utils/clouodinry')
const  ErrorResponse=require('../utils/errorResponse')
const {Course}=require("../Models/course-model.js")
const {Quiz}=require("../Models/quiz.model")
const {Lec}=require('../Models/lec-model')

const SignUp=async (req, res,next) => {  
    try{

      const { error } = validateUser(req.body);
      if (error) return next(new ErrorResponse(error.details[0].message));

      const { firstName, lastName, email, password, confirmPassword } = req.body;

      if (password !== confirmPassword) {
        return next(new ErrorResponse("Passwords do not match"));
      }
      
     let user = await User.findOne({ email: req.body.email });
     if (user)  return  next(new ErrorResponse(`user exists `))
     user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
      confirmPassword:confirmPassword
    });
    
     const salt = await bcrypt.genSalt(10);  
     user.password = await bcrypt.hash(user.password, salt);
     user.confirmPassword = await bcrypt.hash(user.confirmPassword, salt);
    const saveduser= await user.save();
     res
       .header("x-auth-token", user.generateAuthToken())
       .status(200)
       .json(saveduser); //send token//................................
    }catch(err){
      next(err)
    }
  };

const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId)
    if (!user) return res.status(404).send('User not found');
    
    // modify userProfile object to show required fields only
    const userProfile = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      enrolledCourses: [],
      quizzes: [],
      profileimg: {},
      createdAt: user.createdAt
    };
    const enrolledCourses = await Course.find({ _id: { $in: user.enrolledCourses } }, { title: 1 });
    const quizzes = await Quiz.find({ userId: user._id }, { quizName: 1, usermark: 1 });
    userProfile.enrolledCourses = enrolledCourses;
    userProfile.quizzes = quizzes;
    
    if (user.profileimg && user.profileimg.url) {
      userProfile.profileimg = {
        public_id: user.profileimg.public_id,
        url: user.profileimg.url
      }
    }
    res.send(userProfile);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

  const getUsers=async(req,res,next)=>{
    try{
      const allUsers=await User.find()
      if(!allUsers)   return  next(new ErrorResponse(`cant find that user`))
      res.json({allUsers})
    }catch(err){
      next(err)
    }
      
  };

  const enrolledCourses=async(req,res,next)=>{
  try{
    const user=await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');
    res.status(200).json({enrolledCourses:user.enrolledCourses});

  }catch(err){
    next(err)
  }

  }
 const lecView=async (req, res) => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;
  const lectureId = req.params.lectureId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user is enrolled in the specified course
    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(400).json({ error: 'User is not enrolled in the course' });
    }

    // Find the lecture by ID
    const lecture = await Lec.findOne({ _id: lectureId, courseId: courseId });

    if (!lecture) {
      return res.status(404).json({ error: 'Lecture not found' });
    }

    // Get the specific videos from the lecture
    const videos = lecture.vedios;

    // Return the videos to the client
    res.json(videos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
  

  const updateProfile=async(req,res,next)=>{
    try {
    
  
      const user = await User.findById(req.params.userId);
  
      const cloudinary = await Cloudinary.uploader.upload(req.file.path, {
        folder: `/usersProfiles/${user._id}`
      })
      console.log(req.file)
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
}
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
  const deleteProfilePicture=async(req,res,next)=>{
    try{
    const user=await User.findById(req.params.userId);
    if(user._id == req.user.id){
      if (user.profileimg.length != 0) {
        Cloudinary.api.delete_resources_by_prefix(
          `usersProfiles/${user._id}`,
          function (err) {
            if (err && err.http_code !== 404) {
              return callback(err);
            }
            Cloudinary.api.delete_folder(
              `usersProfiles/${user._id}`,
              function (err, result) {
                console.log(err);
              }
            );
          }
        );
      }
      user.profileimg = null;
      await user.save();
    }else{
      res.json({message:"another user try to delete profile picture"})
    } 
    res.status(200).json({message:"profile image deleted succfuly"})
  }
  catch(err){
    next(err)
  }
  }

 module.exports = {
    SignUp,
    getUsers,
    updateProfile,
    updateUser,
    deleteProfilePicture,
    enrolledCourses,
    getUserProfile,
    lecView:lecView
  };
  