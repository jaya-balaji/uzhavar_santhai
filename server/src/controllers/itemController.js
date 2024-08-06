const Item = require("../models/itemSchema")
const jwt = require('jsonwebtoken');

const createItem = (req,res) =>{
    console.log(req.body)
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
        const items = await Item.find({creator: req.body.creator}); // Fetch all items using Mongoose
        res.status(200).send(items);
      } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        res.status(500).json({ message: 'Error fetching items', error }); // Send error response
      }
}

const deleteItems = async(req,res)=>{
    console.log("ON DELETE BLOCK : ",req.headers.id)
    try {
        const items = await Item.findByIdAndDelete(req.headers.id); // Fetch all items using Mongoose
        res.status(200).send({
            error:false,
            message:"item deleted"
        });
      } catch (error) {
        console.error('Error fetching items:', error); // Log the error
        res.status(500).json({ message: 'Error fetching items', error }); // Send error response
      }
}

const updateItem =async (req,res)=>{
    console.log("ON UPDATE BLOCK",req.headers.id)
    try {
        const uptItem = await Item.findByIdAndUpdate(
            req.headers.id,
            req.body,
            {new: true}
        );
        res.status(200).json({error:false,message:"items updated"})
    } catch (error) {
        res.status(500).json({message:"Item is not updated"})
    }
}

module.exports = {createItem,getItems,deleteItems,updateItem}