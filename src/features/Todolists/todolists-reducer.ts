import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {AppThunkType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/utils-error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

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

const initialState: Array<TodoListDomainType> = []

const slice = createSlice({
    name: "todoLists",
    initialState: initialState,
    reducers: {
        removeTodoListAC: (state, action: PayloadAction<{ id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodoListAC: (state, action: PayloadAction<{ todoList: TodoListType }>) => {
            state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"})
        },
        changeFilterTodoListAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodoListTitleAC: (state, action: PayloadAction<{ title: string, id: string }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        },
        setTodoListsAC: (state, action: PayloadAction<{ todoLists: Array<TodoListType> }>) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        },
        changeTodoListEntityStatusAC: (state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
    }
})

export const {
    removeTodoListAC, addTodoListAC, changeFilterTodoListAC, changeTodoListTitleAC,
    setTodoListsAC, changeTodoListEntityStatusAC
} = slice.actions

export const todoListsReducer = slice.reducer

export const fetchTodoListsTC = (): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC({todoLists: res.data}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const removeTodoListTC = (todoListId: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeTodoListEntityStatusAC({todoListId: todoListId, entityStatus: "loading"}))
    todoListsApi.deleteTodoList(todoListId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTodoListAC({id: todoListId}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const addTodoListTC = (title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsApi.createTodoList(title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTodoListAC({todoList: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const changeTodoListTitleTC = (todoListId: string, title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsApi.updateTodoListTitle(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(changeTodoListTitleAC({title: title, id: todoListId}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
