const mongoose = require("mongoose");
const Joi = require('joi');
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
      quizMark: {
        type: Number,
        default: 0,
      },
    },
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  averageRating: {
    type: Number,
    default: null

   } ,
  // duration: {
  //   type: Number,
  //   default: null,
  //   min: 0
  // },
  // durationFormatted: {
  //   type: String,
  //   default: null,
  // },
  
});
const validateCourse = (course) => {
  const schema = Joi.object({
    courseName: Joi.string().required(),
    doctorData: Joi.object({
      firstName: Joi.string().required(),
      doctorId: Joi.string().required(),
    }),
    description: Joi.string().required(),
    mark: Joi.number().required(),
    createdAt: Joi.date().default(Date.now),
    enroll: Joi.array().items(Joi.string().required()),
    lectureId: Joi.array().items(Joi.string().required()),
    quizzes: Joi.array().items(Joi.string().required()),
    quizResponses: Joi.array().items(
      Joi.object({
        userId: Joi.string().required(),
        quizId: Joi.string().required(),
        marks: Joi.number().default(0),
        quizMark: Joi.number().default(0),
      })
    ),
    reviews: Joi.array().items(Joi.string().required()),
    averageRating: Joi.number().default(null),
  });

  return schema.validate(course);
};

module.exports = { validateCourse };

module.exports = mongoose.model("Course", courseSchema);

