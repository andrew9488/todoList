import * as appSelectors from "./selectors";
import {asyncActions as appAsyncActions} from "./app-reducer"
import {slice} from "./app-reducer"

const appActions = {
    ...appAsyncActions,
    ...slice.actions
}

export {
    appSelectors,
    appActions
}
