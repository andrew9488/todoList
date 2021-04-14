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
import {addTaskTC, removeTaskTC, TasksStateType, updateTaskTC} from "./tasks-reducer";
import React, {useCallback, useEffect} from "react";
import {TaskStatuses} from "../../api/todolist-api";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./Todolist/TodoList";

export const TodoLists: React.FC = () => {

    let todoLists: Array<TodoListDomainType> = useSelector<AppRootStateType, Array<TodoListDomainType>>(state => state.todoLists)
    let tasks: TasksStateType = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchTodoListsTC())
    }, [])

    const removeTask = useCallback((taskId: string, todoListId: string) => { // функция удаления таски
        dispatch(removeTaskTC(todoListId, taskId))
    }, [dispatch])
    const addTask = useCallback((taskTitle: string, todoListId: string) => { //функция добавления таски
        dispatch(addTaskTC(todoListId, taskTitle))
    }, [dispatch])
    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        dispatch(updateTaskTC(taskId, {title}, todoListId))
    }, [dispatch])
    const changeTaskStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(updateTaskTC(taskId, {status}, todoListId))
    }, [dispatch])

    const removeTodoList = useCallback((todoListId: string) => {
        dispatch(removeTodoListTC(todoListId))
    }, [dispatch])
    const addTodoList = useCallback((newTitle: string) => {
        dispatch(addTodoListTC(newTitle))
    }, [dispatch])
    const changeFilter = useCallback((todoListId: string, newFilterValue: FilterValuesType) => { //функция фильтрации таски
        dispatch(changeFilterTodoListAC(todoListId, newFilterValue))
    }, [dispatch])
    const changeTodoListTitle = useCallback((newTitle: string, todoListId: string) => {
        dispatch(changeTodoListTitleTC(todoListId, newTitle))
    }, [dispatch])

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
                                        id={tl.id}
                                        title={tl.title}
                                        tasks={allTaskTodoList}
                                        addTask={addTask}
                                        removeTodolist={removeTodoList}
                                        removeTask={removeTask}
                                        changeFilter={changeFilter}
                                        changeTaskStatus={changeTaskStatus}
                                        filter={tl.filter}
                                        changeTaskTitle={changeTaskTitle}
                                        changeTodoListTitle={changeTodoListTitle}
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