const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
   name:{
     type:String
   },
   cloudinary_id:{
    type:String
   },
   url:{
   type:String
   },
   enroll_cours:{
      type:Schema.Types.ObjectId,
      ref:"Course"
   },
   infoQuiz:[{quizId:{
      type:String},usermark:{
      type:String
      }
}]
});
module.exports = mongoose.model("User", userSchema);