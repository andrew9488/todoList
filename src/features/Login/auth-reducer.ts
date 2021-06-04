import {authAPI, LoginParamsType} from "../../api/todolist-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, ThunkError} from "../../utils/utils-error";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {appActions} from "../Actions/App";

export type InitialStateType = typeof initialState

const initialState = {
    isLoggedIn: false
}

const {setAppStatus, setIsLoggedIn} = appActions

const login = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType, ThunkError>("auth/login", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
        const response = await authAPI.login(payload)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
            return {isLoggedIn: true}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

const logout = createAsyncThunk("auth/logout", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
        const response = await authAPI.logout()
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
            return {isLoggedIn: false}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(login.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(setIsLoggedIn, (state, action) => {
                state.isLoggedIn = action.payload.isLoggedIn
            })

    }
})

export const asyncActions = {login, logout}



