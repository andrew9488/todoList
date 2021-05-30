import {TaskPriorities, TaskStatuses, TaskType, todoListsApi} from "../../api/todolist-api";
import {handleAsyncServerAppError, handleAsyncServerNetworkError, ThunkError} from "../../utils/utils-error";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppRootStateType} from "../../bll/store";
import {RequestStatusType, setAppStatus} from "../Application/application-reducer";
import { todoListsActions } from "../Todolists";

type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}


export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }
export type TasksStateType = { [key: string]: Array<TaskDomainType> }
const initialState: TasksStateType = {}

const fetchTasks = createAsyncThunk<{ todoListId: string, tasks: Array<TaskType> }, string, ThunkError>
("tasks/fetchTasks", async (todoListId: string, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    try {
        const response = await todoListsApi.getTasks(todoListId)
        thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
        return {todoListId, tasks: response.data.items}
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const removeTask = createAsyncThunk("tasks/removeTask", async (payload: { todoListId: string, taskId: string }, thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    thunkAPI.dispatch(changeTasksEntityStatusAC({
        todoListId: payload.todoListId,
        taskId: payload.taskId,
        entityStatus: "loading"
    }))
    try {
        const response = await todoListsApi.deleteTask(payload.todoListId, payload.taskId)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
            return {taskId: payload.taskId, todoListId: payload.todoListId}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})
const addTask = createAsyncThunk<{ task: TaskType }, { title: string, todoListId: string }, ThunkError>("tasks/addTask",
    async (payload, thunkAPI) => {
        thunkAPI.dispatch(setAppStatus({status: "loading"}))
        try {
            const response = await todoListsApi.createTask(payload.todoListId, payload.title)
            if (response.data.resultCode === 0) {
                thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
                return {task: response.data.data.item}
            } else {
                return handleAsyncServerAppError(response.data, thunkAPI, false)
            }
        } catch (error) {
            return handleAsyncServerNetworkError(error, thunkAPI)
        }
    })
const updateTask = createAsyncThunk("tasks/updateTask", async (payload: { taskId: string, model: UpdateTaskDomainModelType, todoListId: string },
                                                               thunkAPI) => {
    thunkAPI.dispatch(setAppStatus({status: "loading"}))
    const state = thunkAPI.getState() as AppRootStateType
    const currentTask = state.tasks[payload.todoListId].find(t => t.id === payload.taskId)
    if (!currentTask) {
        return thunkAPI.rejectWithValue("error")
    }

    const apiModel = {
        title: currentTask.title,
        status: currentTask.status,
        deadline: currentTask.deadline,
        description: currentTask.description,
        priority: TaskPriorities.Low,
        startDate: currentTask.startDate,
        ...payload.model
    }
    try {
        const response = await todoListsApi.updateTask(payload.todoListId, payload.taskId, apiModel)
        if (response.data.resultCode === 0) {
            thunkAPI.dispatch(setAppStatus({status: "succeeded"}))
            return {taskId: payload.taskId, model: payload.model, todoListId: payload.todoListId}
        } else {
            return handleAsyncServerAppError(response.data, thunkAPI)
        }
    } catch (error) {
        return handleAsyncServerNetworkError(error, thunkAPI)
    }
})

export const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        changeTasksEntityStatusAC: (state, action: PayloadAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder.addCase(todoListsActions.addTodoList.fulfilled, (state, action) => {
            state[action.payload.todoList.id] = []
        })
        builder.addCase(todoListsActions.removeTodoList.fulfilled, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(todoListsActions.fetchTodoLists.fulfilled, (state, action) => {
            action.payload.todoLists.forEach(tl => {
                    if (!state[tl.id]) state[tl.id] = []
                }
            )
        })
        builder.addCase(fetchTasks.fulfilled, (state, action) => {
            return {
                ...state, [action.payload.todoListId]: action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
            }
        })
        builder.addCase(removeTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        })
        builder.addCase(addTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift({...action.payload.task, entityStatus: "idle"})
        })
        builder.addCase(updateTask.fulfilled, (state, action) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        })
    }
})

const {changeTasksEntityStatusAC} = slice.actions
export const asyncActions = {fetchTasks, removeTask, addTask, updateTask}