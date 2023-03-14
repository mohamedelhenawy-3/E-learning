const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  courseName: {
    type: String,
  },
  doctorName: {
    type: String,
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
  }]
});
module.exports = mongoose.model("Course", userSchema);
