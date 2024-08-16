const router = require("express").Router()
const {getItems} = require("../controllers/itemController")
const {authenticateToken} = require("../middleware/jwtAuthUser")
const {getAndSetthecreater} = require("../controllers/userItemController")

router.get('/get',authenticateToken,getAndSetthecreater,getItems)

module.exports = router