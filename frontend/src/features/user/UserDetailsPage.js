import { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {  useNavigate } from "react-router-dom";
import  EditUser from "../../components/EditUser";
import  DeleteUser  from "../../components/DeleteUser";
import { checkAuth,  selectAuth,  selectAuthStatus, selectUser, selectUserReload } from "./userSlice";
import axios from "axios";
import { fetchImg } from "./userApi";


export const UserDetailsPage = () => {
    const dispatch = useDispatch();
    const nav = useNavigate();
    const Auth = useSelector(selectAuthStatus,shallowEqual);
    const [userImg,setImg] = useState(null);
    const config = useSelector(selectAuth);
    const user = useSelector(selectUser);
    let reload = useSelector(selectUserReload);
    let refresh = useRef(null);
    useEffect(()=>{
        refresh.current = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);
    console.log(Auth);
    useEffect(async()=>{
        if(Auth=='idle'||Auth=='failed')nav('/login');
        if(Auth=='success' && config && !userImg){
            fetchImg({...config,'responseType':'arraybuffer'}).then((res)=>{
            console.log(res);
                setImg(`data:${
                    res.headers["content-type"]
                  };base64,${Buffer(res.data, "binary").toString("base64")}`
                 );
            }).catch((e)=>setImg(null));
        }
    },[Auth,nav,userImg,setImg,fetchImg,config]);
    console.log(user,Auth);


    return (Auth=='success' && user && <div className='UserDetails container mt-4'>
                <img src={userImg} alt={`${user.name}`} width="300px"/>
                <h3>Name:{user.name}</h3>
                <h5>Role:{user.role}</h5>
                <h4>Phone:{user.phone}</h4>
                <h4>Email:{user.email}</h4>
                <EditUser/>
                <DeleteUser/>
    </div> )|| (
        Auth=='loading' && <div>Waiting...</div>
    )
}

export default UserDetailsPage;