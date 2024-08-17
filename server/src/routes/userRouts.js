const router = require("express").Router()
const {createUser,deleteUser,loginUser,hashPassword}=require('../controllers/userController');
const {getUserIdFromJWT} = require("../middleware/jwtAuthUser")
const {getuserData} = require("../controllers/userItemController")

// route-> '/admin/register'
router.post('/register',hashPassword,createUser);
// route-> '/admin/delete'
router.post('/delete',deleteUser);
//route->
router.post('/authAdminData',loginUser)

router.get('/userdata',getUserIdFromJWT,getuserData)

module.exports=router