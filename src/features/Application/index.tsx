import * as appSelectors from "./selectors";
import {slice} from "./application-reducer"
import {asyncActions as appAsyncActions} from "./application-reducer"


const appActions = {
    ...appAsyncActions,
    ...slice.actions
}

const appReducer = slice.reducer

export {
    appSelectors,
    appActions,
    appReducer
}
