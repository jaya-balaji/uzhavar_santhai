const express = require("express")
const mangoose = require("mongoose")
const cors = require("cors")
//importing all routes from admin
const adminRoutes=require('./routes/adminRoutes')
const itemRoutes=require('./routes/itemRoutes')


const app = express()
app.use(express.json())
app.use(cors())

app.use('/admin',adminRoutes)
app.use('/item',itemRoutes)


mangoose.connect("mongodb://127.0.0.1:27017/admin").then(()=>console.log("mongo DB connected"))

app.listen(3001, ()=>{
    console.log("server is running on port 3001")
})