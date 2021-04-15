import {todoListsApi, TodoListType} from "../../api/todolist-api";
import {AppThunkType} from "../../app/store";

export type RemoveTodoListActionType = ReturnType<typeof removeTodoListAC>
export type AddTodoListActionType = ReturnType<typeof addTodoListAC>
type ChangeFilterTodoListActionType = ReturnType<typeof changeFilterTodoListAC>
type ChangeTodoListTitleActionType = ReturnType<typeof changeTodoListTitleAC>
export type SetTodoListsActionType = ReturnType<typeof setTodoListsAC>

export type FilterValuesType = "all" | "active" | "completed"

export type TodoListDomainType = TodoListType & { filter: FilterValuesType }

export type TodoListsActionsType =
    RemoveTodoListActionType
    | AddTodoListActionType
    | ChangeFilterTodoListActionType
    | ChangeTodoListTitleActionType
    | SetTodoListsActionType

let initialState: Array<TodoListDomainType> = []

export const todoListsReducer = (state: Array<TodoListDomainType> = initialState, action: TodoListsActionsType): Array<TodoListDomainType> => {
    switch (action.type) {
        case "REMOVE-TODOLIST": {
            return state.filter(st => st.id !== action.todoListId)
        }
        case "ADD-TODOLIST": {
            return [{...action.todoList, filter: "all"}, ...state]
        }
        case "CHANGE-FILTER-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, filter: action.newFilterValue} : tl)
        }
        case "CHANGE-TITLE-TODOLIST": {
            return state.map(tl => tl.id === action.todoListId ? {...tl, title: action.newTitle} : tl)
        }
        case 'SET-TODOLISTS': {
            return action.todoLists.map(tl => ({...tl, filter: "all"}))
        }
        default:
            return state
    }
}

export const removeTodoListAC = (id: string) => ({type: "REMOVE-TODOLIST", todoListId: id} as const)

export const addTodoListAC = (todoList: TodoListType) => ({type: "ADD-TODOLIST", todoList} as const)

export const changeFilterTodoListAC = (id: string, filter: FilterValuesType) =>
    ({type: "CHANGE-FILTER-TODOLIST", newFilterValue: filter, todoListId: id} as const)

export const changeTodoListTitleAC = (title: string, id: string) =>
    ({type: "CHANGE-TITLE-TODOLIST", todoListId: id, newTitle: title} as const)

export const setTodoListsAC = (todoLists: Array<TodoListType>) => ({type: 'SET-TODOLISTS', todoLists} as const)

export const fetchTodoListsTC = (): AppThunkType => dispatch => {
    todoListsApi.getTodoLists()
        .then(res => {
            dispatch(setTodoListsAC(res.data))
        })
}

export const removeTodoListTC = (todoListId: string): AppThunkType => dispatch => {
    todoListsApi.deleteTodoList(todoListId)
        .then(() => {
            dispatch(removeTodoListAC(todoListId))
        })
}

export const addTodoListTC = (title: string): AppThunkType => dispatch => {
    todoListsApi.createTodoList(title)
        .then(res => {
            dispatch(addTodoListAC(res.data.data.item))
        })
}

export const changeTodoListTitleTC = (todoListId: string, title: string): AppThunkType => dispatch => {
    todoListsApi.updateTodoListTitle(todoListId, title)
        .then(() => {
            dispatch(changeTodoListTitleAC(title, todoListId))
        })
}
