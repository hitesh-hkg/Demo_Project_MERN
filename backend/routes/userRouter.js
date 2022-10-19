const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const validation = require('../utilities/validation');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');
const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const dir = './images/users';
        console.log(fs.existsSync(dir));
        if(fs.existsSync(dir))cb(null,dir);
        else cb('no such dir');
    },
    filename: function (req, file, cb) {
        if(req.userId)cb(null, req.userId + "_" + Date.now()+ path.extname(file.originalname));
        else {
            if(!req.body.userId && !req.userId)req.body.userId = uuid.v4();
            cb(null, req.body.userId + "_" + Date.now()+ path.extname(file.originalname));
        }
    }
});


const upload = multer({
    storage:storage,
    limits:{fileSize:2e7},
    fileFilter: function (req, file, cb) {
        if(!file){
            console.log("here");
            return cb(null,false);
        }
        console.log('upd');
        var filetypes = /jpeg|jpg|png|jfif/;
        var mimetype = filetypes.test(filetypes);
        var extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname)
        {  
            return cb(null, true);
        }
        else {
            return cb("File upload only supports the " + filetypes);
        }
    }
});
router.use((req,res,next)=>{console.log(req.path);next()});
router.post('/signup',upload.single('userImg'),validation.signupValidation,userController.createUser);
router.post('/login',upload.none(),validation.loginValidation,userController.login);
router.get('/user/details',upload.none(),validation.authenticate,validation.isUser,userController.getDetails);
router.get('/user/image',upload.none(),validation.authenticate,validation.isUser,userController.getImg);
router.put('/user',upload.single('userImg'),validation.authenticate,validation.isUser,validation.userUpdateValidation,userController.setDetails);
router.delete('/user',upload.none(),validation.authenticate,validation.isUser,userController.removeUser);
router.get('/auth',validation.authenticate,validation.isUser,userController.isAuth)
router.all('*',async(req,res,next)=>next());


module.exports = router;

