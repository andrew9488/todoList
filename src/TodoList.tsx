import React, {ChangeEvent, useState, KeyboardEvent} from "react";
import {FilterValuesType, TaskType} from "./App";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    addTask: (taskTitle: string, todoListID: string) => void
    removeTask: (taskID: string, todoListID: string) => void
    changeFilter: (newFilterValue: FilterValuesType, todoListID: string) => void
    changeStatus: (taskID: string, isDone: boolean, todoListID: string) => void
    filter: FilterValuesType
    removeTodolist: (todoListID: string) => void
}

function TodoList(props: TodoListPropsType) {
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const all = () => props.changeFilter("all", props.id)
    const active = () => props.changeFilter("active", props.id)
    const completed = () => props.changeFilter("completed", props.id)

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(null)
    }
    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") addTask()
    }
    const addTask = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addTask(trimmedTitle, props.id)
        } else {
            setError("Title is required!")
        }
        setTitle("")
    }

    const tasks = props.tasks.map(t => {
        const removeTask = () => props.removeTask(t.id, props.id)
        const changeStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeStatus(t.id, e.currentTarget.checked, props.id)

        return (
            <li key={t.id} className={t.isDone ? "is-done" : ""}>
                <input type="checkbox"
                       checked={t.isDone}
                       onChange={changeStatus}
                />
                <span>{t.title}</span>
                <button onClick={removeTask}>x</button>
            </li>
        )
    })

    /* let errorText = null
     if(error){
         errorText = <div className={"error-message"}>{error}</div>
     }*/

    return (
        <div>
            <h3>{props.title}<button onClick={()=> props.removeTodolist(props.id)}>x</button></h3>
            <div>
                <input placeholder="Enter a new task..."
                       value={title}
                       onChange={onChangeTitleHandler}
                       onKeyPress={onKeyPressHandler}
                       className={error ? "error" : ""}
                       onBlur={() => {
                           setError(null)
                       }}
                />
                <button onClick={addTask}>+</button>
                {/*{errorText}*/}
                {error && <div className={"error-message"}>{error}</div>}
            </div>
            <ul>
                {tasks}
            </ul>
            <div>
                <button
                    className={props.filter === "all" ? "active-filter" : ""}
                    onClick={all}>All
                </button>
                <button
                    className={props.filter === "active" ? "active-filter" : ""}
                    onClick={active}>Active
                </button>
                <button
                    className={props.filter === "completed" ? "active-filter" : ""}
                    onClick={completed}>Completed
                </button>
            </div>
        </div>

    );
}

export default TodoList;