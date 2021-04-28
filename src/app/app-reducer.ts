import {AppThunkType} from "./store";
import {authAPI} from "../api/todolist-api";
import {setIsLoggedInAC} from "../features/Login/authReducer";
import {handleServerAppError, handleServerNetworkError} from "../utils/utils-error";

export type SetAppStatusActionType = ReturnType<typeof setAppStatusAC>
export type SetAppErrorActionType = ReturnType<typeof setAppErrorAC>
type SetIsInitializedActionType = ReturnType<typeof setIsInitializedAC>

export type AppActionsType = SetAppStatusActionType | SetAppErrorActionType | SetIsInitializedActionType

export type RequestStatusType = "idle" | "loading" | "succeeded" | "failed"

const initialState = {
    status: "loading" as RequestStatusType,
    error: null as string | null,
    isInitialized: false
}

export type InitialStateType = typeof initialState

export const appReducer = (state: InitialStateType = initialState, action: AppActionsType): InitialStateType => {
    switch (action.type) {
        case "APP/SET-STATUS": {
            return {...state, status: action.status}
        }
        case "APP/SET-ERROR": {
            return {...state, error: action.error}
        }
        case "APP/SET-IS-INITIALIZED": {
            return {...state, isInitialized: action.isInitialized}
        }
        default:
            return state
    }
}

export const setAppStatusAC = (status: RequestStatusType) => ({type: "APP/SET-STATUS", status} as const)
export const setAppErrorAC = (error: null | string) => ({type: "APP/SET-ERROR", error} as const)
export const setIsInitializedAC = (isInitialized: boolean) => ({type: "APP/SET-IS-INITIALIZED", isInitialized} as const)

export const initializeAppTC = (): AppThunkType => dispatch => {
    authAPI.me()
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(setIsLoggedInAC(true));
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
            dispatch(setIsInitializedAC(true))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
