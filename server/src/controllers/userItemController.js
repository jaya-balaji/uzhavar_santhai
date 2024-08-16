const { request } = require('express')
const Admin = require('../models/adminSchema')

const getAndSetthecreater =async (req,res,next)=>{
    const location = req.headers.location
    console.log("hiiiiiiiiiiiiiiiiiiiii")

    const admin = await Admin.find({location : location})
    console.log(admin[0])
    if(admin._id===null){
        res.status(403).json({message:"No creator for the location"})
    }
    const adminData = admin[0]
    req.body.creator = adminData._id
    console.log(req.body.creator)
    next();
}

module.exports = {getAndSetthecreater}