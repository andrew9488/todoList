import {authAPI} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/utils-error";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {setIsLoggedInAC} from "../features/Login/authReducer";

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>

export type AppActionsType = SetAppStatusActionType | SetAppErrorActionType

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

export type InitialStateType = typeof initialState

const initialState = {
    status: "loading" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export const initializeAppTC = createAsyncThunk("app/initializeApp", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const response = await authAPI.me()
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setIsLoggedInAC({isLoggedIn: true}));
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: response.data.messages, fieldsError: response.data.fieldsErrors})
        }
        return {isInitialized: true}
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})

const slice = createSlice({
    name: "app",
    initialState: initialState,
    reducers: {
        setAppStatusAC: (state, action: PayloadAction<{ status: RequestStatusType }>) => {
            state.status = action.payload.status
        },
        setAppErrorAC: (state, action: PayloadAction<{ error: string | null }>) => {
            state.error = action.payload.error
        },
    },
    extraReducers: (builder) => {
        builder.addCase(initializeAppTC.fulfilled, (state, action) => {
            state.isInitialized = action.payload.isInitialized
        })
    }
})

export const appReducer = slice.reducer
export const {setAppStatusAC, setAppErrorAC} = slice.actions


