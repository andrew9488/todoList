import {createAction} from "@reduxjs/toolkit";
import {RequestStatusType} from "../Application/application-reducer";
import {FilterValuesType} from "../Todolists/todolists-reducer";


const setAppStatus = createAction<{status: RequestStatusType}>("appActions/setAppStatus")
const setAppError = createAction<{error: string | null}>("appActions/setAppError")
const setIsLoggedIn = createAction<{isLoggedIn: boolean}>("auth/setIsLoggedIn")
const changeTasksEntityStatus = createAction<{ todoListId: string, taskId: string, entityStatus: RequestStatusType }>("tasks/changeTasksEntityStatus")
const changeFilterTodoList = createAction<{ id: string, filter: FilterValuesType }>("todoLists/changeFilterTodoList")
const changeTodoListEntityStatus = createAction<{ todoListId: string, entityStatus: RequestStatusType }>("todoLists/changeTodoListEntityStatus")

export const appActions = {
    setAppStatus,
    setAppError,
    setIsLoggedIn,
    changeTasksEntityStatus,
    changeFilterTodoList,
    changeTodoListEntityStatus
}