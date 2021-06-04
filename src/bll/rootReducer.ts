import {combineReducers} from "redux";
import {appReducer} from "../features/Application";
import {tasksReducer} from "../features/Task";
import {todoListsReducer} from "../features/Todolists";
import {authReducer} from "../features/Login";

export const rootReducer = combineReducers({
    app: appReducer,
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    auth: authReducer
})