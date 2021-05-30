import React, {useCallback, useEffect} from "react";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../../components/AddItemForm/AddItemForm";
import {EditableSpan} from "../../../components/EditableSpan/EditableSpan";
import {Button, IconButton, Paper} from "@material-ui/core";
import {Delete} from "@material-ui/icons";
import {TaskStatuses} from "../../../api/todolist-api";
import {TodoListDomainType} from "../todolists-reducer";
import {TaskDomainType} from "../../Task/tasks-reducer";
import {todoListsActions} from "../index";
import {Task, tasksActions} from "../../Task";
import {useActions, useAppDispatch} from "../../../utils/utils-redux";

type TodoListPropsType = {
    todoList: TodoListDomainType
    tasks: Array<TaskDomainType>
    demo?: boolean
}

export const TodoList: React.FC<TodoListPropsType> = React.memo(({demo = false, ...props}) => {

    const {changeTodoListTitle, removeTodoList, changeFilterTodoList} = useActions(todoListsActions)
    const {fetchTasks} = useActions(tasksActions)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (demo) {
            return;
        }
        fetchTasks(props.todoList.id)
    }, [])

    let allTaskForTodoList = props.tasks
    let taskForTodoList = allTaskForTodoList

    if (props.todoList.filter === "active") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.New)
    }
    if (props.todoList.filter === "completed") {
        taskForTodoList = allTaskForTodoList.filter(t => t.status === TaskStatuses.Completed)
    }

    const changeTodoListTitleCallback = useCallback((newTitle: string) => {
        changeTodoListTitle({title: newTitle, todoListId: props.todoList.id})
    }, [props.todoList.id,changeTodoListTitle] )
    const removeTodoListCallback = useCallback(() => {
        removeTodoList(props.todoList.id)
    }, [props.todoList.id, removeTodoList])

    const all = useCallback(() =>
        changeFilterTodoList({id: props.todoList.id, filter: "all"}), [props.todoList.id])
    const active = useCallback(() =>
        changeFilterTodoList({id: props.todoList.id, filter: "active"}), [props.todoList.id])
    const completed = useCallback(() =>
        changeFilterTodoList({id: props.todoList.id, filter: "completed"}), [props.todoList.id])

    const addTaskCallback = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        let thunk = tasksActions.addTask({title, todoListId: props.todoList.id})
        const action = await dispatch(thunk)
        if (tasksActions.addTask.rejected.match(action)) {
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
            <IconButton style={{position: "absolute", right: "9px", top: "3px"}} onClick={removeTodoListCallback}
                        disabled={props.todoList.entityStatus === "loading"}>
                <Delete/>
            </IconButton>
            <h3>
                <EditableSpan title={props.todoList.title} changeItem={changeTodoListTitleCallback}
                              disabled={props.todoList.entityStatus === "loading"}/>
            </h3>
            <AddItemForm addItem={addTaskCallback} title={"Task title"}
                         disabled={props.todoList.entityStatus === "loading"}/>
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


