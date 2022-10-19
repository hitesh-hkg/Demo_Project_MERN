const userModel = require('../models/userModel');
const uuid = require('uuid');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const httpError = require('http-errors')
const {secret:jwt_sec}=require('../auth-config');
const hashPassword = (pass) => {
    let salt = crypto.randomBytes(16).toString('hex');
    let secret = crypto.scryptSync(pass,salt,128);
    return salt+"."+secret.toString('hex');
};


const verifyPassword = (pass,secret) => {
    let [salt,key] = secret.split('.');
    let result = key == crypto.scryptSync(pass,salt,128).toString('hex');
    return result;
}


exports.createUser = async(req,res,next) => {
    try{
        let db = await userModel.getDB();
        const userId = req.body.userId||uuid.v4();
        let imgPath=null;
        if(req.file)imgPath = path.join(__dirname,`../images/users/${req.file.filename}`);
        let userInit = {
            userId:userId,
            img:`http://localhost:5000/users/image`
        };
        if(imgPath && fs.existsSync(imgPath))userInit["imgPath"]=imgPath;
        let role = (req.body.email=='iamAdmin@idelte.com')?'Admin':'User',secret = hashPassword(req.body.password);
        let user = {
            email:req.body.email,
            phone:req.body.phone,
            name:req.body.name,
            role:role,
            secret:secret
        };
        const newUser = new db({...user,...userInit});
        let result = await newUser.save();
        if(result instanceof db){
            let {secret,...created}=result.toObject();
            res.status(200).json({
                message:"user created sucessfully. Login to continue.",
                user:created
            });
        }else{
        throw new httpError(400,"user creation failed. Try Again.");
        }
    }catch(e){
        next(e);
    }
}
exports.login = async(req,res,next) => {
    try{
        let db = await userModel.getDB();
        let user = req.body;
        let result = await db.findOne({email:user.email});
        if(result instanceof db){
            if(verifyPassword(user.password,result.secret)){
                const token = jwt.sign({userId:result.userId.toString()}, jwt_sec , {
                    expiresIn: 86400 // 24 hours
                  });
                res.status(200).json({
                    status:'success',
                    user:{
                        id: result.userId,
                        name: result.name,
                        email: result.email,
                        phone: result.phone,
                        role: result.role,
                        accessToken: token
                    },
                })
            }else{
                throw new httpError(400,'Password entered is incorrect');
            }
        }else{
            throw new httpError(400,`User with email:${user.email} not found. Consider Signing Up.`);
        }
    }catch(e){
        next(e);
    }
}


exports.getDetails = async(req,res,next) => {
    try{
        let db = await userModel.getDB();
        let result = await db.findOne({userId:req.userId});
        if(result instanceof db){
                res.status(200).json({
                    status:'success',
                    user:{
                        id: result.userId,
                        name: result.name,
                        email: result.email,
                        phone: result.phone,
                        role: result.role,
                        img: result.img,
                        accessToken: req.headers['x-access-token']
                    }
                });
        }else{
            throw new httpError(400,`No User Exists with userId:${req.userId}`);
        }
    }catch(e){
        next(e);
    }
};
exports.setDetails = async(req,res,next) => {
    try{
        let db = await userModel.getDB();
        let update = Object.create({}),imgPath=null;
        if(req.body.password){
            update['userId']=uuid.v4();
            update['secret']=hashPassword(req.body.password);
        }
        Object.keys(req.body).map((k)=>{
            if(userModel.Updatable.includes(k))update[k] = req.body[k];
        });
        if(req.file)imgPath = path.join(__dirname,`../images/users/${req.file.filename}`);
        if(imgPath && fs.existsSync(imgPath))update['imgPath']=imgPath;
        let result = await db.findOneAndUpdate({userId:req.userId},{$set:update},{new:true,timestamps:true});
        const token = update['userId']?null:req.headers['x-access-token'];
        if(result instanceof db){
            res.status(200).json({
                status:'success',
                user:{
                    id: result.userId,
                    name: result.name,
                    email: result.email,
                    phone: result.phone,
                    role: result.role,
                    img: result.img,
                    accessToken : token
                }
            });
        }else{
            throw new httpError(400,`No User Exists with userId:${req.userId}`);
        }
    }catch(e){
        next(e);
    }
};
exports.removeUser = async(req,res,next) => {
    try{
        let db = await userModel.getDB();
        let result = await db.deleteOne({userId:req.userId});
        if(result.ok && result.deletedCount){
            res.status(200).json({
                status:'success',
                message:'User Deleted',
            });
        }else{
            if(!result.ok)
            {
                throw new httpError(500,'Internal Server httpError.... Try Again....');
            }
            else{
                throw new httpError(400,`No user found with userId : ${req.userId}`);
            }
        }
    }catch(e){
        next(e);
    }
};


exports.getImg = async(req,res,next) => {
    try{
        let db = await userModel.getDB();
        let user = await db.findOne({userId:req.userId});
        let img=null;
        if(user instanceof db){
            if(fs.existsSync(user.imgPath))img=user.imgPath;
            else img = path.resolve(__dirname,"../images/users/default.jpg");
            res.sendFile(path.resolve(img), {headers: {'Content-Type': 'image/jpeg'}});
        }else{
            throw new httpError(400,"No such image Found");
        }
    }catch(e){
        next(e);
    }
}


exports.isAuth = async(req,res,next)=>{
    try{
        if(req.userId)res.status(200).json({status:'success',result:true});
        else throw new httpError(400,'not Authenticated');
    }catch(e){
        next(e);
    }
}

