import {TodoListDomainType} from "./todolists-reducer";
import {useSelector} from "react-redux";
import {useActions} from "../../bll/store";
import {TasksStateType} from "../Task/tasks-reducer";
import React, {useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Redirect} from "react-router-dom";
import {authSelectors} from "../Login/";
import {todoListsActions, todoListSelectors, TodoList} from "./index";
import {tasksSelectors} from "../Task";

type TodoListsPropsType = {
    demo?: boolean
}

export const TodoLists: React.FC<TodoListsPropsType> = ({demo = false}) => {

    let todoLists: Array<TodoListDomainType> = useSelector(todoListSelectors.todoListsSelector)
    let tasks: TasksStateType = useSelector(tasksSelectors.tasksSelector)
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
                <Paper style={{padding: "10px", width: "280px"}}
                       elevation={3}>
                    <AddItemForm addItem={addTodoListTC} title={"TodoList title"}/>
                </Paper>
            </Grid>
            <Grid container spacing={3} style={{flexWrap: "nowrap", overflowX: "scroll"}}>
                {
                    todoLists.map(tl => {
                        let allTaskTodoList = tasks[tl.id]
                        return (
                            <Grid item key={tl.id}>
                                <div style={{width: "300px"}}>
                                    <TodoList
                                        todoList={tl}
                                        tasks={allTaskTodoList}
                                        demo={demo}
                                    />
                                </div>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </>
    );
}