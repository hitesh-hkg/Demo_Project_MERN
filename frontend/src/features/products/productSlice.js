import { createAction, createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { fetchProducts, fetchSample, fetchProductDetailsById, searchProducts, createProduct, updateProduct, deleteProduct } from "./productApi";


export const getProducts = createAsyncThunk(
    'products/getProducts',
    async(_,{rejectWithValue})=>{
        try{
            let res = await fetchProducts();
            console.log(res.data);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
);


export const updateDB = createAction('products/lastUpdate');


export const getSample = createAsyncThunk(
    'products/getSample',
    async(_,{rejectWithValue})=>{
        try{
            let res = await fetchSample();
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data);
        }
    }
);


export const getDetails = createAsyncThunk(
    'products/getDetails',
    async(pid,{rejectWithValue})=>{
        try{
            let res = await fetchProductDetailsById(pid);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data);
        }  
    }
);


export const getSearchResults = createAsyncThunk(
    'products/getSearchResults',
    async(term,{rejectWithValue})=>{
        try{
            let res = await searchProducts(term);
            return res.data;    
        }catch(e){
            return rejectWithValue(e.response.data);
        }
    }
);


export const addProduct = createAsyncThunk(
    'products/addProduct',
    async(data,{getState,rejectWithValue})=>{
        try{
            let res = await createProduct(data,getState().user.auth);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data);
        }
    }
);


export const editProduct = createAsyncThunk(
    'products/editProduct',
    async(data,{getState,rejectWithValue})=>{
        try{
            let res = await updateProduct(data,getState().user.auth);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data)
        }
    }
);


export const removeProduct = createAsyncThunk(
    'products/removeProduct',
    async(pid,{getState,rejectWithValue})=>{
        try{
            let res = await deleteProduct(pid,getState().user.auth);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data);
        }
    }
);


export const productSlice = createSlice({
    name:"products",
    initialState:{
        products : null,
        sample: null,
        productDetails:null,
        searchProducts:null,
        addedProduct:null,
        editedProduct:null,
        reload:false,
        lastUpdate:Date.now(),
        home:{
            status:'idle',
            errors:null
        },
        details:{
            status:'idle',
            errors:null
        },
        search:{
            status:'idle',
            errors:null
        },
        addProduct:{
            status:'idle',
            errors:null
        },
        edit:{
            status:'idle',
            errors:null
        },
        delete:{
            status:'idle',
            errors:null
        },
        fetchAll:false
    },
    reducers : {
        unmountAdd: state =>{
            state.addProduct={
                status:"idle",
                errors:null
            }
            state.addedProduct=null;
        },
        unmountDelete: state =>{
            state.delete={
                status:"idle",
                errors:null
            };
        },
        unmountEdit: state =>{
            state.details={
                status:"idle",
                errors:null
            }
            state.productDetails=null;
            state.edit={
                status:"idle",
                errors:null
            }
            state.editedProduct=null;
        },
        unmountHome: state =>{
            state.home={
                status:"idle",
                errors:null
            }
            state.sample=null;
        },
        unmountDetails: state =>{
            state.details={
                status:"idle",
                errors:null
            }
            state.productDetails=null;
        },
        unmountSearch: state =>{
            state.search={
                status:"idle",
                errors:null
            }
            state.searchProducts=null;
        },
        setReload: state => {
            state.reload = !state.reload;
        }
    },
    extraReducers: builder =>{
        builder
        .addCase(getProducts.pending,(state)=>{
            state.home.status = 'loading';
            state.home.errors = null;
        })
        .addCase(getProducts.fulfilled,(state,action)=>{
            state.home.status = 'success';
            state.products = action.payload.data;
            state.home.errors = null;
        })
        .addCase(getProducts.rejected,(state,action)=>{
            state.home.status = 'failed';
            state.home.errors = action.error;
        })
        .addCase(getSample.pending,(state)=>{
            state.home.status = 'loading';
            state.home.errors = null;
        })
        .addCase(getSample.fulfilled,(state,action)=>{
            state.home.status = 'success';
            state.sample = action.payload.data;
            state.home.errors = null;
        })
        .addCase(getSample.rejected,(state,action)=>{
            state.home.status = 'failed';
            state.home.errors = action.error;
        })
        .addCase(getDetails.pending,(state)=>{
            state.details.status = 'loading';
            state.details.errors = null;
        })
        .addCase(getDetails.fulfilled,(state,action)=>{
            state.details.status = 'success';
            state.productDetails = action.payload.data;
            state.details.errors = null;
        })
        .addCase(getDetails.rejected,(state,action)=>{
            state.details.status = 'failed';
            state.details.errors = action.error;
        })
        .addCase(getSearchResults.pending,(state)=>{
            state.search.status = 'loading';
            state.search.errors = null;
        })
        .addCase(getSearchResults.fulfilled,(state,action)=>{
            state.search.status = 'success';
            state.searchProducts = action.payload.data;
            state.search.errors = null;
        })
        .addCase(getSearchResults.rejected,(state,action)=>{
            state.search.status = 'failed';
            state.search.errors = action.error;
        })
        .addCase(addProduct.pending,(state)=>{
            state.addProduct.status = 'loading';
            state.addProduct.errors = null;
        })
        .addCase(addProduct.fulfilled,(state,action)=>{
            state.addProduct.status = 'success';
            state.addedProduct = action.payload.product;
            state.addProduct.errors = null;
            state.reload = !state.reload;
            state.lastUpdate = Date.now();
        })
        .addCase(addProduct.rejected,(state,action)=>{
            state.addProduct.status = 'failed';
            state.addProduct.errors = action.error;
        })
        .addCase(editProduct.pending,(state)=>{
            state.edit.status = 'loading';
            state.edit.errors = null;
        })
        .addCase(editProduct.fulfilled,(state,action)=>{
            state.edit.status = 'success';
            state.editedProduct = action.payload.product;
            state.edit.errors = null;
            state.reload = !state.reload;
            state.lastUpdate = Date.now();
        })
        .addCase(editProduct.rejected,(state,action)=>{
            state.edit.status = 'failed';
            state.edit.errors = action.error;
        })
        .addCase(removeProduct.pending,(state,action)=>{
            state.delete.status = 'loading';
            state.delete.errors = null;
        })
        .addCase(removeProduct.fulfilled,(state,action)=>{
            state.delete.status = 'success';
            state.delete.errors = null;
            state.reload = !state.reload;
            state.lastUpdate = Date.now();
        })
        .addCase(removeProduct.rejected,(state,action)=>{
            state.delete.status = 'failed';
            state.delete.errors = action.error;
        })
        .addCase(updateDB,(state,action)=>{
            state.lastUpdate=Date.now();
        })
    }
});

export const {unmountAdd,unmountDelete,unmountDetails,unmountEdit,unmountHome,unmountSearch,setReload} = productSlice.actions;
export const selectAllProducts = (state) => state.products.products;
export const selectHome = (state) => state.products.home;
export const selectSampleProducts = (state) => state.products.sample;
export const selectDetails = (state) => state.products.details;
export const selectProductDetails = (state) => state.products.productDetails;
export const selectSearchHome = (state) => state.products.search;
export const selectSearchProducts = (state) => state.products.searchProducts;
export const selectAddProduct = (state) => state.products.addProduct;
export const selectAddedProduct = (state) => state.products.addedProduct;
export const selectEdit = (state) => state.products.edit;
export const selectEditedProduct = (state) => state.products.editedProduct;
export const selectDelete = (state) => state.products.delete;
export const selectReload = (state) => state.products.reload;

export default productSlice.reducer;