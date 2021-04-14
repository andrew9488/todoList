import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {FilterValuesType} from "../todolists-reducer";
import {fetchTaskTC} from "../tasks-reducer";
import {useDispatch} from "react-redux";

type TodoListPropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    addTask: (taskTitle: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (todoListId: string, newFilterValue: FilterValuesType) => void
    changeTaskStatus: (taskId: string, statuses: TaskStatuses, todoListId: string) => void
    filter: FilterValuesType
    removeTodolist: (todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
}

export const TodoList: React.FC<TodoListPropsType> = React.memo((props) => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTaskTC(props.id))
    }, [])

    let allTaskForTodoList = props.tasks
    let taskForTodoList = allTaskForTodoList

    if (props.filter === "active") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.New)
    }
    if (props.filter === "completed") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.Completed)
    }

    const addTask = useCallback((title: string) => props.addTask(title, props.id), [props.addTask, props.id])
    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(newTitle, props.id)
    }, [props.changeTodoListTitle, props.id])

    const removeTodoList = useCallback(() => {
        props.removeTodolist(props.id)
    }, [props.removeTodolist, props.id])

    const all = useCallback(() => props.changeFilter(props.id, "all"), [props.changeFilter, props.id])
    const active = useCallback(() => props.changeFilter(props.id, "active"), [props.changeFilter, props.id])
    const completed = useCallback(() => props.changeFilter(props.id, "completed"), [props.changeFilter, props.id])


    const tasks = taskForTodoList.map(t => {
        return (
            <Task key={t.id} task={t} changeTaskStatus={props.changeTaskStatus} changeTaskTitle={props.changeTaskTitle}
                  removeTask={props.removeTask} todoListId={props.id}/>
        );
    })

    return (
        <div>
            <h3><EditableSpan title={props.title} changeItem={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} title={"Task title"}/>
            <ul style={{listStyle: "none", paddingLeft: "0"}}>
                {tasks}
            </ul>
            <div>
                <Button
                    color={props.filter === "all" ? "secondary" : "primary"}
                    variant={"contained"}
                    size={"small"}
                    onClick={all}>All
                </Button>
                <Button
                    color={props.filter === "active" ? "secondary" : "primary"}
                    variant={"contained"}
                    size={"small"}
                    onClick={active}>Active
                </Button>
                <Button
                    color={props.filter === "completed" ? "secondary" : "primary"}
                    variant={"contained"}
                    size={"small"}
                    onClick={completed}>Completed
                </Button>
            </div>
        </div>

    );
})


