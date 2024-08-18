const { request } = require('express')
const Admin = require('../models/adminSchema')
const User = require("../models/userSchema")

const getAndSetthecreater =async (req,res,next)=>{
    try {
        const location = req.headers.location

        const admin = await Admin.find({location : location})
        if(admin.length===0){
            return res.status(200).json([])
        } else {
            const adminData = admin[0]
            req.body.creator = adminData._id.toString()
            next();
        }
    } catch (error) {
        res.status(500).json({ message: 'Error in getAndSetthecreater', error }); // Send error response
    }
}

const getuserData = async (req,res) =>{
    try {
        const id = req.body.user

        const AdminDataArray = await Admin.find()
    
        const location = AdminDataArray.map(item =>{
            return item.location
        })
        
        const userDataArray = await User.find({_id:id})
        const {email,name,phone} = userDataArray[0]
        return res.status(200).json({email,name,phone,location})
    } catch (error) {
        res.status(500).json({ message: 'Error in getuserData', error }); // Send error response
    }
}

module.exports = {getAndSetthecreater,getuserData}