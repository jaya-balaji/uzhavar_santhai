const router = require("express").Router()
const {createItem,getItems,deleteItems} = require("../controllers/itemController")

router.post('/create',createItem)
router.get('/get/:itemid',getItems)
router.get('/delete/:itemid',deleteItems)

module.exports = router

