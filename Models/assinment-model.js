// const mongoose = require('mongoose');
// const Schema = mongoose.Schema;

// const assignmentSchema = new Schema({
//   title: {
//     type: String,
//     // required: true
//   },
//   description: {
//     type: String,
//     // required: true
//   },
//   file: {
//     fileId: {
//       type: String,
//       required: true
//     },
//     url: {
//       type: String,
//       required: true
//     },
//     // fileName: {
//     //   type: String,
//     //   required: true
//     // },
//   },
//   course: {
//     type: Schema.Types.ObjectId,
//     ref: 'Course',
//     required: true
//   },
//   createdBy: {
//     type: Schema.Types.ObjectId,
//     ref: 'Doctor',
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Assignment = mongoose.model('Assignment', assignmentSchema);

// module.exports = Assignment;
