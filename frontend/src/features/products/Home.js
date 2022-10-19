import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import ProductCard from "../../components/ProductCard";
import { checkAuth, selectAuthStatus } from "../user/userSlice";
import { selectSampleProducts, selectHome, getSample, unmountHome, selectReload } from "./productSlice";


export const Home = ()=>{
    const dispatch = useDispatch();
    const products = useSelector(selectSampleProducts);
    let Auth = useSelector(selectAuthStatus);
    const reload = useSelector(selectReload);
    const {status,error} = useSelector(selectHome);
    let [refresh,setRefresh] = useState(null);


    useEffect(()=>{
        refresh = reload;
        dispatch(checkAuth());
    },[]);


    useEffect(()=>{
        if(status=='idle')
        {
            dispatch(getSample());
        }
        if(status == 'success') return () => dispatch(unmountHome());
    },[dispatch,status]);


    useEffect(()=>{
        if(reload!=refresh)dispatch(unmountHome());
    },[reload,refresh]);


   
    return <div className="Home container">
        {
            (status=='loading' && <div>Loading....</div>)||
            (status=='success' && products && <div class='container row row-cols-1 row-cols-md-2 row-cols-lg-3 d-flex'>{products.map((product,id)=><div className='col d-flex'><ProductCard product={product} key={product.pid}/></div>)}</div>)||
            (status=='failed' && <div>Error....</div>)
        }
    </div>
}