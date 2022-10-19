const catExp = /^([a-z0-9]+)(([\s\-\_\/\\]?[a-z0-9]+)*)$/i;
export const productUpdateValidation = ({values:state}) => {
    let err = {
        name:null,
        category:null,
        price:null,
        desc:null,
        status:false
    };
    if(!state.name || state.name==''){
        if(state.name.length==0){
            err.status|=true;
            err.name = 'Name cannot be Empty'
        }
    }
    if(state.category||state.category==''){
        if(state.category.length==0){
            err.status|=true;
            err.category = 'Category cannot be Empty' 
        }
        else if(!catExp.test(state.category)){
            err.status|=true;
            err.category= 'category can only contain Alphabets and Numbers seperated by space,_,\\,\/ or -';
        }
    }
    if(state.price||state.price==''){
        if(state.price.toString().length==0){
            err.status|=true;
            err.price = 'Price cannot be Empty and should be a Number';
        }
        else if(isNaN(Number(state.price))){
            err.status|=true;
            err.price  = 'Price can only be a Number';
        }
    }
    return err;
};
export const productCreateValidation = ({values:state}) => {
    let err = {
        name:null,
        category:null,
        price:null,
        desc:null,
        status:false
    };
    if(!state.name||state.name.length==0){
        err.status|=true;
        err.name = 'Name cannot be Empty';
    }
    if(!state.category||state.category.length==0){
        err.status|=true;
        err.category = 'Category cannot be Empty';
    }
    else if(!catExp.test(state.category)){
        err.status|=true;
        err.category ='Category can only contain Alphabets and Numbers seperated by space,_,\\,\/ or -';
    }
    if(!state.price){
        err.status|=true;
        err.price = 'Price cannot be Empty and should be a number';
    }
    else if(isNaN(Number(state.price))){
        err.status|=true;
        err.price = 'Price can only be a Number';
    }
    return err;
}