import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "./Task/Task";
import {TaskStatuses, TaskType} from "../../../api/todolist-api";
import {FilterValuesType, TodoListDomainType} from "../todolists-reducer";
import {fetchTaskTC} from "../tasks-reducer";
import {useDispatch} from "react-redux";

type TodoListPropsType = {
    todoList: TodoListDomainType
    tasks: Array<TaskType>
    addTask: (taskTitle: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
    changeFilter: (todoListId: string, newFilterValue: FilterValuesType) => void
    changeTaskStatus: (taskId: string, statuses: TaskStatuses, todoListId: string) => void
    removeTodolist: (todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    changeTodoListTitle: (title: string, todoListId: string) => void
    demo?: boolean
}

export const TodoList: React.FC<TodoListPropsType> = React.memo(({demo = false, ...props}) => {

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo) {
            return;
        }
        dispatch(fetchTaskTC(props.todoList.id))
    }, [])

    let allTaskForTodoList = props.tasks
    let taskForTodoList = allTaskForTodoList

    if (props.todoList.filter === "active") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todoList.filter === "completed") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.Completed)
    }

    const addTask = useCallback((title: string) => props.addTask(title, props.todoList.id), [props.addTask, props.todoList.id])
    const changeTodoListTitle = useCallback((newTitle: string) => {
        props.changeTodoListTitle(newTitle, props.todoList.id)
    }, [props.changeTodoListTitle, props.todoList.id])

    const removeTodoList = useCallback(() => {
        props.removeTodolist(props.todoList.id)
    }, [props.removeTodolist, props.todoList.id])

    const all = useCallback(() => props.changeFilter(props.todoList.id, "all"), [props.changeFilter, props.todoList.id])
    const active = useCallback(() => props.changeFilter(props.todoList.id, "active"), [props.changeFilter, props.todoList.id])
    const completed = useCallback(() => props.changeFilter(props.todoList.id, "completed"), [props.changeFilter, props.todoList.id])


    const tasks = taskForTodoList.map(t => {
        return (
            <Task key={t.id} task={t} changeTaskStatus={props.changeTaskStatus} changeTaskTitle={props.changeTaskTitle}
                  removeTask={props.removeTask} todoListId={props.todoList.id} />
        );
    })

    return (
        <div>
            <h3><EditableSpan title={props.todoList.title} changeItem={changeTodoListTitle}/>
                <IconButton onClick={removeTodoList} disabled={props.todoList.entityStatus === "loading"}>
                    <Delete/>
                </IconButton>
            </h3>
            <AddItemForm addItem={addTask} title={"Task title"} disabled={props.todoList.entityStatus === "loading"}/>
            <ul style={{listStyle: "none", paddingLeft: "0"}}>
                {tasks}
            </ul>
            <div>
                <Button
                    color={props.todoList.filter === "all" ? "secondary" : "primary"}
                    variant={"contained"}
                    size={"small"}
                    onClick={all}>All
                </Button>
                <Button
                    color={props.todoList.filter === "active" ? "secondary" : "primary"}
                    variant={"contained"}
                    size={"small"}
                    onClick={active}>Active
                </Button>
                <Button
                    color={props.todoList.filter === "completed" ? "secondary" : "primary"}
                    variant={"contained"}
                    size={"small"}
                    onClick={completed}>Completed
                </Button>
            </div>
        </div>

    );
})


