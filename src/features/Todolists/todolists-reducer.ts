import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {AppThunkType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/utils-error";

export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>
type ChangeFilterTodoListActionType = ReturnType<typeof changeFilterTodoListAC>
type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>
export type ChangeTodoListEntityStatusActionType = ReturnType<typeof changeTodoListEntityStatusAC>

export type TodoListsActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeFilterTodoListActionType
    | ChangeTodoListTitleActionType
    | SetTodoListsActionType
    | ChangeTodoListEntityStatusActionType

export type FilterValuesType = "all" | "active" | "completed"

export type TodoListDomainType = TodoListType & { filter: FilterValuesType, entityStatus: RequestStatusType }

let initialState: Array<TodoListDomainType> = []

export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: TodoListsActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "TODOLISTS/REMOVE-TODOLIST": {
            return state.filter(st => st.id !== action.todoListId)
        }
        case "TODOLISTS/ADD-TODOLIST": {
            return [{...action.todoList, filter: "all", entityStatus: "idle"}, ...state]
        }
        case "TODOLISTS/CHANGE-FILTER-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.newFilterValue} : tl)
        }
        case "TODOLISTS/CHANGE-TITLE-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        }
        case 'TODOLISTS/SET-TODOLISTS': {
            return action.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        }
        case "TODOLISTS/CHANGE-TODOLIST-ENTITY-STATUS": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, entityStatus: action.entityStatus} : tl)
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
    ({type: "TODOLISTS/SET-TODOLISTS", todoLists} as const)

export const changeTodoListEntityStatusAC = (todoListId: string, entityStatus: RequestStatusType) =>
    ({type: "TODOLISTS/CHANGE-TODOLIST-ENTITY-STATUS", todoListId, entityStatus} as const)

export const fetchTodoListsTC = (): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC(res.data))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const removeTodoListTC = (todoListId: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    dispatch(changeTodoListEntityStatusAC(todoListId, "loading"))
    todoListsApi.deleteTodoList(todoListId)
        .then(() => {
            dispatch(removeTodoListAC(todoListId))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const addTodoListTC = (title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    todoListsApi.createTodoList(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC(res.data.data.item))
                dispatch(setAppStatusAC("succeeded"))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const changeTodoListTitleTC = (todoListId: string, title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC("loading"))
    todoListsApi.updateTodoListTitle(todoListId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(title, todoListId))
            dispatch(setAppStatusAC("succeeded"))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
