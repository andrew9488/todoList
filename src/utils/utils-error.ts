import {FieldsErrorsType, ResponseType} from "../api/todolist-api";
import {AxiosError} from "axios";
import {appActions} from "../features/Actions/App";
import {appActions as initializedApp} from "../features/Application"

// original type:
// BaseThunkAPI<S, E, D extends Dispatch = Dispatch, RejectedValue = undefined>
type ThunkAPIType = {
    dispatch: (action: any) => any
    rejectWithValue: Function
}
const {setAppError, setAppStatus} = appActions

export const handleAsyncServerAppError = <D>(data: ResponseType<D>,
                                             thunkAPI: ThunkAPIType,
                                             showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppError({error: data.messages.length ? data.messages[0] : 'Some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    thunkAPI.dispatch(initializedApp.initializeApp.fulfilled({isInitialized: true}, ""))
    return thunkAPI.rejectWithValue({errors: data.messages, fieldsErrors: data.fieldsErrors})
}

export const handleAsyncServerNetworkError = (error: AxiosError,
                                              thunkAPI: ThunkAPIType,
                                              showError = true) => {
    if (showError) {
        thunkAPI.dispatch(setAppError({error: error.message ? error.message : 'Some error occurred'}))
    }
    thunkAPI.dispatch(setAppStatus({status: 'failed'}))
    thunkAPI.dispatch(initializedApp.initializeApp.fulfilled({isInitialized: true}, ""))
    return thunkAPI.rejectWithValue({errors: [error.message], fieldsErrors: undefined})
}

export type ThunkError = { rejectValue: { errors: Array<string>, fieldsErrors?: Array<FieldsErrorsType> } }
