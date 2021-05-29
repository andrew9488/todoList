import React, {useCallback, useEffect} from "react";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {Task} from "../../Task";
import {TaskStatuses} from "../../../api/todolist-api";
import {TodoListDomainType} from "../todolists-reducer";
import {TaskDomainType} from "../../Task/tasks-reducer";
import {useActions} from "../../../bll/store";
import {todoListsActions} from "../index";
import {tasksActions} from "../../Task";

type TodoListPropsType = {
    todoList: TodoListDomainType
    tasks: Array<TaskDomainType>
    demo?: boolean
}

export const TodoList: React.FC<TodoListPropsType> = React.memo(({demo = false, ...props}) => {

    const {changeTodoListTitleTC, removeTodoListTC, changeFilterTodoListAC} = useActions(todoListsActions)
    const {fetchTasksTC, addTaskTC, removeTaskTC, updateTaskTC} = useActions(tasksActions)

    useEffect(() => {
        if (demo) {
            return;
        }
        fetchTasksTC(props.todoList.id)
    }, [])

    let allTaskForTodoList = props.tasks
    let taskForTodoList = allTaskForTodoList

    if (props.todoList.filter === "active") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todoList.filter === "completed") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.Completed)
    }

    const addTask = useCallback((title: string) => addTaskTC({
        title: title,
        todoListId: props.todoList.id
    }), [props.todoList.id])
    const changeTodoListTitle = useCallback((newTitle: string) => {
        changeTodoListTitleTC({title: newTitle, todoListId: props.todoList.id})
    }, [props.todoList.id])
    const removeTodoList = useCallback(() => {
        removeTodoListTC(props.todoList.id)
    }, [props.todoList.id])
    const all = useCallback(() => changeFilterTodoListAC({id: props.todoList.id, filter: "all"}), [props.todoList.id])
    const active = useCallback(() => changeFilterTodoListAC({
        id: props.todoList.id,
        filter: "active"
    }), [props.todoList.id])
    const completed = useCallback(() => changeFilterTodoListAC({
        id: props.todoList.id,
        filter: "completed"
    }), [props.todoList.id])

    const changeTaskStatus = useCallback(function (id: string, status: TaskStatuses, todoListId: string) {
        updateTaskTC({taskId: id, model: {status}, todoListId: todoListId})
    }, [])
    const changeTaskTitle = useCallback(function (id: string, newTitle: string, todoListId: string) {
        updateTaskTC({taskId: id, model: {title: newTitle}, todoListId: todoListId})
    }, [])
    const removeTask = useCallback(function (id: string, todoListId: string) {
        removeTaskTC({todoListId, taskId: id})
    }, [])


    const tasks = taskForTodoList.map(t => {
        return (
            <Task key={t.id} task={t} changeTaskStatus={changeTaskStatus} changeTaskTitle={changeTaskTitle}
                  removeTask={removeTask} todoListId={props.todoList.id} disabled={t.entityStatus === "loading"}/>
        );
    })

    return (
        <div>
            <h3><EditableSpan title={props.todoList.title} changeItem={changeTodoListTitle}
                              disabled={props.todoList.entityStatus === "loading"}/>
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


