import {AppRootStateType} from "../../bll/store";

export const todoListsSelector = (state: AppRootStateType) => state.todoLists;