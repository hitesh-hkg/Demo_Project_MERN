const jwt = require('jsonwebtoken');
const {secret:jwt_sec} = require('../auth-config');
const httpError = require('http-errors');
const fs = require('fs');
const userModel = require('../models/userModel');
const catExp = /^([a-z0-9]+)(([\s\-\_\/\\]?[a-z0-9]+)*)$/i;
const emailExp = /^.*@.*\..*$/;
const passExp = /^[a-z0-9\s\$\_\?\&\(\)]{8,32}$/i;


exports.productUpdateValidation = (req,res,next) => {
    try{
        if(!req.body){
            throw new httpError(400,'Please Send details to update product...');
        }
        if(!req.body.pid){
            throw new httpError(400,'pid is required to perform updates...');
        }
        if(req.body.name){
            if(req.body.name.length==0){
                throw new httpError(400,'Name cannot be empty');    
            }
        }
        if(req.body.category){
            if(!catExp.test(req.body.category)){
                throw new httpError(400,'category can only contain Alphabets and Numbers seperated by space,_,\\,\/ or -');    
            }
        }
        if(req.body.price){
            if(isNaN(Number(req.body.price))||req.body.price.toString().length==0){
                throw new httpError(400,'category can only be a number');
            }
        }
        if(req.body.desc){
            if(req.body.desc.length==0){
                throw new httpError(400,'Description cannot be empty');      
            }
        }
        next();
    }catch(e){
        next(e);
    }
};
exports.productCreateValidation = (req,res,next) => {
    try{
        let err = null;
        if(!req.body){
            throw new httpError(400,'Please Send details to add product...');
        }
        if(!req.body.name||req.body.name.length==0){
            throw new httpError(400,'Name cannot be empty');
        }
        if(!req.body.category||req.body.category.length==0){
            throw new httpError(400,'Category cannot be empty');
        }
        if(!catExp.test(req.body.category)){
            throw new httpError(400,'Category can only contain Alphabets and Numbers seperated by space,_,\\,\/ or -')
        }
        if(!req.body.price){
            throw new httpError(400,'Price cannot be empty');  
        }
        if(isNaN(Number(req.body.price))){
            throw new httpError(400,'Price can only be a number');
        }
        if(req.body.desc){
            if(req.body.desc.length==0){
                throw new httpError(400,'Description cannot be empty');  
            }
        }
        next();
    }catch(e){
        next(e);
    }
};


exports.productDetailsValidation = (req,res,next)=>{
    try{
        if(!req.params.pid||req.params.pid.length==0){
            throw new httpError(400,'pid is required to fetch details');
        }
        next();
    }catch(e){
        next(e);
    }
}
exports.productDeleteValidation = (req,res,next)=>{
    try{
        if(!req.params.pid||req.params.pid.length==0){
            throw new httpError(400,'pid id required to delete product');  
        }
        next();
    }catch(e){
        next(e);
    }
}
exports.productSearchValidation = (req,res,next)=>{
    try{
        if(!req.params.term||req.params.term.length==0){
            throw new httpError('term is required to fetch details');
           
        }
        next();
    }catch(e){
        next(e);
    }
};


