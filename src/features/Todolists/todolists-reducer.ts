import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, ThunkError} from "../../utils/utils-error";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

export type FilterValuesType = "all" | "active" | "completed"
export type TodoListDomainType = TodoListType & { filter: FilterValuesType, entityStatus: RequestStatusType }
const initialState: Array<TodoListDomainType> = []

const fetchTodoListsTC = createAsyncThunk<{ todoLists: Array<TodoListType> }, undefined, ThunkError>
("todoLists/fetchTodoLists", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const response = await todoListsApi.getTodoLists()
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {todoLists: response.data}
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const removeTodoListTC = createAsyncThunk("todoLists/removeTodoList", async (todoListId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    thunkAPI.dispatch(changeTodoListEntityStatusAC({todoListId: todoListId, entityStatus: "loading"}))
    try {
        const response = await todoListsApi.deleteTodoList(todoListId)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {id: todoListId}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const addTodoListTC = createAsyncThunk<{ todoList: TodoListType }, string, ThunkError>("todoLists/addTodoList", async (title, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {

        const response = await todoListsApi.createTodoList(title)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {todoList: response.data.data.item}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI, false)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const changeTodoListTitleTC = createAsyncThunk("todoLists/changeTodoListTitle", async (payload: { todoListId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const response = await todoListsApi.updateTodoListTitle(payload.todoListId, payload.title)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {title: payload.title, id: payload.todoListId}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI, false)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const slice = createSlice({
    name: "todoLists",
    initialState: initialState,
    reducers: {
        changeFilterTodoListAC: (state, action: PayloadAction<{ id: string, filter: FilterValuesType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state[index].filter = action.payload.filter
        },
        changeTodoListEntityStatusAC: (state, action: PayloadAction<{ todoListId: string, entityStatus: RequestStatusType }>) => {
            const index = state.findIndex(tl => tl.id === action.payload.todoListId)
            if (index !== -1) state[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: builder => {
        builder.addCase(fetchTodoListsTC.fulfilled, (state, action) => {
            return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
        })
        builder.addCase(removeTodoListTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        })
        builder.addCase(addTodoListTC.fulfilled, (state, action) => {
            state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"})
        })
        builder.addCase(changeTodoListTitleTC.fulfilled, (state, action) => {
            const index = state.findIndex(tl => tl.id === action.payload.id)
            if (index !== -1) state[index].title = action.payload.title
        })
    }
})

export const {changeFilterTodoListAC, changeTodoListEntityStatusAC} = slice.actions
export const asyncActions = {fetchTodoListsTC, removeTodoListTC, addTodoListTC, changeTodoListTitleTC}
