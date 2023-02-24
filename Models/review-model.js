const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reviewSchema = new Schema({
  title: {
    type:String,
    trim:true,
    required:[true,"Please write a title for the review "],
    maxLength:100
  },
  text: {
    type: String,
    required:[true,"Please write a some text "]
  },
  rating: {
    type:Number,
    min:1,
    max:10,
    required:[true,"Please add rating between 1 to 10 "],
  
  },
  createdAt:{
    type:Date,
    defult:Date.now
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref:"User"
  },
  course: {
    type: mongoose.Types.ObjectId,
    ref:"Course"
  }
});
reviewSchema.index({course:1,user:1},{unique:true})
reviewSchema.statics.getAverageRating=async function(courseId){
const obj=await this.aggregate([

{
    $match:{course:courseId}
},
{
    $group:{
     _id:'$course',
    averageRating:{$avg:'$rating'}
    }
}
]);
try{
  await this.model('Course').findByIdAndUpdate(courseId,{
    averageRating:Math.ceil(obj[0].averageRating/10)*10
  })
}
catch(err){
   res.send(err)
} 
}
reviewSchema.post('save',function(){
    this.constructor.getAverageRating(this.course)
})
reviewSchema.post('remove',function(){
    this.constructor.getAverageRating(this.course)
})


module.exports = mongoose.model("Review", reviewSchema);