import {setAppStatusAC} from '../../app/app-reducer'
import {AppThunkType} from "../../app/store";
import {authAPI, LoginParamsType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/utils-error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type SetIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
export type AuthActionsType = SetIsLoggedInActionType
export type InitialStateType = typeof initialState

const initialState = {
    isLoggedIn: false
}

const slice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        setIsLoggedInAC(state, action: PayloadAction<{ value: boolean }>) {
            state.isLoggedIn = action.payload.value
        }
    }
})

export const authReducer = slice.reducer
export const {setIsLoggedInAC} = slice.actions

export const loginTC = (data: LoginParamsType): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status:"loading"}))
    authAPI.login(data)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: true}))
                dispatch(setAppStatusAC({status:"succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const logoutTC = (): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status:"loading"}))
    authAPI.logout()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC({value: false}))
                dispatch(setAppStatusAC({status:"succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

