const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
//importing all routes from admin
const adminRoutes=require('./routes/adminRoutes')
const itemRoutes=require('./routes/itemRoutes')
const userRoutes = require('./routes/userRouts')
const userItemRoutes = require('./routes/userItemRoutes')

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'https://uzhavar-santhai.vercel.app'
}));

app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});


app.use('/admin',adminRoutes)
app.use('/item',itemRoutes)
app.use('/user',userRoutes)
app.use('/userItem',userItemRoutes)


mongoose.connect("mongodb+srv://balabavan1013:123abc@balajidb.fahx7.mongodb.net/farmerDB").then(()=>console.log("mongo DB connected")).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

app.listen(3001, ()=>{
    console.log("server is running on port 3001")
})