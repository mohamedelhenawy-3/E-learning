const Course=require('../Models/course-model')
const Doctor=require('../Models/doctor-model');
const Cloudinary=require('../utils/clouodinry')
const Lecture=require('../Models/lec-model')
const ErrorResponse=require('../utils/errorResponse')


const getCourse=async(req,res) => {
    try{    
    const  course = await Course.findById(req.params.id).populate('lectureId')
    if(! course)return  next(new ErrorResponse(`Cant find Cours with id ${req.params.id}`))
    res.status(200).json(course)
    }
    catch(err){
      next(err)
    }

  };

const postCourse=async(req,res)=>{
  try {
    const doctor=await Doctor.findById(req.params.docId)
    console.log(doctor._id)
    const course=new Course({
            course_name:req.body.course_name,
            doctor:doctor.doctorName,
            description:req.body.description,
     })
     const newcourse=await course.save();
     console.log(newcourse._id)
     doctor.courses.push(newcourse._id)
     await doctor.save();
     res.status(200).json({newcourse})
    } catch (err) {
      next(err)
    }
};
const updateCourse=async (req, res) => {
  try{
    const course = await Course.findById(req.params.id);
    if (!course.enrolled_std.includes(req.body.userId)) {
      await course.updateOne({ $push: { enrolled_std: req.body.userId } });
      res.status(200).send("enroll success in this course");
    } else {
      await course.updateOne({ $pull: { enrolled_std: req.body.userId } });
      res.status(200).send("out of this course");
    }
  }catch(err){
    next(err)

  }
  
  };
  const deleteCourse=async(req,res)=>{
    try{
      const course=await Course.findById(req.params.courseId).populate("lectureId")
      if(!course) return  next(new ErrorResponse(`Cant find Course with id ${req.params.courseId}`))
      course.lectureId.map(async lecture=>{
         await Lecture.findByIdAndDelete(lecture._id)
     })
    await Course.findByIdAndRemove(course)
    if(course.lectureId.length != 0 ){
    Cloudinary.api.delete_resources_by_prefix(`E-learning/courses/${course.course_name}`, function (err) {
      if (err && err.http_code !== 404) {
          return callback(err);
      }
       Cloudinary.api.delete_folder(`E-learning/courses/${course.course_name}`,function(err,result){
              console.log(err)
          });
        })
    }
    }
    catch(err){
      next(err)
    }
   
}
const getCourses=async(req,res)=>{
  try{
    const course= await Course.find();
    if(!course) return next(new ErrorResponse(`Cant find any Courses`))
  
    res.status(200).json({course})
  }
  catch(err){
    next(err)
  }
 
}
  module.exports = {
    getCourse,
    postCourse,
    updateCourse,
    deleteCourse,
    getCourses
  };