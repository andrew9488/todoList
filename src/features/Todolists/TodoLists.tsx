import {TodoListDomainType} from "./todolists-reducer";
import {useSelector} from "react-redux";
import {TasksStateType} from "../Task/tasks-reducer";
import React, {useCallback, useEffect} from "react";
import {Grid, Paper} from "@material-ui/core";
import {AddItemForm, AddItemFormSubmitHelperType} from "../../components/AddItemForm/AddItemForm";
import {Redirect} from "react-router-dom";
import {authSelectors} from "../Login/";
import {TodoList, todoListsActions, todoListSelectors} from "./index";
import {tasksSelectors} from "../Task";
import {useActions, useAppDispatch} from "../../utils/utils-redux";

type TodoListsPropsType = {
    demo?: boolean
}

export const TodoLists: React.FC<TodoListsPropsType> = ({demo = false}) => {

    let todoLists: Array<TodoListDomainType> = useSelector(todoListSelectors.todoListsSelector)
    let tasks: TasksStateType = useSelector(tasksSelectors.tasksSelector)
    const isLoggedIn = useSelector(authSelectors.isLoggedInSelector)
    const dispatch = useAppDispatch()

    const {fetchTodoLists} = useActions(todoListsActions)

    useEffect(() => {
        if (demo || !isLoggedIn) {
            return;
        }
        fetchTodoLists()
    }, [])

    const addTodoList = useCallback(async (title: string, helper: AddItemFormSubmitHelperType) => {
        const thunk = todoListsActions.addTodoList(title)
        const action = await dispatch(thunk)
        if (todoListsActions.addTodoList.rejected.match(action)) {
            if (action.payload?.errors?.length) {
                const error = action.payload?.errors[0]
                helper.setError(error)
            } else {
                helper.setError("Some error")
            }
        } else {
            helper.setValue("")
        }
    }, [])

    if (!isLoggedIn) {
        return <Redirect to="/login"/>
    }

    return (
        <>
            <Grid container style={{padding: "10px 0"}}>
                <Paper style={{padding: "10px", width: "280px"}}
                       elevation={3}>
                    <AddItemForm addItem={addTodoList} title={"TodoList title"}/>
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