const router = require("express").Router()
const {createItem,getItems,deleteItems,updateItem} = require("../controllers/itemController")

router.post('/create',createItem)
router.get('/get/:itemid',getItems)
router.get('/delete/:itemid',deleteItems)
router.put('/update/:itemid',updateItem)

module.exports = router
