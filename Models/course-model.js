const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  course_name: {
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
  enrolled_std: {
    type: Array,
    default: [],
  },
   lectureId: [{
    type: mongoose.Types.ObjectId,
         ref:"Lec"
  }]
});
module.exports = mongoose.model("Course", userSchema);
