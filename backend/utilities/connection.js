const mongoose = require('mongoose');
const httpError = require('http-errors');
const connectionOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
};


const createConnection = async (collection,schema) => {
   try{
        await mongoose.connect("mongodb://127.0.0.1:27017/DemoDB",connectionOptions);
        if(collection && schema)
        {
            const model = await mongoose.model(collection,schema);
            return model;
        }
        console.log("success");
   }catch(e){
       throw new httpError(500,"Problem connecting to mongodb.....");
   }
};


createConnection().then(()=>console.log("connection to mongodb success...."));

exports.createConnection = createConnection;

