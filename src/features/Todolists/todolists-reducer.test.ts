import {v1} from 'uuid';
import {
    TodoListsActionsType,
    changeFilterTodoListAC,
    TodoListDomainType,
    todoListsReducer,
    FilterValuesType,
    changeTodoListEntityStatusAC,
    removeTodoListTC,
    addTodoListTC,
    changeTodoListTitleTC, fetchTodoListsTC
} from "./todolists-reducer";
import {RequestStatusType} from "../../app/app-reducer";


let todoListId1: string
let todoListId2: string
let startState: Array<TodoListDomainType>

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
    const endState = todoListsReducer(startState, removeTodoListTC.fulfilled(id, "", todoListId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todoListId2);
});

test('correct todoList should be added', () => {

    let newTodoList = {id: "todoListId3", title: "What to create", filter: "all", addedDate: "", order: 2};

    const endState = todoListsReducer(startState, addTodoListTC.fulfilled({todoList: newTodoList}, "", newTodoList.title))

    expect(endState.length).toBe(3);
    expect(endState[0].title).toBe("What to create");
});

test('correct todoList should change title', () => {

    let newTodoListTitle = "New TodoList";

    let payload = {title: newTodoListTitle, id: todoListId2};
    const action = changeTodoListTitleTC.fulfilled(payload, "", {
        todoListId: payload.id,
        title: payload.title
    })

    const endState = todoListsReducer(startState, action);

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodoListTitle);
});

test('correct filter of todoList should be changed', () => {

    let newFilter: FilterValuesType = "completed";

    const action: TodoListsActionsType = changeFilterTodoListAC({id: todoListId2, filter: newFilter})

    const endState = todoListsReducer(startState, action);

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(newFilter);
});

test('todolists should be set to state', () => {

    const action = fetchTodoListsTC.fulfilled({todoLists: startState}, "")

    const endState = todoListsReducer([], action)

    expect(endState.length).toBe(2);

})

test("entity status should be change", () => {

    let status: RequestStatusType = "succeeded"

    const endState = todoListsReducer(startState, changeTodoListEntityStatusAC({
        todoListId: todoListId2,
        entityStatus: status
    }))

    expect(endState[1].entityStatus).toBe("succeeded")

})
