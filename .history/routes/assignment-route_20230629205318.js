const express = require("express");
const router = express.Router();
const { Doctor } = require("../Models/doctor-model");
const { Course } = require("../Models/course-model");
const { Storage } = require("@google-cloud/storage");
const { Assignment } = require("../Models/assinment-model");
// Create a new instance of the Storage client
const storage = new Storage();

// Define your Google Cloud Storage bucket name
const bucketName = "your-bucket-name";

// Create Assignment
router.post("/courses/:courseId/assignments", async (req, res) => {
  try {
    const { courseId } = req.params;
    const { title, description, dueDate, marks, file } = req.body;

    // Check if the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // Check if the doctor owns the course
    const doctor = await Doctor.findById(course.doctorData.doctorId);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Check if the doctor owns the course
    if (doctor._id.toString() !== req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Upload the file to Google Cloud Storage
    const fileBuffer = Buffer.from(file, "base64");
    const fileName = `assignments/${Date.now()}_${title}`;
    const fileUpload = storage.bucket(bucketName).file(fileName);

    await fileUpload.save(fileBuffer, { contentType: "application/pdf" });

    // Create the assignment
    const assignment = new Assignment({
      courseId,
      userId: req.user.id, // Assuming the authenticated user is the doctor
      title,
      description,
      dueDate,
      marks,
      file: fileUpload.name,
    });

    // Save the assignment to the database
    await assignment.save();

    // Add the assignment to the course
    course.assignments.push(assignment);
    await course.save();

    res
      .status(201)
      .json({ message: "Assignment created successfully", assignment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