exports.signupValidation = async(req,res,next)=>{
    try{
        const db = await userModel.getDB();
        if(!req.body){
            throw new httpError(400,'please send user details to signup');
        }
        if(!req.body.name || req.body.name.length==0)
        {
            throw new httpError(400,'name cannot be empty');
           
        }
        if((!req.body.email) || req.body.email.length==0)
        {
            throw new httpError(400,'email is required');
           
        }
        if(!emailExp.test(req.body.email)){
            throw new httpError(400,'enter a valid email address');
           
        }else{
            let res = await db.findOne({email:`${req.body.email}`});
            if(res instanceof db){
                throw new httpError(400,`user with ${req.body.email} already exists`);    
            }
        }
        if(req.body.phone)
        {
            if((""+req.body.phone).length==0){
                throw new httpError(400,`phone cannot be empty`);      
            }
            if(isNaN(req.body.phone)){
                throw new httpError(400,`phone is invalid`);
               
            }else{
                req.body.phone= Number(req.body.phone);
            }
            if(req.body.phone<1000000000 || req.body.phone>9999999999){
                throw new httpError(400,'phone is invalid');
               
            }
        }
        if((!req.body.password) || req.body.password.length==0){
            throw new httpError(400,'password is required');
           
        }
        if(req.body.password.length<8 || req.body.password.length>32){
            throw new httpError(400,'password can only be between 8 to 32 characters long');
           
        }
        if(!passExp.test(req.body.password)){
            throw new httpError(400,'password can only contain letters,disgits,$,_,(,),? and &');
           
        }  
        next();
    }catch(e){
        next(e);
    }
};
exports.loginValidation = (req,res,next)=>{
    try{
        if(!req.body){
            throw new httpError(400,'please send user details to signup');
        }
        if((!req.body.email) || req.body.email.length==0)
        {
            throw new httpError(400,'email is required');
           
        }
        if(!emailExp.test(req.body.email)){
            throw new httpError(400,'enter a valid email address');
           
        }
        if((!req.body.password) || req.body.password.length==0){
            throw new httpError(400,'password is required');
           
        }
        if(req.body.password.length<8 || req.body.password.length>32){
            throw new httpError(400,'password can only be between 8 to 32 characters long');
           
        }
        if(!passExp.test(req.body.password)){
            throw new httpError(400,'password can only contain letters,disgits,$,_,(,),? and &');
           
        }
        next();
       
    }catch(e){
        next(e);
    }
};


exports.userUpdateValidation = (req,res,next)=>{
    try{
        if(!req.body){
            throw new httpError(400,'please send user details to update');
        }
        if(req.body.name && req.body.name.length==0)
        {
            throw new httpError(400,'name cannot be empty');
           
        }
        if(req.body.phone)
        {
            if((""+req.body.phone).length==0){
                throw new httpError(400,`phone is required`);
               
            }
            if(isNaN(req.body.phone)){
                throw new httpError(400,`phone is invalid`);
               
            }else{
                req.body.phone= Number(req.body.phone);
            }
            if(req.body.phone<1000000000 || req.body.phone>9999999999){
                throw new httpError(400,'phone is invalid');
            }
        }
        if(req.body.password)
        {
            if(req.body.password.length==0){
                throw new httpError(400,'password is required');  
            }
            if(req.body.password.length<8 && req.body.password.length>32){
                throw new httpError(400,'password can only be between 8 to 32 characters long');
               
            }
            if(!passExp.test(req.body.password)){
                throw new httpError(400,'password can only contain letters,disgits,$,_,(,),? and &');
               
            }
        }
        next();    
    }catch(e){
        next(e);
    }
};


exports.authenticate = (req,res,next) => {
    try{
        let tok = req.headers['x-access-token'];
        console.log(tok);
        if(!tok){
            throw new httpError(401,'No token found');
        }
        else{
            let dec = jwt.verify(tok,jwt_sec)
            req.userId = dec.userId;
            next();
        }
    }catch(e){
        next(e);
    }
};
exports.isUser = async(req,res,next)=>{
    try{
        const db = await userModel.getDB();
        const user = await db.findOne({userId:req.userId,role:{$exists:true}});
        if(user instanceof db){
            next();
        }else{
            throw new httpError(403,'Forbidden');
        }
    }catch(e){
        next(e);
    }
}
exports.isAdmin = async(req,res,next)=>{
    try{
        const db = await userModel.getDB();
       

        const user = await db.findOne({userId:req.userId,role:'Admin'});
        if(user instanceof db){
            next();
        }else{
            throw new httpError(403,'Forbidden');
        }
    }catch(e){
        next(e);
    }
}

