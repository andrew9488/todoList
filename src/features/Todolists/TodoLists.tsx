import {TodoListDomainType} from "./todolists-reducer";
import {useSelector} from "react-redux";
import {useActions} from "../../bll/store";
import {TasksStateType} from "../Task/tasks-reducer";
import React, {useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TodoList} from "./index";
import {Redirect} from "react-router-dom";
import {authSelectors} from "../Login/";
import {todoListsActions, todoListSelectors} from "./index";
import {tasksSectors} from "../Task";

type TodoListsPropsType = {
    demo?: boolean
}

export const TodoLists: React.FC<TodoListsPropsType> = ({demo = false}) => {

    let todoLists: Array<TodoListDomainType> = useSelector(todoListSelectors.todoListsSelector)
    let tasks: TasksStateType = useSelector(tasksSectors.tasksSelector)
    const isLoggedIn = useSelector(authSelectors.isLoggedInSelector)

    const {fetchTodoListsTC, addTodoListTC} = useActions(todoListsActions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodoListsTC()
    }, [])

    if (!isLoggedIn) {
        return <Redirect to="/login"/>
    }

    return (
        <>
            <Grid container style={{padding: "10px 0"}}>
                <Paper style={{padding: "5px"}}
                       elevation={3}>
                    <AddItemForm addItem={addTodoListTC} title={"TodoList title"}/>
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