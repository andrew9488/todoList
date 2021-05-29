import {tasksReducer} from '../features/Task';
import {todoListsReducer} from '../features/Todolists';
import {ActionCreatorsMapObject, bindActionCreators, combineReducers} from 'redux';
import thunk from "redux-thunk";
import {appReducer} from "../app";
import {authReducer} from "../features/Login";
import {configureStore} from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";
import {useMemo} from "react";

const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})


export type AppRootStateType = ReturnType<typeof rootReducer>

type AppDispatchType = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatchType>()

export function useActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch()

    const boundAction = useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [])

    return boundAction
}
