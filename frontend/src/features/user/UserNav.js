import {  useSelector } from "react-redux"
import {  NavLink } from "react-router-dom";
import { selectUser } from "./userSlice";


const UserNav = () => {
    const user = useSelector(selectUser);
    return (user && <NavLink to='/user/details'>
        <button className='btn btn-warning btn-sm'> {user.name}</button>
    </NavLink>)||((!user) && <div>No User</div>)
}
export default UserNav;