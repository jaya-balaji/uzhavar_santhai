const User=require('../models/userSchema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//creating new data in database
const createUser = (req,res)=>{
    try {
        User.create(req.body)
        .then(user => console.log(user))
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
const deleteUser=(req,res)=>{
    try {
         
    } catch (error) {
        console.log("ERROR IN DELETING ADMIN")
    }
}

//authentication of Admin data
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check username existence in db
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(200).json({ error: 'Invalid credentials' });
        }

        // Check password validity
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(200).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, 'pvQCvCYknO8DpRi', { expiresIn: '1h' });
        res.status(200).json({ message: 'Login successful', error: false, id: token });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {createUser,deleteUser,loginUser,hashPassword}