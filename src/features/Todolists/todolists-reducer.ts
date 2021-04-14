import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {Dispatch} from "redux";

export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>
type ChangeFilterTodoListActionType = ReturnType<typeof changeFilterTodoListAC>
type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>

export type FilterValuesType = "all" | "active" | "completed"

export type TodoListDomainType = TodoListType & { filter: FilterValuesType }

export type ActionsTodoListType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeFilterTodoListActionType
    | ChangeTodoListTitleActionType
    | SetTodoListsActionType

let initialState: Array<TodoListDomainType> = []

export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: ActionsTodoListType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(st => st.id !== action.todoListId)
        }
        case "ADD-TODOLIST": {
            return [{...action.todoList, filter: "all"}, ...state]
        }
        case "CHANGE-FILTER-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.newFilterValue} : tl)
        }
        case "CHANGE-TITLE-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        }
        case 'SET-TODOLISTS': {
            return action.todoLists.map(tl => ({...tl, filter: "all"}))
        }
        default:
            return state
    }
}

export const removeTodoListAC = (id: string) => ({type: "REMOVE-TODOLIST", todoListId: id} as const)

export const addTodoListAC = (todoList: TodoListType) => ({type: "ADD-TODOLIST", todoList} as const)

export const changeFilterTodoListAC = (id: string, filter: FilterValuesType) =>
    ({type: "CHANGE-FILTER-TODOLIST", newFilterValue: filter, todoListId: id} as const)

export const changeTodoListTitleAC = (title: string, id: string) =>
    ({type: "CHANGE-TITLE-TODOLIST", todoListId: id, newTitle: title} as const)

export const setTodoListsAC = (todoLists: Array<TodoListType>) => ({type: 'SET-TODOLISTS', todoLists} as const)

export const fetchTodoListsTC = () => (dispatch: Dispatch<ActionsTodoListType>) => {
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC(res.data))
        })
}

export const removeTodoListTC = (todoListId: string) => (dispatch: Dispatch<ActionsTodoListType>) => {
    todoListsApi.deleteTodoList(todoListId)
        .then(res => {
            dispatch(removeTodoListAC(todoListId))
        })
}

export const addTodoListTC = (title: string) => (dispatch: Dispatch<ActionsTodoListType>) => {
    todoListsApi.createTodoList(title)
        .then(res => {
            dispatch(addTodoListAC(res.data.data.item))
        })
}

export const changeTodoListTitleTC = (todoListId: string, title: string) => (dispatch: Dispatch<ActionsTodoListType>) => {
    todoListsApi.updateTodoListTitle(todoListId, title)
        .then(res => {
            dispatch(changeTodoListTitleAC(title, todoListId))
        })
}