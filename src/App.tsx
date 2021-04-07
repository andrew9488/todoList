import React, {useCallback} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoListActionCreator,
    changeFilterTodoListActionCreator,
    changeTodoListTitleActionCreator, CommonTodoListType,
    removeTodoListActionCreator,
    FilterValuesType
} from "./state/todolists-reducer";
import {
    addTaskActionCreator,
    changeTaskStatusActionCreator,
    changeTaskTitleActionCreator,
    removeTaskActionCreator,
    TasksStateType
} from "./state/tasks-reducer";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./state/store";
import {TaskStatuses} from "./api/todolist-api";


function App() {

    let todoLists: Array<CommonTodoListType> = useSelector<AppRootStateType, Array<CommonTodoListType>>(state => state.todoLists)
    let tasks: TasksStateType = useSelector<AppRootStateType, TasksStateType>(state => state.tasks)

    const dispatch = useDispatch()

    //BLL
    // const todoListId1 = v1();
    // const todoListId2 = v1();

    /*const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
        {id: todoListId1, title: "What to learn", filter: "all"},
        {id: todoListId2, title: "What to buy", filter: "all"},
    ]);

    const [tasks, dispatchToTasks] = useReducer(tasksReducer, {
        [todoListId1]: [
            {id: v1(), title: "HTML&CSS", isDone: true},
            {id: v1(), title: "JS", isDone: true},
            {id: v1(), title: "React", isDone: false},
            {id: v1(), title: "Redux", isDone: false},
            {id: v1(), title: "FindJob", isDone: false},
        ],
        [todoListId2]: [
            {id: v1(), title: "Vegetables", isDone: true},
            {id: v1(), title: "Milk", isDone: true},
            {id: v1(), title: "Cheese", isDone: false},
            {id: v1(), title: "Bread", isDone: false},
            {id: v1(), title: "Meal", isDone: false},],
    })*/

    const removeTask = useCallback((taskId: string, todoListId: string) => { // функция удаления таски
        dispatch(removeTaskActionCreator(taskId, todoListId))
    }, [dispatch])

    const addTask = useCallback((taskTitle: string, todoListId: string) => { //функция добавления таски

        dispatch(addTaskActionCreator(taskTitle, todoListId))
    }, [dispatch])

    const changeTaskTitle = useCallback((taskId: string, title: string, todoListId: string) => {
        dispatch(changeTaskTitleActionCreator(taskId, title, todoListId))
    }, [dispatch])

    const changeStatus = useCallback((taskId: string, status: TaskStatuses, todoListId: string) => {
        dispatch(changeTaskStatusActionCreator(taskId, status, todoListId))
    }, [dispatch])


    const removeTodoList = useCallback((todoListId: string) => {
        let action = removeTodoListActionCreator(todoListId)
        dispatch(action)
    }, [dispatch])

    const addTodoList = useCallback((newTitle: string) => {
        let action = addTodoListActionCreator(newTitle)
        dispatch(action)
    }, [dispatch])

    const changeFilter = useCallback((todoListId: string, newFilterValue: FilterValuesType) => { //функция фильтрации таски
        dispatch(changeFilterTodoListActionCreator(todoListId, newFilterValue))
    }, [dispatch])

    const changeTodoListTitle = useCallback((newTitle: string, todoListId: string) => {
        dispatch(changeTodoListTitleActionCreator(newTitle, todoListId))
    }, [dispatch])

    //UI
    return (
        <div className="App">
            <AppBar position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
            <Container fixed>
                <Grid container style={{padding: "10px 0"}}>
                    <Paper style={{padding: "5px"}}
                           elevation={3}>
                        <AddItemForm addItem={addTodoList} title={"TodoList title"}/>
                    </Paper>
                </Grid>
                <Grid container spacing={3}>
                    {
                        todoLists.map(tl => {
                            let allTaskTodoList=tasks[tl.id]
                            return (
                                <Grid item key={tl.id}>
                                    <Paper style={{padding: "7px"}}
                                           elevation={3}
                                    >
                                        <TodoList
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={allTaskTodoList}
                                            addTask={addTask}
                                            removeTodolist={removeTodoList}
                                            removeTask={removeTask}
                                            changeFilter={changeFilter}
                                            changeStatus={changeStatus}
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
            </Container>
        </div>
    );
}

export default App;

