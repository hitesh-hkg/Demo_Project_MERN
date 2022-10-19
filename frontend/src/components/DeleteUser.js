import { useDispatch, useSelector } from "react-redux";
import { deleteUser } from "../features/user/userApi";
import { useEffect, useState } from "react";
import { checkAuth, logoutUser, selectAuth, selectAuthStatus,selectUser,selectUserReload,setUserReload, unmountDelete } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";


const DeleteUser = ({pid}) => {
    let Auth = useSelector(selectAuthStatus);
    let dispatch = useDispatch();
    let nav = useNavigate();
    let user = useSelector(selectUser);
    let config = useSelector(selectAuth);
    let [status,setStatus] = useState('idle');
    let statusMap = {
        idle:"Delete",
        loading:"Deleting",
        success:"Deleted",
        failed:"Try Again"
    };
    let reload = useSelector(selectUserReload);
    let [refresh,setRefresh] = useState(null);


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);


    useEffect(()=>{
        if(reload!=refresh){setRefresh(reload);setStatus('idle')};
        if(status=='success')return ()=>dispatch(unmountDelete());
    },[reload,refresh,setStatus,setRefresh,status,dispatch,unmountDelete]);
   
    useEffect(()=>{
        if(status=='success'){dispatch(logoutUser());nav('/home');}
        if(status=='success')return ()=>dispatch(unmountDelete());
    },[status,dispatch,logoutUser,nav,unmountDelete]);


    const handleDelete = (e)=>{
        setStatus('loading');
        deleteUser(config).then((res)=>{
            if(res.status >=200 && res.status<300) setStatus('success');
        }).catch((e)=>{setStatus('failed')});
    }
    return (Auth=='success' && <button type="button" className="btn btn-danger h-full w-full flex-fill m-0 p-1" disabled={status=='loading' || status == 'success' || Auth!='success'} onClick={(e)=>handleDelete(e)}>{statusMap[status]}</button>)||(<></>);
}

export default DeleteUser;