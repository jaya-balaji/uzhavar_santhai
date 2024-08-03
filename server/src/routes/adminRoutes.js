const router = require("express").Router()
const {createAdmin,deleteAdmin,authenticateAdmin}=require('../controllers/adminController')

// route-> '/admin/register'
router.post('/register',createAdmin);
// route-> '/admin/delete'
router.post('/delete',deleteAdmin);
//route->
router.post('/authAdminData',authenticateAdmin)

module.exports=router