import axios from "axios";

export type TodoListType = {
    addedDate: string
    id: string
    order: number
    title: string
}

export enum TaskStatuses {
    New = 0,
    InProgress = 1,
    Completed = 2,
    Draft = 3
}

export enum TaskPriorities {
    Low = 0,
    Middle = 1,
    High = 2,
    Urgently = 3,
    Later = 4
}

export type TaskType = {
    addedDate: string
    deadline: string
    description: string
    id: string
    order: number
    priority: TaskPriorities
    startDate: string
    status: TaskStatuses
    title: string
    todoListId: string
}

type ResponseTodoListType<D = {}> = {
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
    data: D
}

type ResponseTaskType = {
    error: string | null
    totalCount: number
    items: Array<TaskType>
}


const instance = axios.create({
        withCredentials: true,
        baseURL: "https://social-network.samuraijs.com/api/1.1/",
        headers: {
            "API-KEY": "daffbeb3-8fec-4c34-9d8d-6fcb41a16549"
        }
    }
)

export const todoListsApi = {
    getTodoLists() {
        return instance.get<Array<TodoListType>>('todo-lists')
    },
    createTodoList(title: string) {
        return instance.post<ResponseTodoListType<{ items: TodoListType }>>('todo-lists', {title: title})
    },
    deleteTodoList(todoListId: string) {
        return instance.delete<ResponseTodoListType>(`todo-lists/${todoListId}`)
    },
    updateTodoListTitle(todoListId: string, title: string) {
        return instance.put<ResponseTodoListType>(`todo-lists/${todoListId}`, {title: title})
    },
    getTasks(todoListId: string) {
        return instance.get<ResponseTaskType>(`todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, title: string) {
        return instance.post<ResponseTodoListType<{ item: TaskType }>>(`todo-lists/${todoListId}/tasks`, {title: title})
    },
    updateTaskTitle(todoListId: string, taskId: string, title: string) {
        return instance.put<ResponseTodoListType<{ item: TaskType }>>(`todo-lists/${todoListId}/tasks/${taskId}`, {title: title})
    },
    deleteTask(todoListId: string, taskId: string) {
        return instance.delete<ResponseTodoListType>(`todo-lists/${todoListId}/tasks/${taskId}`)
    }
}
