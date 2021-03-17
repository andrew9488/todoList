import {v1} from 'uuid';
import {
    ActionsTodoListType,
    addTodoListActionCreator, changeFilterTodoListActionCreator, changeTodoListTitleActionCreator,
    removeTodoListActionCreator,
    todoListsReducer
} from "./todolists-reducer";
import {FilterValuesType, TodoListType} from "../AppWithRedux";

let todoListId1: string
let todoListId2: string
let startState: Array<TodoListType>

beforeEach(() => {
    todoListId1 = v1();
    todoListId2 = v1();

    startState = [
        {id: todoListId1, title: "What to learn", filter: "all"},
        {id: todoListId2, title: "What to buy", filter: "all"}
    ]
})

test('correct todoList should be removed', () => {

    const endState = todoListsReducer(startState, removeTodoListActionCreator(todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
});

test('correct todoList should be added', () => {

    let newTodoListTitle = "New TodoList";

    const endState = todoListsReducer(startState, addTodoListActionCreator(newTodoListTitle))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe(newTodoListTitle);
});

test('correct todoList should change its name', () => {

    let newTodoListTitle = "New TodoList";

    const action: ActionsTodoListType = changeTodoListTitleActionCreator(newTodoListTitle, todoListId2)

    const endState = todoListsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodoListTitle);
});

test('correct filter of todoList should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action: ActionsTodoListType = changeFilterTodoListActionCreator(todoListId2, newFilter)

    const endState = todoListsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});
