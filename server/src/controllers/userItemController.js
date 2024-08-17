const { request } = require('express')
const Admin = require('../models/adminSchema')
const User = require("../models/userSchema")

const getAndSetthecreater =async (req,res,next)=>{
    const location = req.headers.location

    const admin = await Admin.find({location : location})
    if(admin.length===0){
        return res.status(200).json([])
    } else {
        const adminData = admin[0]
        req.body.creator = adminData._id.toString()
        next();
    }
}

const getuserData = async (req,res) =>{
    const id = req.body.user

    const AdminDataArray = await Admin.find()

    const location = AdminDataArray.map(item =>{
        return item.location
    })
    
    const userDataArray = await User.find({_id:id})
    const {email,name,phone} = userDataArray[0]
    return res.status(200).json({email,name,phone,location})
}

module.exports = {getAndSetthecreater,getuserData}