const multer=require('multer');
const path=require('path');
module.exports=multer({
    storage:multer.diskStorage({}),
    fileFilter:(req,file,cb)=>{
        let ext=path.extname(file.originalname);
        if(ext !== '.jpg'&&ext !== '.jpeg'&&ext !== '.png'&& ext !==".mp4"&&ext !==".mp4"&&ext !==".mkv "&& ext!== ".pdf"){
            cb(new Error("file type is not suppport"),false);
            return
        }
        cb(null,true)
    }
})