const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const doctorSchema = new Schema({
  name: {
    type: String,
  },
  profileimg:[{
    public_id: {//  
        type: String,
      },
      url: {
        type: String,
      }
    }],
  courses: [
    {
      type: Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
  quizz: [
    {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
  ]
});
module.exports = mongoose.model("Doctor", doctorSchema);