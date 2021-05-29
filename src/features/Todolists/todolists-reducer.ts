import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/utils-error";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";

type ChangeFilterTodoListActionType = ReturnType<typeof changeFilterTodoListAC>
export type ChangeTodoListEntityStatusActionType = ReturnType<typeof changeTodoListEntityStatusAC>

export type TodoListsActionsType = ChangeFilterTodoListActionType | ChangeTodoListEntityStatusActionType

export type FilterValuesType = "all" | "active" | "completed"

export type TodoListDomainType = TodoListType & { filter: FilterValuesType, entityStatus: RequestStatusType }

const initialState: Array<TodoListDomainType> = []

const fetchTodoListsTC = createAsyncThunk("todoLists/fetchTodoLists", async (payload, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {
        const response = await todoListsApi.getTodoLists()
        thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
        return {todoLists: response.data}
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
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
            handleServerAppError(response.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({
                errors: response.data.messages,
                fieldsError: response.data.fieldsErrors
            })
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})
const addTodoListTC = createAsyncThunk("todoLists/addTodoList", async (title: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatusAC({status: "loading"}))
    try {

        const response = await todoListsApi.createTodoList(title)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatusAC({status: "succeeded"}))
            return {todoList: response.data.data.item}
        } else {
            handleServerAppError(response.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({
                errors: response.data.messages,
                fieldsError: response.data.fieldsErrors
            })
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
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
            handleServerAppError(response.data, thunkAPI.dispatch)
            return thunkAPI.rejectWithValue({
                errors: response.data.messages,
                fieldsError: response.data.fieldsErrors
            })
        }
    } catch (error) {
        handleServerNetworkError(error, thunkAPI.dispatch)
        return thunkAPI.rejectWithValue(error)
    }
})

export const asyncActions = {
    fetchTodoListsTC,
    removeTodoListTC,
    addTodoListTC,
    changeTodoListTitleTC
}

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

