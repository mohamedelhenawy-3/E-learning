const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const courseSchema = new Schema({
  courseName: {
    type: String,
  },
  doctorData: {
    firstName:{
      type:String
    },
    doctorId:{
      type:String
    }
  },
  description: {
    type: String,
  },
  mark: {
    type: Number,
  },
  createdAt:{
     type:Date,
    defult:Date.now()
  },
  enroll: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
   lectureId: [{
    type: mongoose.Types.ObjectId,
         ref:"Lec"
  }],
  quizzes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ],
  quizResponses: [
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      quizId: {
        type: Schema.Types.ObjectId,
        ref: "Quiz",
      },
      marks: {
        type: Number,
        default: 0,
      },
    },
  ],
});





module.exports = mongoose.model("Course", courseSchema);

