import {TasksActionsType, tasksReducer} from '../features/Todolists/tasks-reducer';
import {TodoListsActionsType, todoListsReducer} from '../features/Todolists/todolists-reducer';
import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk, {ThunkAction} from "redux-thunk";
import {AppActionsType, appReducer} from "./app-reducer";

// объединяя reducer-ы с помощью combineReducers,
// мы задаём структуру нашего единственного объекта-состояния
const rootReducer = combineReducers({
    tasks: tasksReducer,
    todoLists: todoListsReducer,
    app: appReducer
})
// непосредственно создаём store
export const store = createStore(rootReducer, applyMiddleware(thunk));
// определить автоматически тип всего объекта состояния
export type AppRootStateType = ReturnType<typeof rootReducer>

type ActionsType = TasksActionsType | TodoListsActionsType | AppActionsType

export type AppThunkType = ThunkAction<void, AppRootStateType, unknown, ActionsType>

// а это, чтобы можно было в консоли браузера обращаться к store в любой момент
// @ts-ignore
window.store = store;