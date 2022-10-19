import { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import UserNav from "../features/user/UserNav";
import { selectAuthStatus,selectUser } from "../features/user/userSlice";
import Logout from "./Logout";
import SearchBar from "./SearchBar";
export const Navbar = ()=>{
    let Auth = useSelector(selectAuthStatus);
    let user = useSelector(selectUser);
    return <nav class="Navbar navbar navbar-expand-lg bg-dark align-items-center navbar-dark">
    <div class="container-fluid align-items-center">
      <NavLink to='/home' className='navbar-brand'><span className='navbar-brand'>ProdPRO</span></NavLink>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02" aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse align-items-center" id="navbarTogglerDemo02">
        <ul class="navbar-nav align-items-center me-auto mb-2 mb-lg-0 w-100 text-warning">
            <li className="nav-item order-4 w-100 w-lg-50 d-inline mx-auto me-auto order-lg-0 center"><SearchBar/></li>
            <li className="nav-item order-0 order-lg-1"><NavLink to="/home" className="nav-link">Home</NavLink></li>
            {Auth=='success' && user.role=='Admin' &&<li className="nav-item order-1 order-lg-2"><NavLink to="/add/products" className="nav-link">Add&nbsp;Products</NavLink></li>}
            <li className="nav-item order-2 order-lg-3">{Auth=='success'?<UserNav/>:<NavLink to="/login" className="nav-link">Login</NavLink>}</li>
            <li className="nav-item order-3 order-lg-4">{Auth=='success'?<Logout/>:<NavLink to="/signup" className="nav-link">Signup</NavLink>}</li>
        </ul>
      </div>
    </div>
  </nav>
}