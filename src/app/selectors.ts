import {AppRootStateType} from "./store";

export const appStatusSelector = (state:AppRootStateType) => state.app.status
export const isInitializedSelector = (state: AppRootStateType) => state.app.isInitialized