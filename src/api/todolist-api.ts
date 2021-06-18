import axios from "axios";

export type TodoListType = {
    addedDate: string
    id: string
    order: number
    title: string
}

export enum ResultStatusCode {
    success = 0,
    error = 1
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

export type UpdateTaskModelType = {
    title: string
    description: string
    status: TaskStatuses
    priority: TaskPriorities
    startDate: string
    deadline: string
}

export type FieldsErrorsType = { field: string, error: string };
export type ResponseType<D = {}> = {
    fieldsErrors: Array<FieldsErrorsType>
    messages: string[]
    resultCode: number
    data: D
}

type ResponseTaskType = {
    error: string | null
    totalCount: number
    items: Array<TaskType>
}

export type LoginParamsType = {
    email: string
    password: string
    rememberMe?: boolean
    captcha?: string
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
        return instance.post<ResponseType<{ item: TodoListType }>>('todo-lists', {title: title})
    },
    deleteTodoList(todoListId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}`)
    },
    updateTodoListTitle(todoListId: string, title: string) {
        return instance.put<ResponseType>(`todo-lists/${todoListId}`, {title: title})
    },
    getTasks(todoListId: string) {
        return instance.get<ResponseTaskType>(`todo-lists/${todoListId}/tasks`)
    },
    createTask(todoListId: string, title: string) {
        return instance.post<ResponseType<{ item: TaskType }>>(`todo-lists/${todoListId}/tasks`, {title: title})
    },
    updateTask(todoListId: string, taskId: string, model: UpdateTaskModelType) {
        return instance.put<ResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`, model)
    },
    deleteTask(todoListId: string, taskId: string) {
        return instance.delete<ResponseType>(`todo-lists/${todoListId}/tasks/${taskId}`)
    }
}

export const authAPI = {
    me() {
        return instance.get<ResponseType<{ data: LoginParamsType }>>(`auth/me`)
    },
    login(data: LoginParamsType) {
        return instance.post<ResponseType<{ userId: number }>>(`auth/login`, data)
    },
    logout() {
        return instance.delete<ResponseType>(`auth/login`)
    }
}
