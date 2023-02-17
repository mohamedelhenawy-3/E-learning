const router = require("express").Router();
const Question = require("../Models/questions-model");
const Quiz = require("../Models/quiz.model");
const Doctor=require('../Models/doctor-model')
const User=require('../Models/user-model')
router.post('/:docId',async(req,res)=>{
    //idsquestion
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

})
router.get('/:Quizid',async(req,res)=>{
    const quiz=await Quiz.findById(req.params.Quizid).populate('questions')
    if(!quiz) return "you dont have any quiz "
     res.send(quiz)

})
router.post('/studentanswer/:id/student/:stdid',async(req,res)=>{
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
     
    
})
// deletequiz
router.delete('quiz/:quizId',async(req,res)=>{
    const quiz=await  Quiz.findById(req.params.id)
    quiz.questions.map(questionss=>{
        Question.findByIdAndDelete(questionss._id)
    })
    await Quiz.findByIdAndDelete(course);
    res.status(200).json({message:"delete quiz successfully"})
    

})



module.exports=router;