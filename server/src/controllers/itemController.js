const Item = require("../models/itemSchema")
const jwt = require('jsonwebtoken');

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

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Forbidden' });
        req.params.itemData = user.itemData; 
        next(); 
    });
};

const getItems = async(req,res)=>{
    try {
        const items = await Item.find({creator: req.params.itemData}); // Fetch all items using Mongoose
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

const updateItem =async (req,res)=>{
    console.log(req.body)
    try {
        const uptItem = await Item.findByIdAndUpdate(
            req.params.itemid,
            req.body,
            {new: true}
        );
        res.status(200).json({error:false,message:"items updated"})
    } catch (error) {
        res.status(500).json({message:"Item is not updated"})
    }
}

module.exports = {createItem,getItems,deleteItems,updateItem,authenticateToken}