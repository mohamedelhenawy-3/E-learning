const router = require("express").Router();
const admin=require('../middlware/adminMiddleware')
const auth=require('../middlware/authMiddleware')




    const {addCode} = require("../Controllers/specialCodeController");

     
    
router.post('/:id',[auth,admin],addCode)










  
module.exports = router