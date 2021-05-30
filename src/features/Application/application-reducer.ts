import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {authAPI} from "../../api/todolist-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError} from "../../utils/utils-error";
import { setIsLoggedIn } from "../Login/auth-reducer";

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

export type InitialStateType = typeof initialState

const initialState = {
    status: "loading" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

const initializeApp = createAsyncThunk("application/initializeApp", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === 0) {
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
    reducers: {
        setAppStatus: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppError: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializeApp.fulfilled, (state, action) => {
            state.isInitialized = action.payload.isInitialized
        })
    }
})

export const {setAppStatus, setAppError} = slice.actions
export const asyncActions = {initializeApp}


