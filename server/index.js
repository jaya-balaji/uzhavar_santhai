const express = require("express")
const mangoose = require("mongoose")
const cors = require("cors")
//importing all routes from admin
const adminRoutes=require('./routes/adminRoutes')
const itemRoutes=require('./routes/itemRoutes')
const userRoutes = require('./routes/userRouts')
const userItemRoutes = require('./routes/userItemRoutes')

const app = express()
app.use(express.json())
// app.use(cors())

app.use('/admin',adminRoutes)
app.use('/item',itemRoutes)
app.use('/user',userRoutes)
app.use('/userItem',userItemRoutes)


mangoose.connect("mongodb+srv://balabavan1013:123abc@balajidb.fahx7.mongodb.net/farmerDB").then(()=>console.log("mongo DB connected"))

app.listen(3001, ()=>{
    console.log("server is running on port 3001")
})