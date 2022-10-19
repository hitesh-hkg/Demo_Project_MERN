import axios from "axios";


export const fetchProducts = () => {
    return axios.get("http://localhost:5000/products");
};
export const fetchSample = () => {
    console.log("iutgl");
    return axios.get("http://localhost:5000/sample");
};
export const searchProducts = (term) => {
    return axios.get(`http://localhost:5000/products/${term}`);
};
export const fetchProductDetailsById = (pid) => {
    return axios.get(`http://localhost:5000/products/${pid}/details`);
};
export const createProduct = (data,auth) => {
    return axios.post(`http://localhost:5000/products`,data,auth);
};
export const updateProduct = (data,auth) => {
    return axios.put(`http://localhost:5000/products`,data,auth);
};
export const deleteProduct = (pid,auth) => {
    return axios.delete(`http://localhost:5000/products/${pid}`,auth);
};