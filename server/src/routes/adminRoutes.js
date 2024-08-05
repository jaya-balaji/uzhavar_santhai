const router = require("express").Router()
const {createAdmin,deleteAdmin,loginAdmin,hashPassword}=require('../controllers/adminController');

// route-> '/admin/register'
router.post('/register',hashPassword,createAdmin);
// route-> '/admin/delete'
router.post('/delete',deleteAdmin);
//route->
router.post('/authAdminData',loginAdmin)

module.exports=router