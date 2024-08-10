const Item = require("../models/itemSchema")

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
    let totalStock = 0
    const fruits = ['apple','banana','pomegranate','mango']
    let fruitsCount = 0
    let vegetableCount = 0
    let counts = {}
    
    try {
        const items = await Item.find({creator: req.body.creator}); // Fetch all items using Mongoose
        const modifiedItems = items.map(item => {
        totalStock=item.stock+totalStock
        if(fruits.find(fruit => fruit===item.name.toLowerCase())){
                fruitsCount = fruitsCount+item.stock
        } else {
                vegetableCount = vegetableCount+item.stock
        }
        return {id:item._id,name:item.name,stock:item.stock,price:item.price}
        });

        modifiedItems.sort(((a,b)=> a.price - b.price))
        counts ={totalStock:totalStock,fCount:fruitsCount,vCount:vegetableCount}
        const itemWithStock = {modifiedItems,counts}
        res.status(200).send(itemWithStock);
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
    console.log("update block body :",req.body)
    const {name,price,stock} = req.body
    try {
        const uptItem = await Item.findByIdAndUpdate(
            req.headers.id,
            {name:name,price:price,stock:stock},
            {new: true}
        );
        res.status(200).json({error:false,message:"items updated"})
    } catch (error) {
        res.status(500).json({message:"Item is not updated"})
    }
}

module.exports = {createItem,getItems,deleteItems,updateItem}