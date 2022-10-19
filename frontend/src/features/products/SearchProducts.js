import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router";
import ProductCard from "../../components/ProductCard";
import {  selectSearchProducts, getSearchResults, selectSearchHome, unmountSearch, selectReload } from "./productSlice";


export const SearchProducts = ()=>{
    const {term} = useParams()
    const dispatch = useDispatch();
    const products = useSelector(selectSearchProducts);
    const {status,error} = useSelector(selectSearchHome);
    let reload = useSelector(selectReload);
    let [refresh,setRefresh] = useState(null);
    useEffect(()=>{
        refresh = reload;
    },[]);


    useEffect(()=>{
        if(status=='idle')
        {
            dispatch(getSearchResults(term));
        }
        if(status=='success') {
            return ()=>dispatch(unmountSearch());
        }
    },[dispatch,status]);


    useEffect(()=>{
        if(reload!=refresh)dispatch(unmountSearch());
    },[reload,refresh]);


    return <div className='container'>
        {
            (status=='loading' && <div>Loading....</div>)||
            (status=='success' && products && <div class='container row row-cols-1 row-cols-md-2 row-cols-lg-3 d-flex'>{products.map((product,id)=><div className='col d-flex'><ProductCard product={product} key={product.pid}/></div>)}</div>)||
            (status=='failed' && <div>Error....</div>)
        }
    </div>
}