import {tasksReducer} from '../features/Task';
import {todoListsReducer} from '../features/Todolists';
import {combineReducers} from 'redux';
import thunk from "redux-thunk";
import {appReducer} from "../features/Application";
import {authReducer} from "../features/Login";
import {configureStore} from "@reduxjs/toolkit";

const rootReducer = combineReducers({
    app: appReducer,
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    auth: authReducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().prepend(thunk)
})


export type AppRootStateType = ReturnType<typeof rootReducer>

export type AppDispatchType = typeof store.dispatch


