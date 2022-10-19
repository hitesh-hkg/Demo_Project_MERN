import { useRef } from 'react';
import { useDispatch } from 'react-redux';
import {useNavigate} from 'react-router-dom';
import { unmountSearch } from '../features/products/productSlice';


const SearchBar = () => {
    let searchRef = useRef();
    let dispatch = useDispatch();
    const nav = useNavigate();
    const handleSearch = (e) => {
        e.preventDefault();
        dispatch(unmountSearch());
        nav(`/products/${searchRef.current.value}`);
    }
    return <form className="SearchBar form-inline" id="searchForm" onSubmit={(e)=>handleSearch(e)}>
            <div className='input-group'>
                <input type="search" className="form-control b-0" ref={searchRef} placeholder="Enter search query"/>
                <button type="submit" className="btn btn-outline btn-warning" onClick={(e)=>handleSearch(e)}>search</button>
            </div>
        </form>;
};

export default SearchBar;