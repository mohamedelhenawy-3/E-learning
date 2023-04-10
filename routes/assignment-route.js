const express = require('express');
const router = express.Router();
// const Assignment = require('../Models/assinment-model');
// const {Course} = require('../Models/course-model');
// const {Doctor} = require('../Models/doctor-model');
const { google } = require('googleapis');

const Upload=require('../utils/multer')
const fs = require('fs');
const formidable=require("formidable");
const credentials=require('../file/credentials.json')

router.post('/g',async(req,res)=>{
    const { doctorId } = req.body;
    const doctor = await Doctor.findById(doctorId)
    console.log('doctor:', doctor);
    res.send(doctor)
})
// POST route to create a new assignment
// router.post('/assignments/:doctorId/:courseId', Upload.single('file'),async (req, res) => {
//   try {
//     // Retrieve the doctor, course, and assignment details from the request body
//     const {title, description, fileName } = req.body;
//     const { doctorId, courseId } = req.params;
//     // Authenticate with Google Drive API using OAuth2
//     const CLIENT_ID = '218555502757-od3m4neidchsb2gv1ijjb5mkr0tf1g71.apps.googleusercontent.com'; // replace with actual client ID
//     const CLIENT_SECRET = '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'; // replace with actual client secret
//     const REFRESH_TOKEN = '1//04PYDku3KojNxCgYIARAAGAQSNwF-L9IrBKkwRtQhqc6kITMTEC4XNcOT10vrzSjx0tm5M_qsqxKJaUnt3fEE8z_2Jx1bmJPr81A'; // replace with actual refresh token

//     const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);
//     oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//     const drive = google.drive({
//       version: 'v3',
//       auth: oAuth2Client,
//     });
   
//     // Get the doctor who created the course
//     const doctor = await Doctor.findById(doctorId)
//     console.log('doctor:', doctor);
//     // Get the course
//     const course = await Course.findById(courseId);

//     // Create the assignment
//     const assignment = new Assignment({
//       title,
//       description,
//       course: course._id,
//       createdBy: doctor._id,
//     });

//     // Upload the assignment file to Google Drive
//     const fileMetadata = {
//       name: fileName,
//       parents: [course.googleDriveFolderId], // assuming the course has a Google Drive folder ID stored in the database
//     };
//     const media = {
//       mimeType: 'application/pdf', // replace with the actual MIME type of the file being uploaded
//       body: req.file.buffer, // use the buffer of the uploaded file in the request
//     };
//     const uploadedFile =  drive.files.create({
//       resource: fileMetadata,
//       media: media,
//       fields: 'id, webContentLink', // specify the fields to retrieve for the uploaded file
//     });

//     // Associate the uploaded file with the assignment
//     assignment.file = {
//       fileId: uploadedFile.data.id,
//       url: uploadedFile.data.webContentLink,
//       fileName,
//     };

//     // Save the assignment to the database
//     await assignment.save();

//     console.log('Assignment created successfully');

//     res.status(201).json({
//       message: 'Assignment created successfully',
//       assignment,
//     });
//   } catch (error) {
//     console.error('Error creating assignment:', error);
//     res.status(500).json({
//       message: 'Error creating assignment',
//       error,
//     });
//   }
// });
// const multer = require('multer');
// const { google } = require('googleapis');
// const { OAuth2 } = google.auth;
// const { Storage } = require('@google-cloud/storage');
// const storage = new Storage();

// const upload = multer();

const client_id=credentials.web.client_id;
const client_secret=credentials.web.client_secret;
const redirect_uris=credentials.web.redirect_uris;


const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

const SCOPE=['https://www.googleapis.com/auth/drive.metadata.readonly https://www.googleapis.com/auth/userinfo.profile  https://www.googleapis.com/auth/drive.file' ]

// router.post('/assignments/:doctorId/:courseId', Upload.single('fileName'), async (req, res) => {
//   try {
//     // Retrieve the doctor, course, and assignament details from the request body
//     const { title, description, fileName } = req.body;
//     const { doctorId, courseId } = req.params;
//     // Authenticate with Google Drive API using OAuth2

//     const oAuth2Client = new OAuth2(CLIENT_ID, CLIENT_SECRET);
//     oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
//     const drive = google.drive({version: 'v3',auth: oAuth2Client});
//     // Get the doctor who created the course
//     const doctor = await Doctor.findById(doctorId)
//     console.log('doctor:', doctor);
//     // Get the course
//     const course = await Course.findById(courseId);
//     // Create the assignment
//     const assignment = new Assignment({
//       title,
//       description,
//       course: course._id,
//       createdBy: doctor._id,
//     });

