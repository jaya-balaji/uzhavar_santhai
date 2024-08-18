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
// CORS configuration to allow all origins and methods
const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204
};


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    next();
  });

  app.use(cors(corsOptions));

  
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!');
});


app.use('/admin',adminRoutes)
app.use('/item',itemRoutes)
app.use('/user',userRoutes)
app.use('/userItem',userItemRoutes)

const uri="mongodb+srv://Badhri007:Badlak717@money-matrix.0i3z4s6.mongodb.net/farmerDB"
mongoose.connect(uri).then(()=>console.log("mongo DB connected")).catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

app.listen(3001, ()=>{
    console.log("server is running on port 3001")
})