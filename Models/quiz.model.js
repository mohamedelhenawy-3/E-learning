const Joi = require("joi");
const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  quizname: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
  quizmark: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const joiQuizSchema = Joi.object({
  quizname: Joi.string(),
  quizmark: Joi.number().default(0),
  createdAt: Joi.date().default(Date.now),
});

const validateQuiz = (quiz) => {
  return joiQuizSchema.validate(quiz);
};

module.exports = {
  Quiz: mongoose.model("Quiz", quizSchema),
  validateQuiz:validateQuiz
};
