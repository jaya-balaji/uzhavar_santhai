const router = require("express").Router()
const {createItem,getItems,deleteItems,updateItem} = require("../controllers/itemController")
const {authenticateToken,authenticateTokenOnUpdateandDelete} = require("../middleware/jwtAuth")

router.get('/get',authenticateToken,getItems)
router.post('/create',authenticateToken,createItem)
router.get('/delete',authenticateTokenOnUpdateandDelete,deleteItems)
router.put('/update',authenticateTokenOnUpdateandDelete,updateItem)

module.exports = router
