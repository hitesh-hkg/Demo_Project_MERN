const  uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const productModel = require('../models/productModel');
const httpError = require('http-errors');
exports.getProducts = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        let products = await db.find({});
        if(products.length){
            res.status(200).json({
                status: "success",
                data:products
            });
        }else{
            res.status(200).json({
                status: "success",
                message: "No products found"
            })
        }
    }catch(e){
        next(e);
    }
}


exports.getProductById = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        let product = await db.findOne({pid:req.params.pid});
        if(product instanceof db){
            res.status(200).json({
                status: "success",
                data:product
            });
        }else{
            res.status(200).json({
                status: "success",
                message: `No product found with pid: ${req.params.pid}`
            })
        }
    }catch(e){
        next(e);
    }
}


exports.getSample = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        let size = Math.ceil(Math.random()*7)+3;
        let products = await db.aggregate([
            {$match:{}},
            {$sample:{size}}
        ]);
        if(products.length){
            res.status(200).json({
                status: "success",
                data:products
            });
        }else{
            res.status(200).json({
                status: "success",
                message: "No products found"
            })
        }
    }catch(e){
        next(e);
    }
};


exports.getImg = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        let product = await db.findOne({pid:req.params.pid});
        let img=null;
        if(product instanceof db){
            if(fs.existsSync(product.imgPath))img=product.imgPath;
            else img = path.resolve(__dirname,"../images/products/default.jpg");
            res.sendFile(path.resolve(img), {headers: {'Content-Type': 'image/jpeg'}});
        }else{
            throw new httpError(400,"No such product Found");
        }
    }catch(e){
        next(e);
    }
}


exports.searchProducts = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        const sanitize = (s)=>s.replaceAll(/[\\\+\|\.\*\(\)\{\}\[\]\?\^\$]/ig,"\\$&");
        const term = sanitize(req.params.term);
        let products = await db.find({$or:[{name:{$regex:`^${term}.*`,$options:"i"}},{category:{$regex:`${req.params.term}.*`,$options:"i"}}]});
        if(products.length){
            res.status(200).json({
                status: "success",
                data:products
            });
        }else{
            res.status(200).json({
                status: "success",
                message: `No product related to ${req.params.term} found.`
            })
        }
    }catch(e){
        next(e);
    }
}


exports.updateProductDetails = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        let query = {pid:`${req.body.pid}`},imgPath=null;
        let update = Object.create({});
        Object.keys(req.body).map((k)=>{
            if(productModel.pUpdatable.includes(k))update[k] = req.body[k];
        });
        if(req.file)imgPath = path.join(__dirname,`../images/products/${req.file.filename}`);
        if(imgPath && fs.existsSync(imgPath))update['imgPath']=imgPath;
        let result = await db.findOneAndUpdate(query,{$set:update},{new:true,timestamps:true});
        if(result instanceof db){
            res.status(200).json({
                status: "success",
                message : 'Product details updated successfully',
                product:result
            });
        }else{
            throw new httpError(400,'Product could not be updated to given configuration.')
        }
    }catch(e){
        next(e);
    }
}


exports.removeProduct = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        let result = await db.deleteOne({pid:req.params.pid});
        if(result.ok && result.deletedCount){
            res.status(200).json({
                status: "success",
                data:result
            });
        }else{
            let err = null;
            if(!result.ok)
            {
                throw new httpError(500,'Internal Server Error.... Try Again....');
            }
            else{
                throw new httpError(400,`No product found with pid : ${req.params.pid}`);
            }
            throw err;
        }
    }catch(e){
        next(e);
    }
}


exports.createProduct = async(req,res,next) => {
    try{
        let db = await productModel.getDB();
        const pid = req.body.pid||uuid.v4();
        let imgPath=null;
        if(req.file)imgPath = path.join(__dirname,`../images/products/${req.file.filename}`);
        let prodInit = {
            pid:pid,
            img:`http://localhost:5000/products/${pid}/image`
        };
        if(imgPath && fs.existsSync(imgPath))prodInit["imgPath"]=imgPath;
        const product = new db({...req.body,...prodInit});
        const result = await product.save();
        if(result instanceof db){
            res.status(200).json({
                status:'success',
                message: 'Product was created successfully',
                product: result
            });
        }else{
            throw new httpError(500,'Could not create the requested product. Please try again.');
        }
    }catch(e){
        next(e);
    }
}



