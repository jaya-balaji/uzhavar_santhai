const Admin=require('../models/adminSchema');
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
//deleting admin data
const deleteAdmin=(req,res)=>{
    try {
         
    } catch (error) {
        console.log("ERROR IN DELETING ADMIN")
    }
}

//authentication of Admin data
const authenticateAdmin = async (req,res)=>{
    const {email,password} = req.body

    try{
        //check username existence in db
        const user = await Admin.findOne({email:email,password:password});
        if(!user){
            return res.status(200).json({message:"Username not found"})      
        }
        res.status(200).json({ message: 'Login successful',error: 'false',id: user._id });
    } catch(error) {
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {createAdmin,deleteAdmin,authenticateAdmin}