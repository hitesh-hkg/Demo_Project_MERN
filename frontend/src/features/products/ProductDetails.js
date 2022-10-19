import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import  EditProduct from "../../components/EditProduct";
import  DeleteProduct  from "../../components/DeleteProduct";
import { getDetails, selectDetails, selectProductDetails, selectReload, unmountDetails } from "./productSlice";


export const ProductDetails = (props) => {
    const {pid} = useParams();
    const dispatch = useDispatch();
    const product = useSelector(selectProductDetails);
    const {status,errors} = useSelector(selectDetails);
    let reload = useSelector(selectReload);
    let [refresh,setRefresh] = useState(null);
    console.log(product);
    useEffect(()=>{
        refresh = reload;
    },[]);


    useEffect(()=>{
        if(status == 'idle' )dispatch(getDetails(pid));
        if(status=='success'){
            return ()=>dispatch(unmountDetails());
        }
    },[dispatch,status]);


    useEffect(()=>{
        if(reload!=refresh)dispatch(unmountDetails());
    },[reload,refresh]);
   
    console.log(status,errors);
    return <>{
            (status=='loading' && <div>Loading....</div>)||
            (status=='success' && (product &&
            <div className="ProductPage container my-auto">
                <div className = 'd-flex flex-column my-auto row-cols-1 align-items-center'>
                    <div className='col'>
                        <div className='row row-cols-1 row-cols-lg-2'>
                            <div className='col'><img src={`http://localhost:5000/products/${product.pid}/image`} alt={`${product.name}`} width="300px"/></div>
                            <div className='col my-auto align-items-center'>
                                <div><h3>Name:{product.name}</h3></div>
                                <div><h5>Category:{product.category}</h5></div>
                                <div><h4>Price:{product.price}</h4></div>
                                <div><h6>{product.desc}</h6></div>
                            </div>
                        </div>
                    </div>
                    <div className='row row-cols-1 row-cols-lg-2'>
                        <div className='d-inline-flex'><EditProduct pid={product.pid}/></div>
                        <div className='d-inline-flex'><DeleteProduct pid={product.pid}/></div>
                    </div>
                </div>
            </div>) || <div>No Such Product found<Link to='/Home'><button type='button' className='btn btn-sm btn-dark'>Go to Home</button></Link></div>) ||
            (status=='failed' && <div>Error....</div>)
    }</>
}