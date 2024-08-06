const router = require("express").Router()
const {createItem,getItems,deleteItems,updateItem} = require("../controllers/itemController")
const {authenticateToken,authenticateTokenOnDelete} = require("../middleware/jwtAuth")

router.get('/get',authenticateToken,getItems)
router.post('/create',authenticateToken,createItem)
router.get('/delete',authenticateTokenOnDelete,deleteItems)
router.put('/update',authenticateTokenOnDelete,updateItem)

module.exports = router
