const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
  assignmentName: {
    type: String,
    required: true,
  },
  file: {
    fileId: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
  },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
