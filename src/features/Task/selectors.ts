import {AppRootStateType} from "../../bll/store";

export const tasksSelector = (state:AppRootStateType) => state.tasks;