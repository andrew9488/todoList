import {Provider} from "react-redux"
import React from "react";
import {AppRootStateType} from "../../state/store";
import {combineReducers, createStore} from "redux";
import {tasksReducer} from "../../state/tasks-reducer";
import {todoListsReducer} from "../../state/todolists-reducer";
import {v1} from "uuid";


const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer
})

const initialGlobalState = {
    todoLists: [
        {id: "todoListId1", title: "What to learn", filter: "all"},
        {id: "todoListId2", title: "What to buy", filter: "all"}
    ],
    tasks: {
        ["todoListId1"]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false}
        ],
        ["todoListId2"]: [
            {id: v1(), title: "Book Sandman", isDone: true},
            {id: v1(), title: "React Book", isDone: false},
            {id: v1(), title: "JS Book", isDone: true}
        ]
    }
};

export const storyBookStore = createStore(rootReducer, initialGlobalState as AppRootStateType);

export const ReduxStoreProviderDecorator = (storyFn: any) => (
    <Provider
        store={storyBookStore}>{storyFn()}
    </Provider>)
