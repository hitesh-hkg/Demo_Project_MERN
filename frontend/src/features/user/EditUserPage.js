import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchImg } from "./userApi";
import { selectAuthStatus, selectUser, selectEditUser, selectEditedUser, selectUserReload ,checkAuth, unmountEdit, editUser, selectAuth} from "./userSlice";
import { userUpdateValidation } from "./validation";


export const EditUserPage = ()=>{
    let dispatch = useDispatch();
    let nav = useNavigate();
    let Auth = useSelector(selectAuthStatus);
    let config = useSelector(selectAuth);
    let resultUser = useSelector(selectEditedUser);
    let user = useSelector(selectUser);
    let {status,errors} = useSelector(selectEditUser);
    let [state,setState] = useState({
        values:null,
        err:{
            name:null,
            password:null,
            phone:null,
            status:false
        },
        changed:{
            name:false,
            password:false,
            phone:false
        },
        submit:false
    });
    let [imgUp,setImg] = useState(null);
    let [imgFile,setImgFile] = useState(null);
    let reload = useSelector(selectUserReload);
    let [refresh,setRefresh] = useState(null);


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);


    useEffect(()=>{
        if(Auth=='idle'||Auth=='failed')nav('/login');
    },[dispatch,checkAuth]);


    useEffect(()=>{
        if(state.values)setState(p=>({...p,err:{...userUpdateValidation(p)}}));
        if(status=='success'||status=='failed')return ()=>{dispatch(unmountEdit());nav(`/user/details`);}
    },[state.values,setState]);


    useEffect(()=>{
        if(user && Auth=='success' && !state.values){
            setState({...state,values:{name:user.name,phone:user.phone,password:''}});
            fetchImg({...config,'responseType':'arraybuffer'}).then((res)=>{
                    setImg(`data:${
                        res.headers["content-type"]
                      };base64,${Buffer(res.data, "binary").toString("base64")}`
                     );
                }).catch((e)=>setImg(null));
        }
        if(status=='success')return()=>{dispatch(unmountEdit());nav(`/user/details`);}
    },[state,user,Auth,setState,setImg,status]);


    useEffect(()=>{
        console.log('here');
        if(reload!=refresh)dispatch(unmountEdit());
    },[reload,refresh]);


    let statusMap = {
        idle:"Edit",
        loading:"Updating",
        success:"Updated",
        failed:"Failed Updating"
    }


    const handleChange =(e)=>{
        e.preventDefault();
        setState({...state,values:{...state.values,[e.target.name]:e.target.value},changed:{...state.changed,[e.target.name]:true}})
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setState({...state,submit:true});
        let data = new FormData(document.querySelector('#editUserForm'));
        if(imgFile)data.set("userImg",imgFile,imgFile.name);
        else data.delete('userImg');
        if((!state.values.name||state.values.name=='') && !state.changed.name)data.delete('name');
        if((!state.values.password||state.values.password=='') && !state.changed.password)data.delete('password');
        if((!state.values.phone||state.values.phone=='') && !state.changed.phone)data.delete('phone');
        for (var pair of data.entries()) {
            console.log(pair[0],pair[1]);
        }
        if(!state.err.status)dispatch(editUser(data));
    }
    return (Auth=='success' && state.values &&<div className='EditUserPage container'>
        <h2>{statusMap[status]}:</h2>
        {   ((status=="idle"||status=="loading")&&<form encType="multipart/form-data" id="editUserForm" className = "EditProduct form-group m-1" method="POST" onSubmit={(e)=>{handleSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="userName">Name</label>
                    <input id="userName" className="form-control" value={state.values.name}  name="name" onChange={(e)=>handleChange(e)}/>  
                    {((state.submit||state.changed.name) && state.err.name) && <p className='errLine' style={{color:'red'}}>{state.err.name}</p>}  
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
    </div>)||(
        Auth=='loading' && <div>Waiting....</div>
    )
}

export default EditUserPage;