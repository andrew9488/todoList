import React, {useEffect, useState} from 'react'
import {TaskPriorities, TaskStatuses, todoListsApi} from "../api/todolist-api";

export default {
    title: 'API'
}

export const GetTodoLists = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        todoListsApi.getTodoLists()
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTodoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListTitle = "New TodoList"
        todoListsApi.createTodoList(todoListTitle)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTodoList = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListId = "4a98bffd-1af6-4829-9efc-c1aab4a35050"
        todoListsApi.deleteTodoList(todoListId)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTodoListTitle = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListId = "7664cd3a-46a8-4ce4-981c-c40ab8761cb6"
        const todoListTitle = "What to done"
        todoListsApi.updateTodoListTitle(todoListId, todoListTitle)
            .then(res => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}

export const GetTasks = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListId = "bd8c8837-0b55-4276-b877-476206e438ff"
        todoListsApi.getTasks(todoListId)
            .then((res) => {
                setState(res.data)
            })

    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const CreateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListId = "bd8c8837-0b55-4276-b877-476206e438ff"
        const taskTitle = "OOP"
        todoListsApi.createTask(todoListId, taskTitle)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const UpdateTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListId = "7664cd3a-46a8-4ce4-981c-c40ab8761cb6"
        const taskId = "f003fd16-08d7-44c3-a207-373b12e80f18"
        const module = {
            title: "new Title",
            status: TaskStatuses.New,
            deadline: "",
            description: "",
            priority: TaskPriorities.Low,
            startDate: ""
        }
        todoListsApi.updateTask(todoListId, taskId,module)
            .then((res) => {
                setState(res.data.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}
export const DeleteTask = () => {
    const [state, setState] = useState<any>(null)
    useEffect(() => {
        const todoListId = "7664cd3a-46a8-4ce4-981c-c40ab8761cb6"
        const taskId = "23c789d4-9f88-4cee-827b-1edf92438d15"
        todoListsApi.deleteTask(todoListId, taskId)
            .then((res) => {
                setState(res.data)
            })
    }, [])

    return <div> {JSON.stringify(state)}</div>
}