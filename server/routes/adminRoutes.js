const router = require("express").Router()
const {isLocationExists,createAdmin,loginAdmin,hashPassword,getAdminData}=require('../controllers/adminController');
const {authenticateToken}= require("../middleware/jwtAuth")

// route-> '/admin/register'
router.post('/register',isLocationExists,hashPassword,createAdmin);

//route->
router.post('/authAdminData',loginAdmin)

router.get("/get",authenticateToken,getAdminData)

module.exports=router