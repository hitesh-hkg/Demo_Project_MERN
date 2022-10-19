import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import ProductCard from "../../components/ProductCard";
import { checkAuth, getAuth, selectAuthStatus, selectUser } from "../user/userSlice";
import { addProduct, selectAddedProduct, selectAddProduct, selectReload, unmountAdd } from './productSlice';
import { productCreateValidation } from "./validation";


const AddProduct = () => {
    let nav=useNavigate();
    let dispatch = useDispatch();
    let Auth = useSelector(selectAuthStatus);
    let user = useSelector(selectUser);
    let product = useSelector(selectAddedProduct);
    let {status,error} = useSelector(selectAddProduct);
    let reload = useSelector(selectReload);
    let [refresh,setRefresh] = useState(null);
    let statusMap = {
        idle:"Add",
        loading:"Adding",
        success:"Added",
        failed:"Failed Adding"
    }
    let [state,setState] = useState({
       values: {
            name : '',
            category : '',
            price : '',
            desc : '' 
        },
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
    let [imgUp,setImg] = useState(process.env.PUBLIC_URL+"/logo192.png");
    let [imgFile,setImgFile] = useState(null);


    useEffect(()=>{
        refresh = reload;
        if(Auth=='idle'||!user)dispatch(checkAuth());
    },[]);


    useEffect(()=>{
        if(Auth=='idle' || Auth=='failed')nav('/login');
    },[dispatch,Auth,nav]);


    useEffect(()=>{
        setState(e=>({...e,err:productCreateValidation(e)}));
        if(status == 'success'||status=='failed')return () => {nav(`/products/${product.pid}/details`);dispatch(unmountAdd());}
    },[setState,productCreateValidation,state.values])


    useEffect(()=>{
        if(status == 'success'||status=='failed')return () => {nav(`/products/${product.pid}/details`);dispatch(unmountAdd());}
        else return ()=>console.log('unmount');
    },[status,dispatch]);


    useEffect(()=>{
        if(reload!=refresh)dispatch(unmountAdd());
    },[reload,refresh]);
    const handleChange =(e)=>{
        e.preventDefault();
        console.log(e);
        setState(s=>({...state,values:{...state.values,[e.target.name]:e.target.value},changed:{...state.changed,[e.target.name]:true}}));
        console.log(state);
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        let data = new FormData(document.querySelector('#addProductForm'));
        if(imgFile)data.set("productImg",imgFile,imgFile.name);
        else data.delete('productImg');
        for (var pair of data.entries()) {
            console.log(pair[0],pair[1]);
        }
        setState(s=>({...state,submit:true}));
        if(!state.err.status)dispatch(addProduct(data));
    }
    return (Auth=='success' && <div className='AddProduct container justify-content-center align-items-center d-flex flex-column'>
                    <h2 class='display-4 mt-4'>{statusMap[status]} Product:</h2>
                    {((status=="idle"||status=="loading")&&<form encType="multipart/form-data" id="addProductForm" className = "form w-75" method="POST" onSubmit={(e)=>{handleSubmit(e)}}>
                        <div className="form-group my-1">
                            <label htmlFor="addProductName">Name</label>
                            <input id="addProductName" className="form-control" value={state.values.name}  name="name" onChange={(e)=>handleChange(e)}/>    
                            {((state.submit||state.changed.name) && state.err.name) && <p className='errLine' style={{color:'red'}}>{state.err.name}</p>}                
                        </div>
                        <div className="form-group my-1">
                            <label htmlFor="addProductCategory">Category</label>
                            <input id="addProductCategory" className="form-control"  name="category" value={state.values.successcategory} onChange={(e)=>handleChange(e)}/>
                            {((state.submit||state.changed.category) && state.err.category) && <p className='errLine' style={{color:'red'}}>{state.err.category}</p>}  
                        </div>
                        <div className="form-group my-1">
                            <label htmlFor="addProductPrice">Price</label>
                            <input id="addProductPrice" type="number" className="form-control"  name="price" value={state.values.price} onChange={(e)=>handleChange(e)}/>
                            {((state.submit||state.changed.price) && state.err.price) && <p className='errLine' style={{color:'red'}}>{state.err.price}</p>}  
                        </div>
                        <div className="form-group my-1">
                            <label htmlFor="addProductDesc">Description</label>
                            <input id="addProductDesc" className="form-control"  name="desc" value={state.values.desc} onChange={(e)=>handleChange(e)}/>
                            {((state.submit||state.changed.desc) && state.err.desc) && <p className='errLine' style={{color:'red'}}>{state.err.desc}</p>}  
                        </div>
                        <div className="form-group my-1">
                            <label className="m-1" htmlFor="img-upload"><img name="preview" className="img-responsive img-thumbnail" src={imgUp} width="150px"/>
                            Click on the image to set new image</label>
                        </div>
                        <input id="img-upload" name="productImg" type="file" style={{display:'none'}} onChange={(e)=>{setImgFile(e.target.files[0]);setImg(URL.createObjectURL(e.target.files[0]))}}/>
                        <button className="btn btn-dark px-4 my-3" type="submit" disabled = {status=='pending'||state.err.status}>Submit</button>
                        {status=="failed" && <p className='errLine'>{error}</p>  }
                    </form>)}
            </div> )||
            (Auth=='loading' && <div>Waiting....</div>)
}

export default AddProduct;