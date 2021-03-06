import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {authAPI, ResultStatusCode} from "../../api/todolist-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/utils-error";
import {appActions} from "../Actions/App";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

export type InitialStateType = typeof initialState

const initialState = {
    status: "loading" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const {setAppStatus, setIsLoggedIn} = appActions

const initializeApp = createAsyncThunk("application/initializeApp", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === ResultStatusCode.success) {
            thunkAPI.dispatch(setIsLoggedIn({isLoggedIn: true}));
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
        return {isInitialized: true}
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(initializeApp.fulfilled, (state, action) => {
                state.isInitialized = action.payload.isInitialized
            })
            .addCase(appActions.setAppStatus, (state, action) => {
                state.status = action.payload.status
            })
            .addCase(appActions.setAppError, (state, action) => {
                state.error = action.payload.error
            })
    }
})

export const asyncActions = {initializeApp}


