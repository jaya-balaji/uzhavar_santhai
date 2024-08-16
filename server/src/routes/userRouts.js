const router = require("express").Router()
const {createUser,deleteUser,loginUser,hashPassword}=require('../controllers/userController');

// route-> '/admin/register'
router.post('/register',hashPassword,createUser);
// route-> '/admin/delete'
router.post('/delete',deleteUser);
//route->
router.post('/authAdminData',loginUser)

module.exports=router