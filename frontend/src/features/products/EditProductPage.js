import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import { checkAuth, selectAuthStatus, selectUser } from "../user/userSlice";
import { editProduct, getDetails, selectDetails, selectEdit, selectEditedProduct, selectProductDetails, selectReload, unmountDetails, unmountEdit } from "./productSlice";
import { productUpdateValidation } from "./validation";
export const EditProductPage = ()=>{
    let {pid} = useParams();
    let dispatch = useDispatch();
    let user = useSelector(selectUser);
    let nav = useNavigate();
    let Auth = useSelector(selectAuthStatus);
    let product = useSelector(selectProductDetails);
    let resultProduct = useSelector(selectEditedProduct);
    let getStatus = useSelector(selectDetails);
    let {status,errors} = useSelector(selectEdit);
    let [state,setState] = useState({
        values: null,
         err:{
             name:null,
             category:null,
             price:null,
             desc:null,
             status:false
         },
         changed:{
             name:false,
             category:false,
             price:false,
             desc:false,
         },
         submit:false
     });
    let [imgUp,setImg] = useState(null);
    let [imgFile,setImgFile] = useState(null);
    let reload = useSelector(selectReload);
    let [refresh,setRefresh] = useState(null);


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);


    useEffect(()=>{
        if(Auth=='idle'||Auth=='failed')nav('/login');
    },[dispatch,Auth]);


    useEffect(()=>{
        if(state.values)setState(p=> ({...p,err:{...p.err,...productUpdateValidation(p)}}));
        if(status=='success'||status=='failed')return()=>{nav(`/products/${pid}/details`);dispatch(unmountEdit());}
        console.log(state);
    },[setState,state.values])


    useEffect(()=>{
        if(!state.values && getStatus.status=='idle')dispatch(getDetails(pid));
        if(!state.values && product){
            const {pid:pi ,img,...pro}=product;
            setState(p=>({...p,values:{...p.values,...pro}}));
            setImg(im=>img);
        }
        if(getStatus.status=='success'){
            return ()=>dispatch(unmountDetails());
        }
        if(status=='success'||status=='failed')return()=>{nav(`/products/${pid}/details`);dispatch(unmountEdit());}
    },[state,setState,product,setImg,getStatus.status,status]);


    useEffect(()=>{
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
        setState({...state,values:{...state.values,[e.target.name]:e.target.value},changed:{...state.changed,[e.target.name]:true}});
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setState({...state,submit:true});
        let data = new FormData();
        data.set("pid",pid.toString());
        Object.entries(state).forEach(([k,v])=>data.append(k,v));
        if(imgFile)data.set("productImg",imgFile,imgFile.name);
        else data.delete('productImg');
        for (var pair of data.entries()) {
            console.log(pair[0],pair[1]);
        }
        if(!state.err.status)dispatch(editProduct(data));
    }
    return (Auth=='success' && <div className='EditProductPage container'>
        <h2>{statusMap[status]} Product:</h2>
        {
            (state.values && status=="idle" &&
            <form encType="multipart/form-data" id="editProductForm" className = "form m-1" method="POST" onSubmit={(e)=>{handleSubmit(e)}}>
                <div className="form-group">
                    <label htmlFor="editProductName">Name</label>
                    <input id="editProductName" className="form-control" value={state.values.name}  name="name" onChange={(e)=>handleChange(e)}/>
                    {((state.submit||state.changed.name) && state.err.name) && <p className='errLine' style={{color:'red'}}>{state.err.name}</p>}                
                </div>
                <div className="form-group">
                    <label htmlFor="editProductCategory">Category</label>
                    <input id="editProductCategory" className="form-control"  name="category" value={state.values.category} onChange={(e)=>handleChange(e)}/>
                    {((state.submit||state.changed.category) && state.err.category) && <p className='errLine' style={{color:'red'}}>{state.err.price}</p>}                
                </div>
                <div className="form-group">
                    <label htmlFor="editProductPrice">Price</label>
                    <input id="editProductPrice" type="number" className="form-control"  name="price" value={state.values.price} onChange={(e)=>handleChange(e)}/>
                    {((state.submit||state.changed.price) && state.err.pricee) && <p className='errLine' style={{color:'red'}}>{state.err.price}</p>}                
                </div>
                <div className="form-group">
                    <label htmlFor="editProductDesc">Description</label>
                    <input id="editProductDesc" className="form-control"  name="desc" value={state.values.desc} onChange={(e)=>handleChange(e)}/>
                    {((state.submit||state.changed.desc) && state.err.desc) && <p className='errLine' style={{color:'red'}}>{state.err.desc}</p>}                
                </div>
                <div className="form-group">
                    <label className="m-1" htmlFor="img-upload"><img name="preview" className="img-responsive img-thumbnail" src={imgUp} width="150px"/>
                    Click on the image to set new image</label>
                </div>
                <input id="img-upload" name="productImg" type="file" style={{display:'none'}} onChange={(e)=>{setImgFile(e.target.files[0]);setImg(URL.createObjectURL(e.target.files[0]))}}/>
                <button className="btn btn-dark btn-block" type="submit" disabled={status=='pending'||state.err.status}>Submit</button>
            </form>) ||
            (((getStatus.status=='loading' && !state )|| status=='loading') && <div>Loading...</div>)||
            (status=='failed' || getStatus.status=="failed" && <div>Error.....</div>)


        }
    </div>)||(Auth=='pending'&&<div>Waiting...</div>);
}