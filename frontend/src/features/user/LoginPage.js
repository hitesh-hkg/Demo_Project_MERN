import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser, selectUserReload, selectLogin, unmountLogin, checkAuth, selectAuthStatus, selectUser } from "./userSlice";
import { loginValidation } from "./validation";
const LoginPage= ()=>{
    const dispatch = useDispatch();
    const nav = useNavigate();
    let Auth = useSelector(selectAuthStatus);
    let user = useSelector(selectUser);
    console.log(Auth);
    const [state,setState] = useState({
        values:{email:'',password:''},
        err:{email:null,password:null,status:false},
        changed:{email:false,password:false},
        submit:false
    });
    const reload = useSelector(selectUserReload);
    const {status,error} = useSelector(selectLogin);
    let [refresh,setRefresh] = useState(null);
    let statusMap = {
        idle:"Login",
        loading:"Logging in",
        success:"Logged in",
        failed:"Failed Login"
    }


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);


    console.log(Auth,status);
    useEffect(()=>{
        if(Auth=='success'||status == 'success'){nav('/home');dispatch(unmountLogin());}
        if(status=='success'||status=='failed')return ()=>{nav(`/home`);dispatch(unmountLogin());}
    },[dispatch,nav,Auth,unmountLogin,status]);


    useEffect(()=>{
        if(state.values)setState(p=>({...p,err:{...loginValidation(p)}}));
        if(status=='success'||status=='failed')return ()=>{nav(`/home`);dispatch(unmountLogin());}
    },[state.values,setState,status,nav,dispatch,unmountLogin]);



    useEffect(()=>{
        if(reload!=refresh)dispatch(unmountLogin());
    },[reload,refresh,unmountLogin,dispatch]);


    const handleChange =(e)=>{
        e.preventDefault();
        setState(s=>({...state,values:{...s.values,[e.target.name]:e.target.value},changed:{...s.changed,[e.target.name]:true}}));
    }


    const handleSubmit = (e)=>{
        e.preventDefault();
        setState({...state,submit:true});
        let data = new FormData(document.querySelector('#loginForm'));
        if(!state.err.status)dispatch(setUser(data));
    }


   
    return (Auth!='success' &&<div className="Login container d-flex flex-column align-items-center justify-content-center">
        <h2 className='display-4 mt-4'>{statusMap[status]}</h2>
        {   ((status=="idle"||status=="loading")&&<form encType="multipart/form-data" id="loginForm" name="lofinF" className = "form w-75 m-1" method="POST" onSubmit={(e)=>{handleSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="setEmail">Email</label>
                    <input id="setEmail" type='email' className="form-control" value={state.values.email}  name="email" onChange={(e)=>handleChange(e)}/>    
                    {((state.submit||state.changed.email) && state.err.email) && <p className='errLine' style={{color:'red'}}>{state.err.email}</p>}  
                </div>
                <div className="form-group">
                    <label htmlFor="setPassword">Password</label>
                    <input id="setPassword" type='password' className="form-control"  name="password" value={state.values.password} onChange={(e)=>handleChange(e)}/>
                    {((state.submit||state.changed.password) && state.err.password) && <p className='errLine' style={{color:'red'}}>{state.err.password}</p>}  
                </div>
                <button className="btn btn-dark btn-block my-3 px-4" type="submit">Submit</button>
            </form>) ||
            (status=="failed" && <div>Error....</div>)
        }
    </div>)||(Auth=='success'||<div>Taking to Home....</div>)
}

export default LoginPage;