import * as tasksSelectors from "./selectors";
import {slice, asyncActions as tasksAsyncActions} from "./tasks-reducer";
import {Task} from "./Task";

const tasksActions = {
    ...tasksAsyncActions,
}

const tasksReducer = slice.reducer

export {
    tasksSelectors,
    tasksActions,
    Task,
    tasksReducer
}