import { useDispatch, useSelector } from "react-redux";
import { checkAuth, logoutUser, selectUser, selectUserReload, setUserReload } from "../features/user/userSlice";
import { useEffect, useState } from "react";
import { selectAuthStatus } from "../features/user/userSlice";


const Logout = () => {
    let Auth = useSelector(selectAuthStatus);
    let dispatch = useDispatch();
    let user = useSelector(selectUser);
    let reload = useSelector(selectUserReload);
    let [status,setStatus]=useState('idle');
    let [refresh,setRefresh] = useState(null);


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);


    useEffect(()=>{
        if(reload!=refresh){setRefresh(reload);setStatus('idle')};
    },[reload,refresh,setRefresh]);


    const handleLogout = (e)=>{
        setStatus('loading');
        dispatch(logoutUser());
    }
    return (Auth=='success' && <button type="button" className="btn btn-danger h-full w-full flex-fill m-0 p-1" disabled={Auth!='success'} onClick={(e)=>handleLogout(e)}>logout</button>)||(<></>);
}

export default Logout;