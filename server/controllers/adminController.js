const Admin=require('../models/adminSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//creating new data in database
const isLocationExists =async (req,res,next) =>{

    try{
        const location = req.body.location

        const getAdminData = await Admin.find()
        
        const isLocationFound = getAdminData.some(data => data.location === location)
    
        if(isLocationFound){
            return res.status(200).json({message:"Admin already exists for the location",boolean:false})
        } else {
            next();
        }
    } catch (error) {
        res.status(500).json({ error: 'Error checking location existence' });
    }

}

const createAdmin = (req,res)=>{

    try {
        Admin.create(req.body)
        .then(admin => {
         res.status(200)
        .send({
            error: false,
            message: "Admin data Saved successfully"
        })
        })
        .catch(err => res.json(err))
      
    } catch (error) {
        console.log("ERROR IN DELETING ADMIN")
        res.status(500)
        .send({
            error: true,
            message: error.message
        })
    }
}
//hashing password using bcrypt
const hashPassword = async (req, res, next) => {
    const { password } = req.body;
    if (!password) {
        return res.status(400).json({ error: 'Password is required' });
    }
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        req.body.password = hashedPassword;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error hashing password' });
    }
};

//authentication of Admin data
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check username existence in db
        const user = await Admin.findOne({ email });
        if (!user) {
            return res.status(200).json({ error: 'Invalid username' });
        }

        // Check password validity
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(200).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ id: user._id }, 'pvQCvCYknO8DpRi', { expiresIn: '1h' });
        console.log("USER:",user)
        console.log("TOKEN: ",token);
        res.status(200).json({ message: 'Login successful', error: false, id: token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getAdminData = async (req,res) =>{

    const id = req.body.creator
    try{
        const AdminDataArray = await Admin.find({_id:id})
        const {email,name,phone,location} = AdminDataArray[0]
        return res.status(200).json({email,name,phone,location})
    } catch {
        res.status(500).json({ message: 'Server error' });
    }

}

module.exports = {isLocationExists,createAdmin,loginAdmin,hashPassword,getAdminData}