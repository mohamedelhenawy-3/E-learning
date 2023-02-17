const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
  course_name: {
    type: String,
  },
  doctorName: {
    type: String,
  },
  desc: {
    type: String,
  },
  mark: {
    type: Number,
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
