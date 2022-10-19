import axios from "axios";


export const fetchUserDetails = (auth) => {
    return axios.get(`http://localhost:5000/user/details`,auth);
};
export const signup = (data) => {
    return axios.post(`http://localhost:5000/signup`,data);
};
export const login = (data) => {
    return axios.post(`http://localhost:5000/login`,data);
};
export const updateUser = (data,auth) => {
    return axios.put(`http://localhost:5000/user`,data,auth);
};
export const deleteUser = (auth) => {
    console.log(auth);
    return axios.delete(`http://localhost:5000/user`,auth);
};
export const isAuth = (auth) => {
    return axios.get('http://localhost:5000/auth',auth)
}
export const fetchImg = (auth) => {
    return axios.get('http://localhost:5000/user/image',auth);
}