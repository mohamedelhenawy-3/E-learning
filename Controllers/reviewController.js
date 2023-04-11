const Course=require('../Models/course-model')
const {Review,reviewValidationSchema}=require('../Models/review-model')
const  ErrorResponse=require('../utils/errorResponse')




const addReview=async(req,res,next)=>{
    try{
      const { error } = reviewValidationSchema.validate(req.body);
      if (error) return res.status(400).send(error.details[0].message);
        req.body.course=req.params.courseId
        console.log(req.params.courseId)
        req.body.user=req.user.id
        console.log(req.user.id)
        const course=await Course.findById(req.params.courseId);
        console.log(course)
        if(!course)  return  next(new ErrorResponse(`cant find any course to do review on it `))
        const review =await Review.create(req.body)
        res.status(200).json({
            success:true,
            data:review
        })
    } catch(err){
        next(err)
    }
    
}

const getReview =  async (req, res) => {
    try {
      const courseId = req.params.id;
      const course = await Course.findById(courseId);
      const courseID=course._id
      const reviews = await Review.find({ course: courseId });
      const averageRating = course.averageRating;
      res.status(200).json({
        success: true,
        data: {
          courseID,
          reviews,
          averageRating
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: 'Server Error' });
    }
  }

  const getRateofCourse=async(req,res)=>{
    try{
        const courseId = req.params.id;
        const course = await Course.findById(courseId);
        const courseID=course._id
        const averageRating = course.averageRating;
        res.status(200).json({
            success: true,
            data: {
              courseID,
              averageRating
            }
          });
    }catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Server Error' });
      }

  
 };

 module.exports = {
    addReview,
    getReview,
    getRateofCourse
  };
  