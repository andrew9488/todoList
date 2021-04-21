import {Provider} from "react-redux"
import React from "react";
import {AppRootStateType} from "../../app/store";
import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../../features/Todolists/tasks-reducer";
import {todoListsReducer} from "../../features/Todolists/todolists-reducer";
import {v1} from "uuid";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import {appReducer} from "../../app/app-reducer";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer
})

const initialGlobalState = {
    todoLists: [
        {id: "todoListId1", title: "What to learn", filter: "all", addedDate: "", order: 0},
        {id: "todoListId2", title: "What to buy", filter: "all", addedDate: "", order: 1}
    ],
    tasks: {
        ["todoListId1"]: [
            {
                id: v1(), title: "HTML&CSS", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1"
            },
            {
                id: v1(), title: "JS", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 1, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1"
            },
            {
                id: v1(), title: "React", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 2, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1"
            }
        ],
        ["todoListId2"]: [
            {
                id: v1(), title: "Book Sandman", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2"
            },
            {
                id: v1(), title: "React Book", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 1, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2"
            },
            {
                id: v1(), title: "JS Book", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 2, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2"
            }
        ]
    },
    app: {
        error: null,
        status: "idle"
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)
