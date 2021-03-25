import {TasksStateType, TaskType} from "../AppWithRedux";
import {v1} from "uuid";
import {AddTodoListActionType, RemoveTodoListActionType} from "./todolists-reducer";

type RemoveTaskActionType = {
    type: "REMOVE-TASK"
    taskId: string
    todoListId: string

}

type AddTaskActionType = {
    type: "ADD-TASK"
    title: string
    todoListId: string
}

type ChangeTaskStatusActionType = {
    type: "CHANGE-TASK-STATUS"
    taskId: string
    todoListId: string
    isDone: boolean
}

type ChangeTaskTitleActionType = {
    type: "CHANGE-TASK-TITLE"
    taskId: string
    todoListId: string
    title: string
}

export type ActionsTodoListType =
    RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | ChangeTaskTitleActionType
    | AddTodoListActionType
    | RemoveTodoListActionType

let initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsTodoListType): TasksStateType => {
    switch (action.type) {
        case "REMOVE-TASK": {
            let stateCopy = {...state}
            let todoListTasks = stateCopy[action.todoListId]
            stateCopy[action.todoListId] = todoListTasks.filter(t => t.id !== action.taskId)
            return stateCopy
        }
        case "ADD-TASK": {
            let stateCopy = {...state}
            let newTask: TaskType = {
                id: v1(),
                title: action.title,
                isDone: false
            }
            let todoListTasks = stateCopy[action.todoListId]
            stateCopy[action.todoListId] = [newTask, ...todoListTasks]
            return stateCopy
        }
        case "CHANGE-TASK-STATUS": {
            /*let stateCopy = {...state}
            let todoListTasks = stateCopy[action.todoListId]
            let task: TaskType | undefined = todoListTasks.find(t => t.id === action.taskId)
            if (task) {
                task.isDone = action.isDone
            }*/
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => {
                    if (t.id === action.taskId) {
                        return {...t, isDone: action.isDone}
                    } else {
                        return t
                    }
                })
            }
        }
        case "CHANGE-TASK-TITLE": {
            /*let stateCopy = {...state}
            let todoListTasks = stateCopy[action.todoListId]
            let task: TaskType | undefined = todoListTasks.find(t => t.id === action.taskId)
            if (task) {
                task.title = action.title
            }*/
            return {
                ...state,
                [action.todoListId]: state[action.todoListId].map(t => {
                    if (t.id === action.taskId) {
                        return {...t, title: action.title}
                    } else {
                        return t
                    }
                })
            }
        }
        case "ADD-TODOLIST": {
            return {
                ...state,
                [action.todoListId]: []
            }
        }
        case "REMOVE-TODOLIST": {
            let stateCopy = {...state}
            delete stateCopy[action.todoListId]
            return stateCopy
        }
        default:
            return state
    }
}
export const removeTaskActionCreator = (taskId: string,
                                        todoListId: string): RemoveTaskActionType => {
    return {
        type: "REMOVE-TASK",
        taskId: taskId,
        todoListId: todoListId
    }
}

export const addTaskActionCreator = (title: string,
                                     todoListId: string): AddTaskActionType => {
    return {
        type: "ADD-TASK",
        title,
        todoListId
    }
}

export const changeTaskStatusActionCreator = (taskId: string,
                                              isDone: boolean,
                                              todoListId: string): ChangeTaskStatusActionType => {
    return {
        type: "CHANGE-TASK-STATUS",
        taskId,
        todoListId,
        isDone
    }
}

export const changeTaskTitleActionCreator = (taskId: string,
                                             title: string,
                                             todoListId: string): ChangeTaskTitleActionType => {
    return {
        type: "CHANGE-TASK-TITLE",
        taskId,
        todoListId,
        title
    }
}

