import {FilterValuesType, TodoListType} from "../App";
import {v1} from "uuid";

type RemoveTodoListActionType = {
    type: "REMOVE-TODOLIST",
    todoListID: string
}

type AddTodoListActionType = {
    type: "ADD-TODOLIST",
    newTitle: string
}

type ChangeFilterTodoListActionType = {
    type: "CHANGE-FILTER-TODOLIST",
    newFilterValue: FilterValuesType,
    todoListID: string

}

type ChangeTodoListTitleActionType = {
    type: "CHANGE-TITLE-TODOLIST",
    todoListID: string,
    newTitle: string
}

export type ActionsTodoListType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeFilterTodoListActionType
    | ChangeTodoListTitleActionType

export const todoListReducer = (state: Array<TodoListType>, action: ActionsTodoListType): Array<TodoListType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(st => st.id !== action.todoListID)
        }
        case "ADD-TODOLIST": {
            const newTodoListID = v1()
            const newTodoList: TodoListType = {
                id: newTodoListID,
                title: action.newTitle,
                filter: "all"
            }
            return [newTodoList, ...state]
        }
        case "CHANGE-FILTER-TODOLIST": {
            return state.map(tl => {
                if (tl.id === action.todoListID) {
                    return {...tl, filter: action.newFilterValue}
                } else {
                    return tl
                }
            })
        }
        case "CHANGE-TITLE-TODOLIST": {
            return state.map(tl => {
                if (tl.id === action.todoListID) {
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

export const RemoveTodoListActionCreator = (id: string): RemoveTodoListActionType => {
    return {
        type: "REMOVE-TODOLIST",
        todoListID: id
    }
}
export const AddTodoListActionCreator = (title: string): AddTodoListActionType => {
    return {
        type: "ADD-TODOLIST",
        newTitle: title
    }
}
export const ChangeFilterTodoListActionCreator = (id: string, filter: FilterValuesType): ChangeFilterTodoListActionType => {
    return {
        type: "CHANGE-FILTER-TODOLIST",
        newFilterValue: filter,
        todoListID: id
    }
}
export const ChangeTodoListTitleActionCreator = (id: string, title: string): ChangeTodoListTitleActionType => {
    return {
        type: "CHANGE-TITLE-TODOLIST",
        todoListID: id,
        newTitle: title
    }
}