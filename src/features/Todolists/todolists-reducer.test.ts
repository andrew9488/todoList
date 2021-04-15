import {v1} from 'uuid';
import {
    TodoListsActionsType,
    addTodoListAC, changeFilterTodoListAC, changeTodoListTitleAC, TodoListDomainType,
    removeTodoListAC,
    todoListsReducer,
    FilterValuesType, setTodoListsAC
} from "./todolists-reducer";


let todoListId1: string
let todoListId2: string
let startState: Array<TodoListDomainType>

beforeEach(() => {
    todoListId1 = v1();
    todoListId2 = v1();

    startState = [
        {id: todoListId1, title: "What to learn", filter: "all", addedDate: "", order: 0},
        {id: todoListId2, title: "What to buy", filter: "all", addedDate: "", order: 1}
    ]
})

test('correct todoList should be removed', () => {

    const endState = todoListsReducer(startState, removeTodoListAC(todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
});

test('correct todoList should be added', () => {

    let newTodoList = {id: "todoListId3", title: "What to create", filter: "all", addedDate: "", order: 2};

    const endState = todoListsReducer(startState, addTodoListAC(newTodoList))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("What to create");
});

test('correct todoList should change title', () => {

    let newTodoListTitle = "New TodoList";

    const action: TodoListsActionsType = changeTodoListTitleAC(newTodoListTitle, todoListId2)

    const endState = todoListsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodoListTitle);
});

test('correct filter of todoList should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action: TodoListsActionsType = changeFilterTodoListAC(todoListId2, newFilter)

    const endState = todoListsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('todolists should be set to state',()=>{

    const action = setTodoListsAC(startState)

    const endState = todoListsReducer([], action)

    expect(endState.length).toBe(2);

})
