import {v1} from 'uuid';
import {TodoListDomainType, FilterValuesType, slice,} from "./todolists-reducer";
import {todoListsActions} from './index';
import {RequestStatusType} from '../Application/application-reducer';
import {appActions as ActionCreators} from "../Actions/App"

let todoListId1: string
let todoListId2: string
let startState: Array<TodoListDomainType>

const todoListsReducer = slice.reducer
const {addTodoList, removeTodoList, changeTodoListTitle} = todoListsActions

beforeEach(() => {
    todoListId1 = v1();
    todoListId2 = v1();

    startState = [
        {id: todoListId1, title: "What to learn", filter: "all", addedDate: "", order: 0, entityStatus: "idle"},
        {id: todoListId2, title: "What to buy", filter: "all", addedDate: "", order: 1, entityStatus: "idle"}
    ]
})

test('correct todoList should be removed', () => {

    let id = {id: todoListId1};
    const endState = todoListsReducer(startState, removeTodoList.fulfilled(id, "", todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
});

test('correct todoList should be added', () => {

    let newTodoList = {id: "todoListId3", title: "What to create", filter: "all", addedDate: "", order: 2};

    const endState = todoListsReducer(startState, addTodoList.fulfilled({todoList: newTodoList}, "", newTodoList.title))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("What to create");
});

test('correct todoList should change title', () => {

    let newTodoListTitle = "New TodoList";

    let payload = {title: newTodoListTitle, id: todoListId2};
    const action = changeTodoListTitle.fulfilled(payload, "", {
        todoListId: payload.id,
        title: payload.title
    })

    const endState = todoListsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodoListTitle);
});

test('correct filter of todoList should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action = ActionCreators.changeFilterTodoList({id: todoListId2, filter: newFilter})

    const endState = todoListsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('todolists should be set to state', () => {

    const action = todoListsActions.fetchTodoLists.fulfilled({todoLists: startState}, "", undefined)

    const endState = todoListsReducer([], action)

    expect(endState.length).toBe(2);

})

test("entity status should be change", () => {

    let status: RequestStatusType = "succeeded"

    const endState = todoListsReducer(startState, ActionCreators.changeTodoListEntityStatus({
        todoListId: todoListId2,
        entityStatus: status
    }))

    expect(endState[1].entityStatus).toBe("succeeded")

})
