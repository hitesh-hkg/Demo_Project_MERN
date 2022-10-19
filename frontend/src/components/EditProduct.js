import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { selectAuthStatus } from "../features/user/userSlice";
const EditProduct = ({pid}) => {
    let Auth = useSelector(selectAuthStatus);
    const nav = useNavigate();
    const url = `/products/${pid}/edit`;
    const handleClick = ()=>{
        nav(url);
    }
    return (Auth=='success' && <button type="button" className="btn btn-success h-full w-full flex-fill m-0 p-1" onClick={handleClick}>Edit Product</button>)||(<></>)
}

export default EditProduct;