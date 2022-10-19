const mongoose = require('mongoose');
const connection = require('../utilities/connection');


const userSchema = new mongoose.Schema({
    userId:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    email:{
        type:String,
        unique:true,
        trim:true,
        required:true
    },
    phone:{
        type:Number,
        min:1e9,
        max:9999999999
    },
    role:{
        type:String,
        enum:['User','Admin'],
        default:'User',
        trim:true,
        required:true
    },
    secret:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
        trim:true
    },
    img:{
        type: String,
        trim: true
    },
    imgPath:{
        type:String,
        trim:true
    },
},{collection:'users',timestamps:true});


exports.Updatable = ["phone","name"];
exports.getDB = async() => await connection.createConnection("user",userSchema);

