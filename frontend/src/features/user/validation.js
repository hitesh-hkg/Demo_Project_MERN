const emailExp = /^.*@.*\..*$/;
const passExp = /^[a-z0-9\s\$\_\?\&\(\)]{8,32}$/i;


export const signupValidation = ({values:state})=>{
    let err = {
        name:null,
        email:null,
        phone:null,
        password:null,
        status :false
    }
    if(!state.name || state.name.length==0)
    {
        err.status|=true;
        err.name='name cannot be empty';
       
    }
    if((!state.email) || state.email.length==0)
    {
        err.status|=true;
        err.email = 'email is required';
       
    }
    else if(!emailExp.test(state.email)){
        err.status|=true;
        err.email = 'enter a valid email address';
    }
    if(state.phone)
    {
        if((""+state.phone).length==0){
            err.status|=true;
            err.phone=`phone cannot be empty`;      
        }
        else if(isNaN(state.phone)){
            err.status|=true;
            err.phone = `phone is invalid`;
           
        }
        else if(state.phone<1000000000 || state.phone>9999999999){
            err.status|=true;
            err.phone = 'phone is invalid';
           
        }
    }
    if((!state.password) || state.password.length==0){
        err.status|=true;
        err.password = 'password is required';
       
    }
    else if(state.password.length<8 || state.password.length>32){
        err.status|=true;
        err.password = 'password can only be between 8 to 32 characters long';
       
    }
    else if(!passExp.test(state.password)){
        err.status|=true;
        err.password = 'password can only contain letters, digits,$,_,(,),? and &';
       
    }
    return err;
}
export const loginValidation = ({values:state})=>{
    let err = {
        email:null,
        password:null,
        status :false
    }
    if((!state.email) || state.email.length==0)
    {
        err.status|=true;
        err.email = 'email is required';      
    }
    else if(!emailExp.test(state.email)){
        err.status|=true;
        err.email = 'enter a valid email address';  
    }
    if((!state.password) || state.password.length==0){
        err.status|=true;
        err.password = 'password is required';    
    }
    else if(state.password.length<8 || state.password.length>32){
        err.status|=true;
        err.password = 'password can only be between 8 to 32 characters long';  
    }
    else if(!passExp.test(state.password)){
        err.status|=true;
        err.password = 'password can only contain letters, digits,$,_,(,),? and &';    
    }
    return err;
};


export const userUpdateValidation = ({values:state})=>{
    let err = {
        name:null,
        phone:null,
        password:null,
        status :false
    }
    if(state.name=='' || state.name.length==0)
    {
        err.status|=true;
        err.name = 'name cannot be empty';    
    }
    if(state.phone)
    {
        if((""+state.phone).length==0){
            err.status|=true;
            err.phone = `phone is required`;  
        }
        else if(isNaN(state.phone)){
            err.status|=true;
            err.phone = `phone is invalid`;    
        }
        else if(state.phone<1000000000 || state.phone>9999999999){
            err.status|=true;
            err.phone = 'phone is invalid';
        }
    }
    if(state.password)
    {
        if(state.password.length==0){
            err.status|=true;
            err.password = 'password is required';  
        }
        else if(state.password.length<8 && state.password.length>32){
            err.status|=true;
            err.password = 'password can only be between 8 to 32 characters long';    
        }
        else if(!passExp.test(state.password)){
            err.status|=true;
            err.password = 'password can only contain letters, digits,$,_,(,),? and &';  
        }
    }
    console.log(state,err);
    return err;
};