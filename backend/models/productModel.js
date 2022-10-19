const mongoose = require('mongoose');
const uuid = require('uuid');
const path = require('path');
const connection = require('../utilities/connection');
const products = require('../Products.json').map((product)=>{
    let uid = uuid.v4();
    return {...product,pid:uid,img:`http://localhost:5000/products/${uid}/image`,imgPath:path.join(__dirname,`../images/products/${product.category}.jpg`)};
});
const productSchema = new mongoose.Schema({
    pid:{
        type:String,
        unique:true,
        required:true,
        trim:true
    },
    name:{
        type: String,
        required:true,
        trim: true
    },
    img:{
        type: String,
        trim: true
    },
    imgPath:{
        type:String,
        trim:true
    },
    category:{
        type: String,
        required:true,
        trim:true
    },
    desc:{
        type: String,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        default:0
    }
},{collection:'products',timestamps:true});


async function init(){
    let db = await connection.createConnection('product',productSchema);
    let delres = await db.deleteMany({});
    let result = await db.insertMany(products);
}


init().then(()=>console.log('init success'));


exports.pUpdatable  = ["name","category","price","desc"];
exports.getDB = async()=>await connection.createConnection('product',productSchema);

