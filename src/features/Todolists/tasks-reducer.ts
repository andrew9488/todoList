import {AddTodoListActionType, RemoveTodoListActionType, SetTodoListsActionType} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses, TaskType, todoListsApi} from "../../api/todolist-api";
import {AppRootStateType, AppThunkType} from "../../app/store";

type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
type SetTasksActionType = ReturnType<typeof setTasksAC>

export type TasksActionsType =
    RemoveTaskActionType
    | AddTaskActionType
    | UpdateTaskActionType
    | AddTodoListActionType
    | RemoveTodoListActionType
    | SetTodoListsActionType
    | SetTasksActionType

type UpdateTaskDomainModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}

export type TasksStateType = {
    [key: string]: Array<TaskType>
}

let initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: TasksActionsType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].filter(t => t.id !== action.taskId)
            }
        }
        case "ADD-TASK": {
            return {
                ...state,
                [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]
            }
        }
        case "UPDATE-TASK": {
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todoList.id]: []
            }
        }
        case "REMOVE-TODOLIST": {
            let stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        }
        case "SET-TODOLISTS": {
            const stateCopy = {...state}
            action.todoLists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "SET-TASKS": {
            return {
                ...state,
                [action.todoListId]: action.tasks
            }
        }
        default:
            return state
    }
}

export const removeTaskAC = (taskId: string, todoListId: string) =>
    ({type: "REMOVE-TASK", taskId: taskId, todoListId: todoListId} as const)

export const addTaskAC = (task: TaskType) => ({type: "ADD-TASK", task} as const)

export const updateTaskAC = (taskId: string, model: UpdateTaskDomainModelType, todoListId: string) =>
    ({type: "UPDATE-TASK", taskId, model, todoListId} as const)

export const setTasksAC = (todoListId: string, tasks: Array<TaskType>) =>
    ({type: "SET-TASKS", todoListId, tasks} as const)

export const fetchTaskTC = (todoListId: string): AppThunkType => dispatch => {
    todoListsApi.getTasks(todoListId)
        .then(res => {
            dispatch(setTasksAC(todoListId, res.data.items))
        })
}

export const removeTaskTC = (todoListId: string, taskId: string): AppThunkType => dispatch => {
    todoListsApi.deleteTask(todoListId, taskId)
        .then(() => {
            dispatch(removeTaskAC(taskId, todoListId))
        })
}

export const addTaskTC = (todoListId: string, title: string): AppThunkType => dispatch => {
    todoListsApi.createTask(todoListId, title)
        .then(res => {
            dispatch(addTaskAC(res.data.data.item))
        })
}

export const updateTaskTC = (taskId: string, model: UpdateTaskDomainModelType, todoListId: string): AppThunkType =>

    (dispatch,
     getState: () => AppRootStateType) => {

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
                .then(() => {
                    dispatch(updateTaskAC(taskId, model, todoListId))
                })
        }
    }

