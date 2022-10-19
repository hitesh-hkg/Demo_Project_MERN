const fs = require('fs').promises;
let keys = ['name','category','price'];
let products = null;
fs.readFile('./export.csv','utf8').then((data)=>{
    products = data.split('\n').map((ds)=>{
        const obj = Object.create({
            name:null,
            category:null,
            desc:null,
            price:0
        });
        ds.split(',').map((v,i)=>{
            obj[keys[i]]=i<2 ? v : Number(v.replace('\\r',''));
        });
        obj['desc']=`${obj["name"]} belongs to ${obj["category"]} and sells for ${obj["price"]}`;
        return obj;
    });
    products = products.splice(1,products.length-2);
    console.log();
    fs.writeFile('./Products.json',JSON.stringify(products),(err,data)=>{
        if(err)console.log(err);
        else console.log(data);
    });
})

