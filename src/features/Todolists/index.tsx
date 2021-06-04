import * as todoListSelectors from "./selectors";
import {asyncActions as todoListsAsyncActions} from "./todolists-reducer";
import {slice} from "./todolists-reducer";
import {TodoLists} from "./TodoLists";
import {TodoList} from "./Todolist/TodoList"

const todoListsActions = {
    ...todoListsAsyncActions,
}


const todoListsReducer = slice.reducer

export {
    todoListSelectors,
    todoListsActions,
    todoListsReducer,
    TodoLists,
    TodoList
}