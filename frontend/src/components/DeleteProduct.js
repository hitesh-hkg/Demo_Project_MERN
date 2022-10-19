import { useDispatch, useSelector } from "react-redux";
import { selectReload, setReload } from "../features/products/productSlice";
import { deleteProduct } from "../features/products/productApi";
import { useEffect, useState } from "react";
import { checkAuth, selectAuth, selectAuthStatus, selectUser } from "../features/user/userSlice";
import { useNavigate } from "react-router";


const DeleteProduct = ({pid}) => {
    let Auth = useSelector(selectAuthStatus);
    let user = useSelector(selectUser);
    let config = useSelector(selectAuth);
    let dispatch = useDispatch();
    let nav = useNavigate();
    let [status,setStatus] = useState('idle');
    let statusMap = {
        idle:"Delete",
        loading:"Deleting",
        success:"Deleted",
        failed:"Try Again"
    };
    let reload = useSelector(selectReload);
    let [refresh,setRefresh] = useState(null);


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);
    useEffect(()=>{
        if(reload!=refresh){setRefresh(reload);setStatus('idle')};
    },[reload,refresh,setStatus,setRefresh]);
   
    useEffect(()=>{
        if(status=='success')dispatch(setReload());
    },[status,dispatch]);


    const handleDelete = (e)=>{
        setStatus('loading');
        if(Auth=='idle'||Auth=='failed'||(!config))nav('/login');
        else {
            deleteProduct(pid,config).then((res)=>{
            if(res.status >=200 && res.status<300) setStatus('success');
        }).catch((e)=>{setStatus('failed')});
    }
    }
    return (Auth=='success' && <button type="button" className="btn btn-danger h-full w-full flex-fill m-0 p-1" disabled={status=='loading' || status == 'success'} onClick={(e)=>handleDelete(e)}>{statusMap[status]}</button>)||(<></>)
}

export default DeleteProduct;