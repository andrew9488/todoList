import {Provider} from "react-redux"
import React from "react";
import {AppRootStateType} from "../../bll/store";
import {applyMiddleware, combineReducers, createStore} from "redux";
import {tasksReducer} from "../../features/Task";
import {todoListsReducer} from "../../features/Todolists";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import thunk from "redux-thunk";
import {authReducer} from "../../features/Login";
import {appReducer} from "../../features/Application";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer,
    auth: authReducer
})

const initialGlobalState = {
    todoLists: [
        {id: "todoListId1", title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle"},
        {id: "todoListId2", title: "What to buy", filter: "all", addedDate: "", order: 1, entityStatus: "loading"}
    ],
    tasks: {
        ["todoListId1"]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1",
                entityStatus: "idle"
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 1, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1",
                entityStatus: "idle"
            },
            {
                id: v1(), title: "React", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 2, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1",
                entityStatus: "idle"
            }
        ],
        ["todoListId2"]: [
            {
                id: v1(), title: "Book Sandman", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2",
                entityStatus: "idle"
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 1, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2",
                entityStatus: "idle"
            },
            {
                id: v1(), title: "JS Book", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 2, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2",
                entityStatus: "idle"
            }
        ]
    },
    app: {
        error: null,
        status: "idle",
        isInitialized: true
    },
    auth: {
        isLoggedIn: false
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType, applyMiddleware(thunk));

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)
