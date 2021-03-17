import {
    addTaskActionCreator,
    changeTaskStatusActionCreator, changeTaskTitleActionCreator,
    removeTaskActionCreator,
    tasksReducer
} from "./tasks-reducer";
import {TasksStateType} from "../AppWithRedux";
import {addTodoListActionCreator} from "./todolists-reducer";

let startState: TasksStateType;

beforeEach(()=>{
    startState = {
        "todoListId1": [
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todoListId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "2", title: "milk", isDone: true },
            { id: "3", title: "tea", isDone: false }
        ]
    };
})

test('correct task should be deleted from correct array', () => {

    const action = removeTaskActionCreator("2", "todoListId2");

    const endState = tasksReducer(startState, action)

    expect(endState).toEqual({
        "todoListId1": [
            { id: "1", title: "CSS", isDone: false },
            { id: "2", title: "JS", isDone: true },
            { id: "3", title: "React", isDone: false }
        ],
        "todoListId2": [
            { id: "1", title: "bread", isDone: false },
            { id: "3", title: "tea", isDone: false }
        ]
    });

});

test('correct task should be added to correct array', () => {

    const action = addTaskActionCreator("juice", "todoListId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId1"].length).toBe(3);
    expect(endState["todoListId2"].length).toBe(4);
    expect(endState["todoListId2"][0].id).toBeDefined();
    expect(endState["todoListId2"][0].title).toBe("juice");
    expect(endState["todoListId2"][0].isDone).toBeFalsy()
})

test('status of specified task should be changed', () => {

    const action = changeTaskStatusActionCreator("2", false, "todoListId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId2"][1].isDone).toBe(false);
    expect(endState["todoListId2"][1].id).toBe("2");
    expect(endState["todoListId1"][1].isDone).toBe(true);
});

test('title of specified task should be changed', () => {

    const action = changeTaskTitleActionCreator("2", "beer", "todoListId2");

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId2"][1].title).toBe("beer");
    expect(endState["todoListId2"][1].id).toBe("2");
    expect(endState["todoListId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {

    const action = addTodoListActionCreator("new todoList");

    const endState = tasksReducer(startState, action)

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todoListId1" && k != "todoListId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

