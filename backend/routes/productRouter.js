const express = require('express');
const productController = require('../controllers/productController');
const validator = require('../utilities/validation');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');


const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        const dir = './images/products';
        console.log(fs.existsSync(dir));
        if(fs.existsSync(dir))cb(null,dir);
        else cb('no such dir');
    },
    filename: function (req, file, cb) {
        if(!req.body.pid)req.body.pid = uuid.v4();
        console.log(req.body);
        cb(null, req.body.pid + "_" + Date.now()+ path.extname(file.originalname))
    }
});


const upload = multer({
    storage:storage,
    limits:{fileSize:2e7},
    fileFilter: function (req, file, cb) {
        console.log('upd');
        if(!file){
            console.log("here");
            return cb(null,false);
        }
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
router.get('/sample',productController.getSample);
router.get('/products',productController.getProducts);
router.get('/products/:pid/details',validator.productDetailsValidation,productController.getProductById);
router.get('/products/:term',validator.productSearchValidation,productController.searchProducts);
router.get('/products/:pid/image',productController.getImg);
router.post('/products',upload.single('productImg'),validator.authenticate,validator.isAdmin,validator.productCreateValidation,productController.createProduct);
router.delete('/products/:pid',validator.authenticate,validator.isAdmin,validator.productDeleteValidation,productController.removeProduct);
router.put('/products',upload.single('productImg'),validator.authenticate,validator.isAdmin,validator.productUpdateValidation,productController.updateProductDetails);
router.all('*',(req,res,next)=>next());

module.exports = router;

