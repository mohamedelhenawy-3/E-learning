const express = require('express');
const router = express.Router();
const Assignment = require('../Models/assinment-model');
const {Course} = require('../Models/course-model');
const {Doctor} = require('../Models/doctor-model');
const { google } = require('googleapis');
const fs = require("fs");
const { auth } = require("google-auth-library");
const Auth=require('../middlware/authMiddleware')



const credentials=require('../file/credentials.json')


const authClient = auth.fromJSON(credentials);
authClient.scopes = ["https://www.googleapis.com/auth/drive"]; // Set the desired scopes

router.get('/',(req,res)=>{
    console.log('fffff')
})

router.post("/:courseId/assignments", [Auth],async (req, res) => {
    const { courseId } = req.params;
    const { assignmentName, file } = req.body;
    const doctorId = req.user.id; // Assuming authenticated doctor's ID is available
  
    try {
      // Check if the doctor is authorized to create the assignment for the given course
      const course = await Course.findById(courseId);
      const doctor = await Doctor.findById(doctorId);
  
      // Make sure the doctor exists and matches the authenticated doctor
      if (!doctor || doctor._id.toString() !== doctorId) {
        return res.status(403).json({ error: "Unauthorized to create the assignment." });
      }
  
      // Upload the file to Google Drive
      const drive = google.drive({ version: "v3", auth: authClient  });
  
      const fileMetadata = {
        name: assignmentName,
        // Set appropriate folder ID or parents if required
        // parents: ["folderId"],
      };
  
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };
  
      const response = drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id",
      });
  
      const assignmentFileId = response.data.id;
  
      // Create the assignment object
      const assignment = new Assignment({
        assignmentName,
        fileId: assignmentFileId,
      });
  
      // Save the assignment in the doctor's course
      course.assignments.push(assignment);
      await course.save();
  
      res.status(200).json({ message: "Assignment created successfully." });
    } catch (error) {
      console.error("Error creating assignment:", error);
      res.status(500).json({ error: "Failed to create assignment." });
    }
  });
module.exports = router;
