import * as tasksSectors from "./selectors";
import {asyncActions as tasksAsyncActions} from "./tasks-reducer";
import {slice} from "./tasks-reducer";
import {Task} from "./Task";

const tasksActions = {
    ...tasksAsyncActions,
    ...slice.actions
}

export {
    tasksSectors,
    tasksActions,
    Task
}