import React, {useReducer, useState} from 'react';
import './App.css';
import TodoList from "./TodoList";
import {v1} from "uuid";
import {AddItemForm} from "./AddItemForm";
import {AppBar, Button, Container, Grid, IconButton, Paper, Toolbar, Typography} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {
    addTodoListActionCreator,
    changeFilterTodoListActionCreator, changeTodoListTitleActionCreator,
    removeTodoListActionCreator,
    todoListsReducer
} from "./state/todolists-reducer";
import {
    addTaskActionCreator, changeTaskStatusActionCreator,
    changeTaskTitleActionCreator,
    removeTaskActionCreator,
    tasksReducer
} from "./state/tasks-reducer";

type TaskType = {
    id: string
    title: string
    isDone: boolean
}

type TodoListType = {
    id: string
    title: string
    filter: FilterValuesType
}

type TasksStateType = {
    [key: string]: Array<TaskType>
}

type FilterValuesType = "all" | "active" | "completed"

function AppWithUseReducers() {

    //BLL
    const todoListId1 = v1();
    const todoListId2 = v1();

    const [todoLists, dispatchToTodoLists] = useReducer(todoListsReducer, [
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
    })

    function removeTask(taskId: string, todoListId: string) { // функция удаления таски
        dispatchToTasks(removeTaskActionCreator(taskId, todoListId))
    }

    function addTask(taskTitle: string, todoListId: string) { //функция добавления таски

        dispatchToTasks(addTaskActionCreator(taskTitle, todoListId))
    }

    function changeTaskTitle(taskId: string, title: string, todoListId: string) {
        dispatchToTasks(changeTaskTitleActionCreator(taskId, title, todoListId))
    }


    function changeStatus(taskId: string, isDone: boolean, todoListId: string) {
        dispatchToTasks(changeTaskStatusActionCreator(taskId, isDone, todoListId))
    }


    function removeTodoList(todoListId: string) {
        let action = removeTodoListActionCreator(todoListId)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    function addTodoList(newTitle: string) {
        let action = addTodoListActionCreator(newTitle)
        dispatchToTodoLists(action)
        dispatchToTasks(action)
    }

    function changeFilter(todoListId: string, newFilterValue: FilterValuesType) { //функция фильтрации таски
        dispatchToTodoLists(changeFilterTodoListActionCreator(todoListId, newFilterValue))
    }

    function changeTodoListTitle(newTitle: string, todoListId: string) {
        dispatchToTodoLists(changeTodoListTitleActionCreator(newTitle, todoListId))

    }

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
                            let taskForTodoList = tasks[tl.id]
                            if (tl.filter === "active") {
                                taskForTodoList = tasks[tl.id].filter(t => !t.isDone)
                            }
                            if (tl.filter === "completed") {
                                taskForTodoList = tasks[tl.id].filter(t => t.isDone)
                            }
                            return (
                                <Grid item key={tl.id}>
                                    <Paper style={{padding: "7px"}}
                                           elevation={3}
                                    >
                                        <TodoList
                                            id={tl.id}
                                            title={tl.title}
                                            tasks={taskForTodoList}
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

