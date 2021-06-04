import * as authSelectors from "./selectors";
import {asyncActions as authAsyncActions} from "./auth-reducer";
import {slice} from "./auth-reducer";
import {Login} from "./Login"

const authActions = {
    ...authAsyncActions,
}

const authReducer = slice.reducer
export {
    authSelectors,
    authActions,
    authReducer,
    Login
}