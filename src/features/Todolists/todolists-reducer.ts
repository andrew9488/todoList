import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {AppThunkType} from "../../app/store";
import {setAppStatusAC} from "../../app/app-reducer";

export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>
type ChangeFilterTodoListActionType = ReturnType<typeof changeFilterTodoListAC>
type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>

export type FilterValuesType = "all" | "active" | "completed"

export type TodoListDomainType = TodoListType & { filter: FilterValuesType }

export type TodoListsActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeFilterTodoListActionType
    | ChangeTodoListTitleActionType
    | SetTodoListsActionType

let initialState: Array<TodoListDomainType> = []

export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: TodoListsActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "TODOLISTS/REMOVE-TODOLIST": {
            return state.filter(st => st.id !== action.todoListId)
        }
        case "TODOLISTS/ADD-TODOLIST": {
            return [{...action.todoList, filter: "all"}, ...state]
        }
        case "TODOLISTS/CHANGE-FILTER-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.newFilterValue} : tl)
        }
        case "TODOLISTS/CHANGE-TITLE-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        }
        case 'TODOLISTS/SET-TODOLISTS': {
            return action.todoLists.map(tl => ({...tl, filter: "all"}))
        }
        default:
            return state
    }
}

export const removeTodoListAC = (id: string) => ({type: "TODOLISTS/REMOVE-TODOLIST", todoListId: id} as const)

export const addTodoListAC = (todoList: TodoListType) => ({type: "TODOLISTS/ADD-TODOLIST", todoList} as const)

export const changeFilterTodoListAC = (id: string, filter: FilterValuesType) =>
    ({type: "TODOLISTS/CHANGE-FILTER-TODOLIST", newFilterValue: filter, todoListId: id} as const)

export const changeTodoListTitleAC = (title: string, id: string) =>
    ({type: "TODOLISTS/CHANGE-TITLE-TODOLIST", todoListId: id, newTitle: title} as const)

export const setTodoListsAC = (todoLists: Array<TodoListType>) =>
    ({type: 'TODOLISTS/SET-TODOLISTS', todoLists} as const)

export const fetchTodoListsTC = (): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC(res.data))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const removeTodoListTC = (todoListId: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    todoListsApi.deleteTodoList(todoListId)
        .then(() => {
            dispatch(removeTodoListAC(todoListId))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const addTodoListTC = (title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    todoListsApi.createTodoList(title)
        .then(res => {
            dispatch(addTodoListAC(res.data.data.item))
            dispatch(setAppStatusAC("succeeded"))
        })
}

export const changeTodoListTitleTC = (todoListId: string, title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    todoListsApi.updateTodoListTitle(todoListId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(title, todoListId))
            dispatch(setAppStatusAC("succeeded"))
        })
}
