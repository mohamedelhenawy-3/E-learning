const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
  },
  file: {
    type: String,
  },
});

const assignmentModel = mongoose.model("Assignment", assignmentSchema);
