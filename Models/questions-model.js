const mongoose=require('mongoose');

const Schema=mongoose.Schema;
const questionSchema=new Schema({
 title:{
    type:String,
    required:true
 },
 choose :[{
    text:{
        type:String,
        },
    isCorrect:{
        type:Boolean,
        default:false
      }
 }]
 ,
 mark:{
    type:Number,
    required:true
 },
 createdAt:{
    type:Date,
   defult:Date.now()
 }
}



);

module.exports=mongoose.model("Question", questionSchema);