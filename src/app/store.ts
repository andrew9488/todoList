import {TasksActionsType, tasksReducer} from '../features/Todolists/tasks-reducer';
import {TodoListsActionsType, todoListsReducer} from '../features/Todolists/todolists-reducer';
import {combineReducers} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";
import {AuthActionsType, authReducer} from "../features/Login/authReducer";
import {configureStore} from "@reduxjs/toolkit";

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

type ActionsType = TasksActionsType | TodoListsActionsType | AppActionsType | AuthActionsType

export type AppThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;