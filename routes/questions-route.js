const router = require("express").Router();
const Question = require("../Models/questions-model");



router.get('/',async(req,res)=>{
   const allquestion=await Question.find();
   if(!allquestion){
    res.json({message:"there arent any questions"})
   }
   res.json({allquestion})
})
router.get('/:id',async(req,res)=>{
    const question=await Question.findById(req.params.id);
    if(!question){
        res.json({message:"not found any question"})
    }
    res.json({question})
})

router.post('/',async(req,res)=>{
    const question=new Question({
        title:req.body.title,
        choose:req.body.choose,
        mark:req.body.mark
    })
    const savedQuestion=await question.save();
    res.send(savedQuestion);

})
//answer the question and calc the marks
router.post('/answer/:id',async(req,res)=>{
    const question= await Question.findById(req.params.id)
    // console.log(question)
    const fiest=question.choose.map(t=>{
        return t.isCorrect
    })
    console.log(question.mark) //[true,false]
   const arr = req.body.arr;
    if(fiest[arr[0]] == true)
        res.send(`question mark: ${question.mark}`);
    else
        res.send(" question mark :0");
})

router.get('/answersofquestion',async(req,res)=>{
    const question=await Question.find()   
    const descs =question.map(function(i){
         return i.choose.map(function(v){
                   return v.isCorrect
         })
    })
   res.send(descs)

})
router.delete("/delete/:id", async (req, res) => {
      const question = await Question.findByIdAndRemove(req.params.id);
      if (!question) return res.send("no question to delete");
      res.json({ message: " removed success" });
  });




module.exports=router;
