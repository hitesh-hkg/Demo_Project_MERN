import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchUserDetails, signup , login , updateUser, deleteUser, isAuth } from "./userApi";


export const updateDB = createAction('products/lastUpdate');


export const checkAuth = createAsyncThunk(
    'user/checkAuth',
    async(_,{rejectWithValue})=>{
        try{
            let user = JSON.parse(localStorage.getItem('user'));
            let auth = {headers:{'x-access-token':user.accessToken}};
            let res = await isAuth(auth);
            return {user:user,auth:auth};
        }catch(e){
            return rejectWithValue({user:null,auth:null});
        }
    }
);


export const getUserDetails = createAsyncThunk(
    'user/getUserDetails',
    async(_,{getState,rejectWithValue})=>{
        try{
            let res = await fetchUserDetails(getState().user.auth);
            console.log(res);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data);
        }
    }
);


export const addUser = createAsyncThunk(
    'user/addUser',
    async(data,{rejectWithValue})=>{
        try{
            let res = await signup(data);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data);
        }
    }
);


export const editUser = createAsyncThunk(
    'user/editUser',
    async(data,{getState,rejectWithValue})=>{
        try{
            let res = await updateUser(data,getState().user.auth);
            return res.data;
        }catch(e){
            return rejectWithValue(e.response.data);
        }
    }
);


export const removeUser = createAsyncThunk(
    'user/removeUser',
    async(_,{getState})=>{
        let res = await deleteUser(getState().user.auth);
        console.log(res.data);
        return res.data;
    }
);


export const setUser = createAsyncThunk(
    'user/setUser',
    async(data)=>{
        let res = await login(data);
        console.log(res.data);
        return res.data;
    }
)


export const userSlice = createSlice({
    name:"products",
    initialState:{
        user:null,
        reload:false,
        lastUpdate:Date.now(),
        details:{
            status:'idle',
            errors:null
        },
        signup:{
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
        login:{
            status:'idle',
            errors:null
        },
        authStatus:null,
        auth:null
    },
    reducers : {
        unmountSignUp: state =>{
            state.signup={
                status:"idle",
                errors:null
            }
        },
        unmountDelete: state =>{
            state.delete={
                status:"idle",
                errors:null
            };
        },
        unmountEdit: state =>{
            state.edit={
                status:"idle",
                errors:null
            }
        },
        unmountDetails: state =>{
            state.details={
                status:"idle",
                errors:null
            }
        },
        unmountLogin: state =>{
            state.login={
                status:"idle",
                errors:null
            }
        },
        getAuth: state =>{
            if(localStorage.getItem('user'))state.auth =  {headers:{'x-access-token':JSON.parse(localStorage.getItem('token')).accessToken}};
            else state.auth= null;
        },
        logoutUser: state => {
            console.log('logout');
            localStorage.removeItem('user');
            state.authStatus='idle';
            state.user = null;
            state.userImg=null;
            console.log(state);
        },
        setUserReload: state => {
            state.reload = !state.reload;
        }
    },
    extraReducers: builder =>{
        builder
        .addCase(getUserDetails.pending,(state)=>{
            state.details.status = 'loading';
            state.details.errors = null;
        })
        .addCase(getUserDetails.fulfilled,(state,action)=>{
            state.details.status = 'success';
            state.details.errors = null;
        })
        .addCase(getUserDetails.rejected,(state,action)=>{
            state.details.status = 'failed';
            state.details.errors = action.error;
        })
        .addCase(addUser.pending,(state)=>{
            state.signup.status = 'loading';
            state.signup.errors = null;
        })
        .addCase(addUser.fulfilled,(state,action)=>{
            state.signup.status = 'success';
            state.signup.errors = null;
            state.reload = !state.reload;
            state.lastUpdate = Date.now();
        })
        .addCase(addUser.rejected,(state,action)=>{
            state.signup.status = 'failed';
            state.signup.errors = action.error;
        })
        .addCase(editUser.pending,(state)=>{
            state.edit.status = 'loading';
            state.edit.errors = null;
        })
        .addCase(editUser.fulfilled,(state,action)=>{
            state.edit.status = 'success';
            state.edit.errors = null;
            state.user = action.payload.user;
            localStorage.setItem('user',JSON.stringify(action.payload.user));
            state.reload = !state.reload;
            state.lastUpdate = Date.now();
        })
        .addCase(editUser.rejected,(state,action)=>{
            state.edit.status = 'failed';
            state.edit.errors = action.error;
        })
        .addCase(setUser.pending,(state)=>{
            state.login.status = 'loading';
            state.login.errors = null;
            state.auth=null;
            state.authStatus='loading';
        })
        .addCase(setUser.fulfilled,(state,action)=>{
            state.login.status = 'success';
            state.user = action.payload.user;
            state.login.errors = null;
            state.reload = !state.reload;
            state.lastUpdate = Date.now();
            if(action.payload.user.accessToken)
            {
                localStorage.setItem('user',JSON.stringify(action.payload.user));
                state.auth = {headers:{'x-access-token':action.payload.user.accessToken}};
                state.authStatus='success';
            }
        })
        .addCase(setUser.rejected,(state,action)=>{
            state.login.status = 'failed';
            state.login.errors = action.error;
            state.auth=null;
            state.authStatus='failed';
        })
        .addCase(removeUser.pending,(state,action)=>{
            state.delete.status = 'loading';
            state.delete.errors = null;
        })
        .addCase(removeUser.fulfilled,(state,action)=>{
            state.user=null;
            state.authStatus='idle';
            state.auth = null;
            localStorage.removeItem('user');
            state.delete.status = 'success';
            state.delete.errors = null;
            state.reload = !state.reload;
            state.lastUpdate = Date.now();
        })
        .addCase(removeUser.rejected,(state,action)=>{
            state.delete.status = 'failed';
            state.delete.errors = action.error;
        })
        .addCase(updateDB,(state,action)=>{
            state.lastUpdate=Date.now();
        })
        .addCase(checkAuth.fulfilled,(state,action)=>{
            state.authStatus='success';
            state.auth = action.payload.auth;
            state.user = action.payload.user;
        })
        .addCase(checkAuth.pending,(state,action)=>{
            state.authStatus='loading';
        })
        .addCase(checkAuth.rejected,(state,action)=>{
            state.authStatus='failed';
            state.auth = null;
            state.user = null;
        })
    }
});


export const {unmountSignUp,unmountDelete,unmountDetails,unmountEdit,unmountLogin,setUserReload,getAuth,logoutUser} = userSlice.actions;
export const selectUser = (state) => state.user.user;
export const selectUserDetails = (state) => state.user.details;
export const selectAddUser = (state) => state.user.signup;
export const selectLogin = (state) => state.user.login;
export const selectEditUser = (state) => state.user.edit;
export const selectEditedUser = (state) => state.user.editedUser;
export const selectDelete = (state) => state.user.delete;
export const selectUserReload = (state) => state.user.reload;
export const selectAuth = (state) => state.user.auth;
export const selectAuthStatus = (state) => state.user.authStatus;
export default userSlice.reducer;