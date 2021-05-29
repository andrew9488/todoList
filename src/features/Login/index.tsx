import * as authSelectors from "./selectors";
import {asyncActions as authAsyncActions} from "./authReducer";
import {slice} from "./authReducer";
import {Login} from "./Login"

const authActions = {
    ...authAsyncActions,
    ...slice.actions

}

export {
    authSelectors,
    authActions,
    Login
}