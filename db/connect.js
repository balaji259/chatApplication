require('dotenv').config()
const mongoose=require('mongoose');
const User=require("../models/users.js");
const Room=require("../models/rooms.js");


async function connectdb(){
    try{
        await mongoose.connect(process.env.mongo_url);
        console.log("Connected to DB");
    }
    catch(e)
    {
        console.log(e.message);
    }
}

module.exports=connectdb;