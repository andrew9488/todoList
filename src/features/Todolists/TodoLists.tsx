import {
    addTodoListTC,
    changeFilterTodoListAC,
    changeTodoListTitleTC,
    fetchTodoListsTC,
    FilterValuesType,
    removeTodoListTC,
    TodoListDomainType
} from "./todolists-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "../../app/store";
import {addTask, TasksStateType, updateTask} from "./tasks-reducer";
import React, {useCallback, useEffect} from "react";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";
import {Redirect} from "react-router-dom";

type TodoListsPropsType = {
    demo?: boolean
}

export const TodoLists: React.FC<TodoListsPropsType> = ({demo = false}) => {

    let todoLists: Array<TodoListDomainType> = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    let tasks: TasksStateType = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const dispatch = useDispatch()

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        dispatch(fetchTodoListsTC())
    }, [])

    const removeTask = useCallback((taskId: string, todoListId: string) => { // функция удаления таски
        dispatch(removeTask( taskId, todoListId))
    }, [dispatch])
    const addTask = useCallback((taskTitle: string, todoListId: string) => { //функция добавления таски
        dispatch(addTask(todoListId, taskTitle))
    }, [dispatch])
    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        dispatch(updateTask({taskId, model: {title}, todoListId}))
    }, [dispatch])
    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTask({taskId, model: {status}, todoListId}))
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListTC(todoListId))
    }, [dispatch])
    const addTodoList = useCallback((newTitle: string) => {
        dispatch(addTodoListTC(newTitle))
    }, [dispatch])
    const changeFilter = useCallback((todoListId: string, newFilterValue: FilterValuesType) => { //функция фильтрации таски
        dispatch(changeFilterTodoListAC({id: todoListId, filter: newFilterValue}))
    }, [dispatch])
    const changeTodoListTitle = useCallback((newTitle: string, todoListId: string) => {
        dispatch(changeTodoListTitleTC(todoListId, newTitle))
    }, [dispatch])

    if (!isLoggedIn) {
        return <Redirect to="/login"/>
    }

    return (
        <>
            <Grid container style={{padding: "10px 0"}}>
                <Paper style={{padding: "5px"}}
                       elevation={3}>
                    <AddItemForm addItem={addTodoList} title={"TodoList title"}/>
                </Paper>
            </Grid>
            <Grid container spacing={3}>
                {
                    todoLists.map(tl => {
                        let allTaskTodoList = tasks[tl.id]
                        return (
                            <Grid item key={tl.id}>
                                <Paper style={{padding: "7px"}}
                                       elevation={3}>
                                    <TodoList
                                        todoList={tl}
                                        tasks={allTaskTodoList}
                                        addTask={addTask}
                                        removeTodolist={removeTodoList}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        changeTaskStatus={changeTaskStatus}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodoListTitle={changeTodoListTitle}
                                        demo={demo}
                                    />
                                </Paper>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
}