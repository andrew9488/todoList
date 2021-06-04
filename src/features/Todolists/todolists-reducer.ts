import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, ThunkError} from "../../utils/utils-error";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {RequestStatusType} from "../Application/application-reducer";
import {appActions} from "../Actions/App";

export type FilterValuesType = "all" | "active" | "completed"
export type TodoListDomainType = TodoListType & { filter: FilterValuesType, entityStatus: RequestStatusType }
const initialState: Array<TodoListDomainType> = []

const {setAppStatus, changeTodoListEntityStatus, changeFilterTodoList} = appActions

const fetchTodoLists = createAsyncThunk<{ todoLists: Array<TodoListType> }, undefined, ThunkError>
("todoLists/fetchTodoLists", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
        const response = await todoListsApi.getTodoLists()
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
        return {todoLists: response.data}
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const removeTodoList = createAsyncThunk("todoLists/removeTodoList", async (todoListId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    thunkAPI.dispatch(changeTodoListEntityStatus({todoListId: todoListId, entityStatus: "loading"}))
    try {
        const response = await todoListsApi.deleteTodoList(todoListId)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
            return {id: todoListId}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const addTodoList = createAsyncThunk<{ todoList: TodoListType }, string, ThunkError>("todoLists/addTodoList", async (title, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {

        const response = await todoListsApi.createTodoList(title)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
            return {todoList: response.data.data.item}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI, false)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const changeTodoListTitle = createAsyncThunk("todoLists/changeTodoListTitle", async (payload: { todoListId: string, title: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
        const response = await todoListsApi.updateTodoListTitle(payload.todoListId, payload.title)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
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
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchTodoLists.fulfilled, (state, action) => {
                return action.payload.todoLists.map(tl => ({...tl, filter: "all", entityStatus: "idle"}))
            })
            .addCase(removeTodoList.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index !== -1) state.splice(index, 1)
            })
            .addCase(addTodoList.fulfilled, (state, action) => {
                state.unshift({...action.payload.todoList, filter: "all", entityStatus: "idle"})
            })
            .addCase(changeTodoListTitle.fulfilled, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index !== -1) state[index].title = action.payload.title
            })
            .addCase(changeFilterTodoList, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.id)
                if (index !== -1) state[index].filter = action.payload.filter
            })
            .addCase(changeTodoListEntityStatus, (state, action) => {
                const index = state.findIndex(tl => tl.id === action.payload.todoListId)
                if (index !== -1) state[index].entityStatus = action.payload.entityStatus
            })
    }
})

export const asyncActions = {fetchTodoLists, removeTodoList, addTodoList, changeTodoListTitle}
