import axios from "axios";

type TodoListType = {
    addedDate: string
    id: string
    order: number
    title: string
}

type ResponseType<T> = {
    fieldsErrors: string[]
    messages: string[]
    resultCode: number
    data: T
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
        return instance.post<ResponseType<{items: TodoListType}>>('todo-lists', {title: title})
    },
    deleteTodoList(todoListId: string) {
        return instance.delete<ResponseType<{}>>(`todo-lists/${todoListId}`)
    },
    updateTodoListTitle(todoListId: string, title: string) {
        return instance.put<ResponseType<{}>>(`todo-lists/${todoListId}`, {title: title})
    }
}