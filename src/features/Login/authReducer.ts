import {setAppStatusAC} from '../../app/app-reducer'
import {authAPI, FieldsErrorsType, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/utils-error";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
export type AuthActionsType = SetIsLoggedInActionType
export type InitialStateType = typeof initialState

const initialState = {
    isLoggedIn: false
}

const loginTC = createAsyncThunk<{ isLoggedIn: boolean }, LoginParamsType,
    { rejectValue: { errors: Array<string>, fieldsError: Array<FieldsErrorsType> } }>("auth/login", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const response = await authAPI.login(payload)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {isLoggedIn: true}
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: response.data.messages, fieldsError: response.data.fieldsErrors})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})

const logoutTC = createAsyncThunk("auth/logout", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const response = await authAPI.logout()
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {isLoggedIn: false}
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({errors: response.data.messages, fieldsError: response.data.fieldsErrors})
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})

export const asyncActions = {
    loginTC,
    logoutTC
}

export const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
            state.isLoggedIn = action.payload.isLoggedIn
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
        builder.addCase(logoutTC.fulfilled, (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
        })
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions



