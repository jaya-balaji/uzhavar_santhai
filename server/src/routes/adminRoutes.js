const router = require("express").Router()
const {isLocationExists,createAdmin,deleteAdmin,loginAdmin,hashPassword,getAdminData}=require('../controllers/adminController');
const {authenticateToken}= require("../middleware/jwtAuth")

// route-> '/admin/register'
router.post('/register',isLocationExists,hashPassword,createAdmin);
// route-> '/admin/delete'
router.post('/delete',deleteAdmin);
//route->
router.post('/authAdminData',loginAdmin)

router.get("/get",authenticateToken,getAdminData)

module.exports=router