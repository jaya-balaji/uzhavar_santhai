const router = require("express").Router()
const {createUser,loginUser,hashPassword}=require('../controllers/userController');
const {getUserIdFromJWT} = require("../middleware/jwtAuthUser")
const {getuserData} = require("../controllers/userItemController")

// route-> '/admin/register'
router.post('/register',hashPassword,createUser);
//route->
router.post('/authAdminData',loginUser)

router.get('/userdata',getUserIdFromJWT,getuserData)

module.exports=router