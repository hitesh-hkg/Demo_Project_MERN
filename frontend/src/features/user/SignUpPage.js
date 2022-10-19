import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, checkAuth, selectAddUser,selectAuthStatus,selectUser,selectUserReload, unmountSignUp } from "./userSlice";
import { signupValidation } from "./validation";


const SignUpPage = () => {
    let nav=useNavigate();
    let dispatch = useDispatch();
    let user = useSelector(selectUser);
    let Auth = useSelector(selectAuthStatus);
    let {status,error} = useSelector(selectAddUser);
    let reload = useSelector(selectUserReload);
    let [refresh,setRefresh] = useState(null);
    let [state,setState] = useState({
        values:{
            email:null,
            name:null,
            password:null,
            phone:null
        },
        err:{
            email:null,
            name:null,
            password:null,
            phone:null,
            status:false
        },
        changed:{
            email:false,
            name:false,
            password:false,
            phone:false
        },
        submit:false
    });


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);


    useEffect(()=>{
        if(Auth=='success'||status == 'success'){nav('/login');dispatch(unmountSignUp());}
    },[dispatch,nav,Auth,unmountSignUp,status]);


    useEffect(()=>{
        if(state.values)setState(p=>({...p,err:{...signupValidation(p)}}));
        if(status=='success')return ()=>{nav(`/login`);dispatch(unmountSignUp());}
    },[state.values,setState,signupValidation,status,nav,dispatch,unmountSignUp]);


    useEffect(()=>{
        if(status == 'success')return () => {nav(`/login`);dispatch(unmountSignUp());};
    },[status,dispatch],nav,unmountSignUp);


    useEffect(()=>{
        if(reload!=refresh)dispatch(unmountSignUp());
    },[reload,refresh,dispatch,unmountSignUp]);



    let statusMap = {
        idle:"Sign Up",
        loading:"Signing Up",
        success:"Sign Up Successful",
        failed:"Failed Sign Up"
    }


    let [imgUp,setImg] = useState(process.env.PUBLIC_URL+"/logo192.png");
    let [imgFile,setImgFile] = useState(null);
    const handleChange =(e)=>{
        e.preventDefault();
        setState(s=>({...state,values:{...state.values,[e.target.name]:e.target.value},changed:{...state.changed,[e.target.name]:true}}));
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setState({...state,submit:true});
        let data = new FormData(document.querySelector('#signUpForm'));
        if(imgFile)data.set("userImg",imgFile,imgFile.name);
        else data.delete('userImg');
        for (var pair of data.entries()) {
            console.log(pair[0],pair[1]);
        }
        if(!state.err.status)dispatch(addUser(data));
    }
    return (Auth!='success' && <div className='SignUpPage container'>
        <h2>{statusMap[status]}:</h2>
        {   ((status=="idle"||status=="loading")&&<form encType="multipart/form-data" id="signUpForm" className = "EditProduct form-group m-1" method="POST" onSubmit={(e)=>{handleSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="userName">Name</label>
                    <input id="userName" className="form-control" value={state.values.name}  name="name" onChange={(e)=>handleChange(e)}/>    
                    {((state.submit||state.changed.name) && state.err.name) && <p className='errLine' style={{color:'red'}}>{state.err.name}</p>}  
                </div>
                <div className="form-group">
                    <label htmlFor="userEmail">Email</label>
                    <input id="userEmail" className="form-control" value={state.values.email}  name="email" onChange={(e)=>handleChange(e)}/>    
                    {((state.submit||state.changed.email) && state.err.email) && <p className='errLine' style={{color:'red'}}>{state.err.email}</p>}  
                </div>
                <div className="form-group">
                    <label htmlFor="userPhone">Phone</label>
                    <input id="userPhone" type="number" className="form-control"  name="phone" value={state.values.phone} onChange={(e)=>handleChange(e)}/>
                    {((state.submit||state.changed.phone) && state.err.phone) && <p className='errLine' style={{color:'red'}}>{state.err.phone}</p>}  
                </div>
                <div className="form-group">
                    <label htmlFor="userPassword">Password</label>
                    <input id="userPassword" type='password' className="form-control"  name="password" value={state.values.password} onChange={(e)=>handleChange(e)}/>
                    {((state.submit||state.changed.password) && state.err.password) && <p className='errLine' style={{color:'red'}}>{state.err.password}</p>}  
                </div>
                <div className="form-group">
                    <label className="m-1" htmlFor="img-upload"><img name="preview" className="img-responsive img-thumbnail" src={imgUp} width="150px"/>
                    Click on the image to set new profile picture</label>
                </div>
                <input id="img-upload" name="userImg" type="file" style={{display:'none'}} onChange={(e)=>{setImgFile(e.target.files[0]);setImg(URL.createObjectURL(e.target.files[0]))}}/>
                <button className="btn btn-dark btn-block" type="submit" disabled={status=='loading'||state.err.status}>Submit</button>
            </form>) ||
            (status=="failed" && <div>Error....</div>)
        }
    </div>)||(<div>Taking to Login...</div>)
}

export default SignUpPage;