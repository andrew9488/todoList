import {v1} from "uuid";
import {TodoListType} from "../api/todolist-api";

export type RemoveTodoListActionType = {
    type: "REMOVE-TODOLIST",
    todoListId: string
}

export type AddTodoListActionType = {
    type: "ADD-TODOLIST",
    newTitle: string
    todoListId: string
}

type ChangeFilterTodoListActionType = {
    type: "CHANGE-FILTER-TODOLIST",
    newFilterValue: FilterValuesType,
    todoListId: string

}

type ChangeTodoListTitleActionType = {
    type: "CHANGE-TITLE-TODOLIST",
    todoListId: string,
    newTitle: string
}

export type FilterValuesType = "all" | "active" | "completed"

export type CommonTodoListType = TodoListType & {
    filter: FilterValuesType
}

export type ActionsTodoListType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeFilterTodoListActionType
    | ChangeTodoListTitleActionType

let initialState: Array<CommonTodoListType> = []

export const todoListsReducer = (state: Array<CommonTodoListType> = initialState, action: ActionsTodoListType): Array<CommonTodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(st => st.id !== action.todoListId)
        }
        case "ADD-TODOLIST": {
            const newTodoList: CommonTodoListType = {
                id: action.todoListId,
                title: action.newTitle,
                filter: "all",
                addedDate: "",
                order: 0
            }
            return [newTodoList, ...state]
        }
        case "CHANGE-FILTER-TODOLIST": {
            return state.map(tl => {
                if (tl.id === action.todoListId) {
                    return {...tl, filter: action.newFilterValue}
                } else {
                    return tl
                }
            })
        }
        case "CHANGE-TITLE-TODOLIST": {
            return state.map(tl => {
                if (tl.id === action.todoListId) {
                    return {...tl, title: action.newTitle}
                } else {
                    return tl
                }
            })
        }
        default:
            return state
    }
}

export const removeTodoListActionCreator = (id: string): RemoveTodoListActionType => {
    return {
        type: "REMOVE-TODOLIST",
        todoListId: id
    }
}
export const addTodoListActionCreator = (title: string): AddTodoListActionType => {
    return {
        type: "ADD-TODOLIST",
        newTitle: title,
        todoListId: v1()
    }
}
export const changeFilterTodoListActionCreator = (id: string, filter: FilterValuesType): ChangeFilterTodoListActionType => {
    return {
        type: "CHANGE-FILTER-TODOLIST",
        newFilterValue: filter,
        todoListId: id
    }
}
export const changeTodoListTitleActionCreator = (title: string, id: string): ChangeTodoListTitleActionType => {
    return {
        type: "CHANGE-TITLE-TODOLIST",
        todoListId: id,
        newTitle: title
    }
}