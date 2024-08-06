const Admin=require('../models/adminSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//creating new data in database
const createAdmin = (req,res)=>{

    try {
        Admin.create(req.body)
        .then(admin => console.log(admin))
        .catch(err => res.json(err))
        res.status(200)
        .send({
            error: false,
            message: "Admin data Saved successfully"
        })
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


//deleting admin data
const deleteAdmin=(req,res)=>{
    try {
         
    } catch (error) {
        console.log("ERROR IN DELETING ADMIN")
    }
}

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
        console.log(token)

        res.status(200).json({ message: 'Login successful', error: false, id: token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {createAdmin,deleteAdmin,loginAdmin,hashPassword}