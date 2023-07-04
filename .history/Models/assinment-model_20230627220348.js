const mongoose = require("mongoose");
const Joi = require("joi");
const Schema = mongoose.Schema;
const { Storage } = require("@google-cloud/storage");

const assignmentSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  file: {
    originalname: String,
    filename: String,
    mimetype: String,
    storagePath: String,
    url: String,
  },
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
  },
});

const validateAssignment = (assignment) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    courseId: Joi.string().required(),
  });

  return schema.validate(assignment);
};

assignmentSchema.methods.uploadFile = async function (file) {
  const storage = new Storage();
  const bucketName = "your-bucket-name"; // Replace with your actual bucket name

  try {
    const bucket = storage.bucket(bucketName);
    const storagePath = `assignments/${file.filename}`;

    await bucket.upload(file.path, {
      destination: storagePath,
      public: true, // Set to true if you want the file to be publicly accessible
    });

    const url = `https://storage.googleapis.com/${bucketName}/${storagePath}`;

    this.file = {
      originalname: file.originalname,
      filename: file.filename,
      mimetype: file.mimetype,
      storagePath: storagePath,
      url: url,
    };

    // Save the assignment
    await this.save();

    return url;
  } catch (error) {
    throw new Error("Error uploading file to Google Cloud Storage");
  }
};

module.exports = {
  Assignment: mongoose.model("Assignment", assignmentSchema),
  validateAssignment: validateAssignment,
};
