import {tasksReducer, TasksStateType} from "../Task/tasks-reducer";
import {
    addTodoListTC,
    fetchTodoListsTC,
    removeTodoListTC,
    TodoListDomainType,
    todoListsReducer
} from "./todolists-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodoListsState: Array<TodoListDomainType> = [];

    let todoList = {todoList: {id: "todoListId3", title: "What to create", addedDate: "", order: 2}};
    const action = addTodoListTC.fulfilled(todoList, "", todoList.todoList.title);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodoListsState = todoListsReducer(startTodoListsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodoLists = endTodoListsState[0].id;

    expect(idFromTasks).toBe(action.payload.todoList.id);
    expect(idFromTodoLists).toBe(action.payload.todoList.id);
});

test('property with todolistId should be deleted', () => {
    const startState: TasksStateType = {
        "todoListId1": [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1",
                entityStatus: "idle"
            },
            {
                id: "2", title: "JS", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 1, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1",
                entityStatus: "idle"
            },
            {
                id: "3", title: "React", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 2, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1",
                entityStatus: "idle"
            }
        ],
        "todoListId2": [
            {
                id: "1", title: "bread", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2",
                entityStatus: "idle"
            },
            {
                id: "2", title: "milk", status: TaskStatuses.Completed, addedDate: "", deadline: "",
                description: "", order: 2, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2",
                entityStatus: "idle"
            },
            {
                id: "3", title: "tea", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 3, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2",
                entityStatus: "idle"
            }
        ]
    };

    const action = removeTodoListTC.fulfilled({id: "todoListId2"}, "", "todoListId2");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState["todoListId2"]).not.toBeDefined();
});

test('empty arrays should be added when todolists was set', () => {

    let todoLists = {
        todoLists: [
            {id: "1", title: "What to learn", addedDate: "", order: 0},
            {id: "2", title: "What to buy", addedDate: "", order: 1}
        ]
    };
    const action = fetchTodoListsTC.fulfilled(todoLists, "")

    const endState = tasksReducer({}, action)

    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState["1"]).toStrictEqual([]);
    expect(endState["2"]).toStrictEqual([]);
})

