import {AppRootStateType} from "../../bll/store";

export const isLoggedInSelector = (state: AppRootStateType) => state.auth.isLoggedIn;