import React from 'react';
import { Counter } from './features/counter/Counter';
import './App.css';
import { Home } from './features/products/Home';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { ProductDetails } from './features/products/ProductDetails';
import { Navbar } from './components/Navbar';
import { SearchProducts } from './features/products/SearchProducts';
import AddProduct from './features/products/AddProduct';
import { EditProductPage } from './features/products/EditProductPage';
import LoginPage from './features/user/LoginPage';
import SignUpPage from './features/user/SignUpPage';
import EditUserPage from './features/user/EditUserPage';
import UserDetailsPage from './features/user/UserDetailsPage';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/counter" element={<Counter/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/home" element={<Home/>}/>
          <Route path="/login" element={<LoginPage/>}/>
          <Route path="/signup" element={<SignUpPage/>}/>
          <Route path="/user/details" element={<UserDetailsPage/>}/>
          <Route path="/user/edit" element={<EditUserPage/>}/>
          <Route path="/products/:term" element={<SearchProducts/>}/>
          <Route path="/products/:pid/details" element={<ProductDetails/>}/>
          <Route path="/add/products" element={<AddProduct/>}/>
          <Route path="/products/:pid/edit" element={<EditProductPage/>}/>
        </Routes>
      </Router>
    </div>
  );
}


export default App;

