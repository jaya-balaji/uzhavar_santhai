const Item = require("../models/itemSchema")

const createItem = (req,res) =>{
    try {
    Item.create(req.body)
        res.status(200)
        .send({
            error: false,
            message: "item created"
        })
    } catch (error) {
        console.log("error while creating item")
        res.status(500)
        .send({
            error : true,
            message: err.message
        })
    }
}

const getItems = async(req,res)=>{
    try {
        const items = await Item.find({creator: req.params.itemid}); // Fetch all items using Mongoose
        res.status(200).send(items);
      } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        res.status(500).json({ message: 'Error fetching items', error }); // Send error response
      }
}

const deleteItems = async(req,res)=>{
    try {
        const items = await Item.findByIdAndDelete(req.params.itemid); // Fetch all items using Mongoose
        res.status(200).send({
            error:false,
            message:"item deleted"
        });
      } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        res.status(500).json({ message: 'Error fetching items', error }); // Send error response
      }
}

module.exports = {createItem,getItems,deleteItems}