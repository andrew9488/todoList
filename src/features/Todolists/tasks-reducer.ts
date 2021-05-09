import {
    AddTodoListActionType,
    RemoveTodoListActionType,
    SetTodoListsActionType,
    addTodoListAC,
    removeTodoListAC,
    setTodoListsAC
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsApi, TodoListType} from "../../api/todolist-api";
import {AppRootStateType, AppThunkType} from "../../app/store";
import {RequestStatusType, setAppStatusAC} from "../../app/app-reducer";
import {handleServerAppError, handleServerNetworkError} from "../../utils/utils-error";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>
type ChangeTasksEntityStatusActionType = ReturnType<typeof changeTasksEntityStatusAC>

export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | SetTasksActionType
    | ChangeTasksEntityStatusActionType

type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TaskDomainType = TaskType & { entityStatus: RequestStatusType }

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>
}

const initialState: TasksStateType = {}

const slice = createSlice({
    name: "tasks",
    initialState: initialState,
    reducers: {
        removeTaskAC: (state, action: PayloadAction<{ taskId: string, todoListId: string }>) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks.splice(index, 1)
        },
        addTaskAC: (state, action: PayloadAction<{ task: TaskType }>) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift({...action.payload.task, entityStatus: "idle"})
        },
        updateTaskAC: (state, action: PayloadAction<{ taskId: string, model: UpdateTaskDomainModelType, todoListId: string }>) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
                tasks[index] = {...tasks[index], ...action.payload.model}
            }
        },
        setTasksAC: (state, action: PayloadAction<{ todoListId: string, tasks: Array<TaskType> }>) => {
            return {
                ...state, [action.payload.todoListId]: action.payload.tasks.map(t => ({...t, entityStatus: "idle"}))
            }
        },
        changeTasksEntityStatusAC: (state, action: PayloadAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>) => {
            const tasks = state[action.payload.todoListId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) tasks[index].entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addTodoListAC, (state, action) => {
            state[action.payload.todoList.id] = []
        })
        builder.addCase(removeTodoListAC, (state, action) => {
            delete state[action.payload.id]
        })
        builder.addCase(setTodoListsAC, (state, action) => {
            action.payload.todoLists.forEach(tl => {
                    if (!state[tl.id]) state[tl.id] = []
                }
            )
        })
    }
})

export const tasksReducer = slice.reducer
export const {removeTaskAC, addTaskAC, updateTaskAC, setTasksAC, changeTasksEntityStatusAC} = slice.actions

export const fetchTaskTC = (todoListId: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsApi.getTasks(todoListId)
        .then(res => {
            dispatch(setTasksAC({todoListId, tasks: res.data.items}))
            dispatch(setAppStatusAC({status: "succeeded"}))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const removeTaskTC = (todoListId: string, taskId: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    dispatch(changeTasksEntityStatusAC({todoListId, taskId, entityStatus: "loading"}))
    todoListsApi.deleteTask(todoListId, taskId)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(removeTaskAC({taskId, todoListId}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const addTaskTC = (todoListId: string, title: string): AppThunkType => dispatch => {
    dispatch(setAppStatusAC({status: "loading"}))
    todoListsApi.createTask(todoListId, title)
        .then(res => {
            if (res.data.resultCode === 0) {
                dispatch(addTaskAC({task: res.data.data.item}))
                dispatch(setAppStatusAC({status: "succeeded"}))
            } else {
                handleServerAppError(res.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const updateTaskTC = (taskId: string, model: UpdateTaskDomainModelType, todoListId: string): AppThunkType =>

    (dispatch,
     getState: () => AppRootStateType) => {
        dispatch(setAppStatusAC({status: "loading"}))
        const allAppTasks = getState().tasks
        const tasksCurrentTodoList = allAppTasks[todoListId]
        const currentTask = tasksCurrentTodoList.find(t => t.id === taskId)
        if (currentTask) {
            todoListsApi.updateTask(todoListId, taskId, {
                title: currentTask.title,
                status: currentTask.status,
                deadline: currentTask.deadline,
                description: currentTask.description,
                priority: TaskPriorities.Low,
                startDate: currentTask.startDate,
                ...model
            })
                .then(res => {
                    if (res.data.resultCode === 0) {
                        dispatch(updateTaskAC({taskId, model, todoListId}))
                        dispatch(setAppStatusAC({status: "succeeded"}))
                    } else {
                        handleServerAppError(res.data, dispatch)
                    }
                })
                .catch(error => {
                    handleServerNetworkError(error, dispatch)
                })
        }
    }

