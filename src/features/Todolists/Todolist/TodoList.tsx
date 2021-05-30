import React, {useCallback, useEffect} from "react";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "../../../api/todolist-api";
import {TodoListDomainType} from "../todolists-reducer";
import {TaskDomainType} from "../../Task/tasks-reducer";
import {useActions} from "../../../bll/store";
import {todoListsActions} from "../index";
import {tasksActions, Task} from "../../Task";
import {useDispatch} from "react-redux";

type TodoListPropsType = {
    todoList: TodoListDomainType
    tasks: Array<TaskDomainType>
    demo?: boolean
}

export const TodoList: React.FC<TodoListPropsType> = React.memo(({demo = false, ...props}) => {

    const {changeTodoListTitleTC, removeTodoListTC, changeFilterTodoListAC} = useActions(todoListsActions)
    const {fetchTasksTC} = useActions(tasksActions)
    const dispatch = useDispatch()

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

    const changeTodoListTitle = useCallback((newTitle: string) => {
        changeTodoListTitleTC({title: newTitle, todoListId: props.todoList.id})
    }, [props.todoList.id])
    const removeTodoList = useCallback(() => {
        removeTodoListTC(props.todoList.id)
    }, [props.todoList.id])

    const all = useCallback(() =>
        changeFilterTodoListAC({id: props.todoList.id, filter: "all"}), [props.todoList.id])
    const active = useCallback(() =>
        changeFilterTodoListAC({id: props.todoList.id, filter: "active"}), [props.todoList.id])
    const completed = useCallback(() =>
        changeFilterTodoListAC({id: props.todoList.id, filter: "completed"}), [props.todoList.id])

    const addTask = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        let thunk = tasksActions.addTaskTC({title, todoListId: props.todoList.id})
        const action: any = await dispatch(thunk)
        if (tasksActions.addTaskTC.rejected.match(action)) {
            if (action.payload?.errors?.length) {
                const error = action.payload?.errors[0]
                helper.setError(error)
            } else {
                helper.setError("Some error")
            }
        } else {
            helper.setValue("")
        }
    }, [props.todoList.id])

    const tasks = taskForTodoList.map(t => {
        return (
            <Task key={t.id} task={t} todoListId={props.todoList.id} disabled={t.entityStatus === "loading"}/>
        );
    })

    return (
        <Paper style={{padding: "10px", position: "relative"}}
               elevation={3}>
            <IconButton style={{position: "absolute", right: "9px", top: "3px"}} onClick={removeTodoList}
                        disabled={props.todoList.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
            <h3>
                <EditableSpan title={props.todoList.title} changeItem={changeTodoListTitle}
                              disabled={props.todoList.entityStatus === "loading"}/>
            </h3>
            <AddItemForm addItem={addTask} title={"Task title"} disabled={props.todoList.entityStatus === "loading"}/>
            <ul style={{listStyle: "none", paddingLeft: "0"}}>
                {!tasks.length && <span style={{color: "gray", marginLeft: "15px"}}>No tasks</span>}
                {tasks}
            </ul>
            <div style={{display: "flex", justifyContent: "space-evenly"}}>
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
        </Paper>
    );
})


