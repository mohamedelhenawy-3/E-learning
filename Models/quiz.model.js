const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const quizSchema=new Schema({
 quizname:{
    type:String,
    required:true
 },

 questions:[{
    type:Schema.Types.ObjectId,
    ref:'Question'
    
 }],
 quizmark:{
 type:Number,
 defult:0
 },
 createdAt:{
   type:Date,
   defult:Date.now()
     }
},


);

module.exports=mongoose.model("Quiz", quizSchema);