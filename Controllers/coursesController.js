const Course=require('../Models/course-model')
const Doctor=require('../Models/doctor-model');
const Cloudinary=require('../utils/clouodinry')
const Lecture=require('../Models/lec-model')


const getCourse=async(req,res) => {
    const  cource = await Course.findById(req.params.id).populate('lectureId')
    console.log(cource)
    res.send(cource)
  };

const postCourse=async(req,res)=>{
  try {
    const doctor=await Doctor.findById(req.params.docId)
    console.log(doctor._id)
    const course=new Course({
            course_name:req.body.course_name,
            doctor:doctor.doctorName,
            desc:req.body.desc,
     })
     const newcourse=await course.save();
     console.log(newcourse._id)
     doctor.courses.push(newcourse._id)
     await doctor.save();
     res.status(200).json({newcourse})
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
};
const updateCourse=async (req, res) => {
    const course = await Course.findById(req.params.id);
    if (!course.enrolled_std.includes(req.body.userId)) {
      await course.updateOne({ $push: { enrolled_std: req.body.userId } });
      res.status(200).send("enroll success in this course");
    } else {
      await course.updateOne({ $pull: { enrolled_std: req.body.userId } });
      res.status(200).send("out of this course");
    }
  };
  const deleteCourse=async(req,res)=>{
    const course=await Course.findById(req.params.courseId).populate("lectureId")
    if(!course) return "course not found"
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
const getCourses=async(req,res)=>{
  const course= await Course.find();
  if(!course) return "courses not found"

  res.status(200).json({course})
}
  module.exports = {
    getCourse,
    postCourse,
    updateCourse,
    deleteCourse,
    getCourses
  };