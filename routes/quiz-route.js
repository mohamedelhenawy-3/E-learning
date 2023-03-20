const router = require("express").Router();
const Question = require("../Models/questions-model");
const Quiz = require("../Models/quiz.model");
const Doctor=require('../Models/doctor-model')
const Course=require('../Models/course-model')
const User=require('../Models/user-model')
const auth=require("../middlware/authMiddleware")
const  ErrorResponse=require('../utils/errorResponse')
router.post('/courses/:courseId/quizzes', [auth], async (req, res) => {
  try {
    // Retrieve the doctor creating the quiz from the JWT
    const doctor = await Doctor.findById(req.user.id);
    // Ensure the doctor exists and is authorized to create quizzes
    if (!doctor) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Retrieve the course to which the quiz belongs
    const course = await Course.findById(req.params.courseId);
    // Ensure the course exists and is associated with the doctor creating the quiz
    if (!course || course.doctorData.doctorId !== doctor.id) {
      return res.status(401).json({ message: 'Unauthorized access. Only the course creator can create quizzes for the course.' });
    }
    const questionsId = await Promise.all(req.body.questions.map(async question => {
      let newquestion = new Question({
        title: question.title,
        choose: question.choose,
        mark: question.mark
      })
      newquestion = await newquestion.save();
      return newquestion
    }))
    const quiz = new Quiz({
      quizname: req.body.quizname,
      questions: questionsId
    })

    // Save the new quiz to the database and associate it with the course
    await quiz.save();
    course.quizzes.push(quiz._id);
    await course.save();

    // Return the newly created quiz document
    res.status(201).json(quiz);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.post('/:docId',async(req,res,next)=>{

  try{
      const questionsId=Promise.all(req.body.questions.map(async question=>{
          let newquestion=new Question({
              title:question.title,
              choose:question.choose,
              mark:question.mark
          })
          newquestion=await newquestion.save();
          return newquestion
      }))
      const questionResolve=await questionsId;
      const doctor=await Doctor.findById(req.params.docId)
      const quiz=new Quiz({
             quizname:req.body.quizname,
              questions:questionResolve,
              doctor:doctor.name
      })
      const savedQuiz=await quiz.save();
      console.log(savedQuiz._id)
      doctor.quizz.push(savedQuiz._id)
      await doctor.save();
      
      res.json({savedQuiz});
  
  }
  catch(err){
      next(err)
  }
  //idsquestion

})
router.post('/courses/:courseId/quizzes/:quizId/submit', [auth], async (req, res) => {
  const { courseId, quizId } = req.params;
  const { answers } = req.body;

  try {
    const course = await Course.findById(courseId);
    const quiz = await Quiz.findById(quizId);

    if (!course) {
      return res.status(404).send('Course not found.');
    }

    if (!quiz) {
      return res.status(404).send('Quiz not found.');
    }

    const user = await User.findById(req.user.id);

    if (!user.enrolledCourses.includes(courseId)) {
      return res.status(400).send('User is not enrolled in the course.');
    }

    const userQuiz = user.infoQuizs.find(q => q.quizId === quizId);

    if (userQuiz) {
      return res.status(400).send('User has already attempted the quiz.');
    }

    // Check if the authenticated user is the doctor who created the course
    if (course.doctorData.doctorId == user.id ){
      return res.status(403).send('Unauthorized access. Only the course creator can create quizzes for the course.');
    }

    let totalScore = 0;

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = await Question.findById(quiz.questions[i]);

      if (question.choose[answers[i]].isCorrect) {
        totalScore += question.mark;
      }
    }

    user.infoQuizs.push({ quizId, usermark: totalScore });
    await user.save();
    
    quiz.mark += totalScore;
    await quiz.save();
    
    // Update quizResponses array in Course model
    const quizIndex = course.quizzes.findIndex(q => q._id === quizId);
    const userIndex = course.quizResponses.findIndex(q => q.userId.toString() === user.id);
    if (quizIndex !== -1 && userIndex !== -1) {
      course.quizResponses[userIndex].marks = totalScore;
      await course.save();
    } else {
      course.quizResponses.push({ userId: user.id, quizId, marks: totalScore });
      await course.save();
    }

    res.send(`Your score is ${totalScore} out of ${quiz.totalMark}.`);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred while submitting the quiz.');
  }
});










router.get('/:Quizid',async(req,res,next)=>{
    try{
        const quiz=await Quiz.findById(req.params.Quizid).populate('questions')
        if(!quiz) return "you dont have any quiz "
         res.send(quiz)
    }
   catch(err){
    next(err)
   }

})
router.post('/studentanswer/:id/student/:stdid',async(req,res,next)=>{
    try{
        const quiz=await Quiz.findById(req.params.id).populate('questions').select('questions')
        const user=await User.findById(req.params.stdid)
        console.log(quiz._id)
        const x=quiz.questions.map(y=>{
                return y.choose.map(v=>{
                    return v.isCorrect//[[true,false],[true,false]]
                })   
                     
        })
        const arr = req.body.arr;
        var answers = 0
        for(var i=0;i<arr.length;i++){
            if(x[i][arr[i]])    {
                answers+=10
            }
        }
        console.log("ggg")
        let updateuser=user
        const studentmark=`${answers}}`
        user.infoQuiz.push({ usermark:studentmark, quizId:quiz._id  })
        await updateuser.save();
            
        res.json(`your mark :${studentmark}`) 
    }catch(err){
        next(err)
    }
    
    
})
// deletequiz
router.delete('quiz/:quizId',async(req,res,next)=>{
    try{
        const quiz=await  Quiz.findById(req.params.id)
        quiz.questions.map(questionss=>{
            Question.findByIdAndDelete(questionss._id)
        })
        await Quiz.findByIdAndDelete(course);
        res.status(200).json({message:"delete quiz successfully"})
    }catch(err){
        next(err)
    }
})



module.exports=router;