//     // Upload the assignment file to Google Drive
//     const fileMetadata = {
//       name: fileName,
//       parents: ['1WwsUZyshjZNK2qpcnAtuDdZ4SlDENadu'], // assuming the course has a Google Drive folder ID stored in the database
//     };
//     const fileBuffer = fs.readFileSync(req.file.path);
//     const media = {
//       mimeType: 'application/pdf', // replace with the actual MIME type of the file being uploaded
//       body: fileBuffer, // use the buffer of the uploaded file in the request
//     };
//     console.log('filebufer',fileBuffer)
//     // console.log('file:',req.file.buffer)
//     // Upload the file to Google Drive
//     const uploadedFile = await new Promise((resolve, reject) => {
//         drive.files.create({
//           resource: fileMetadata,
//           media: media,
//           fields: 'id, webContentLink',
//         }, (err, file) => {
//           if (err) {
//             reject(err);
//           } else {
//             resolve(file);
//           }
//         });
//       });
      
//     // Associate the uploaded file with the assignment
//     assignment.file = {
//       fileId: uploadedFile.data.id,
//       url: uploadedFile.data.webContentLink,
//     //   fileName:uploadedFile.data.fileName,
//     };
//     // Save the assignment to the database
//     await assignment.save();

//     console.log('Assignment created successfully');

//     res.status(201).json({
//       message: 'Assignment created successfully',
//       assignment,
//     });
//   } catch (error) {
//     console.error('Error creating assignment:', error);
//     res.status(500).json({
//       message: 'Error creating assignment',
//       error,
//     });
//   }
// });

router.get('/authURL',(req,res)=>{
    const authUrl=oAuth2Client.generateAuthUrl({
        access_type:'offline',
        scope:SCOPE
    })
    console.log(authUrl)
    res.send(authUrl)
})
router.post('/getToken',(req,res)=>{
    if(req.body.code == null)return res.status(400).send('invalid');
    oAuth2Client.getToken(req.body.code,(err,token)=>{
        if(err){
            console.error('err',err)
            return res.status(400).send('err')
        }
        res.send(token)
    })
})
router.post('/getUserInfo',(req,res)=>{
 if(req.body.token == null) return res.status(400).send("err")
 oAuth2Client.setCredentials(req.body.token)
 const asuth2=google.oauth2({version:'v2', auth:oAuth2Client});

 asuth2.userinfo.get((err,ress)=>{
    if(err)  res.status(400).send("err")
    console.log(ress.data)
    res.send(ress.data)
 })
})
//get data from google drive
router.post('/readdrive',(req,res)=>{
    if(req.body.token == null) return res.status(400).send("err");
    oAuth2Client.setCredentials(req.body.token)
    const drive=google.drive({version:'v3',auth:oAuth2Client})
    drive.files.list({
        pageSize:10
    },(err,ress)=>{
        if(err){ 
            console.log('API RETRUN ERR'+err);
           return res.status(400).send("err")
            
        }
        const files=ress.data.files
        if(files.length){
            console.log('files');
            files.map((file)=>{
                console.log(`${file.name} (${file.id})`);
            })
        }else{
            console.log('not found of files')
        }
        res.send(files)
    })

})
router.post('/fielUpload',(req,res)=>{
    const form=new formidable.IncomingForm();
    form.parse(req,(err,fields,files)=>{
        if(err)  return res.status(400).send(err);


        const token=JSON.parse(fields.token)
        
        console.log(token)
        if(req.body.token == null) return res.status(400).send("err");
        oAuth2Client.setCredentials(token);
        console.log(files.file)
        const drive=google.drive({version:"v3",auth:oAuth2Client});
        const fileMetadata={
            name:files.file.name
        }
        const media={
            mimeType:files.file.type,
            body: fs.createReadStream(files.file.path),
        };
        drive.files.create(
            {
                resource:fileMetadata,
                media:media,
                fields:"id"
            },
            (err,file)=>{
                oAuth2Client.setCredentials(null);
                if(err){
                    console.error(err)
                    res.status(400).send('err')
                }else{
                    res.send('suddddd')
                }
            }
        )

    })
})
module.exports = router;
