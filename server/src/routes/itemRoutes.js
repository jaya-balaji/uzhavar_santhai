const router = require("express").Router()
const {createItem,getItems,deleteItems,updateItem,authenticateToken} = require("../controllers/itemController")

router.get('/get/:itemData',authenticateToken,getItems)
router.post('/create',createItem)
router.get('/delete/:itemid',deleteItems)
router.put('/update/:itemid',updateItem)

module.exports = router
