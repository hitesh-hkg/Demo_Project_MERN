import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"
import { selectAuthStatus } from "../features/user/userSlice";
const EditUser = () => {
    let Auth = useSelector(selectAuthStatus);
    const nav = useNavigate();
    const url = `/user/edit`;
    const handleClick = ()=>{
        nav(url);
    }
    return (Auth=='success'&&<button type="button" className="btn btn-success h-full w-full flex-fill m-0 p-1" onClick={handleClick}>Edit User</button>)||(<></>)
}

export default EditUser;