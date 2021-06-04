import { TasksStateType} from "./tasks-reducer";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import {tasksActions} from "./index";
import {slice} from "./tasks-reducer"
import {todoListsActions} from "../Todolists";
import {appActions as ActionCreators} from "../Actions/App"

const tasksReducer = slice.reducer
const {addTask, fetchTasks, removeTask, updateTask} = tasksActions
const {addTodoList} = todoListsActions

let startState: TasksStateType;

beforeEach(() => {
    startState = {
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
})

test('correct task should be deleted from correct array', () => {

    let payload = {taskId: "2", todoListId: "todoListId2"};

    const endState = tasksReducer(startState, removeTask.fulfilled(payload, "", payload))

    expect(endState).toEqual({
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
                id: "3", title: "tea", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 3, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2",
                entityStatus: "idle"
            }
        ]
    });

});

test('correct task should be added to correct array', () => {

    let task = {
        id: "4", title: "juice", status: TaskStatuses.New, addedDate: "", deadline: "",
        description: "", order: 4, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId2"
    };

    const endState = tasksReducer(startState, addTask.fulfilled
    ({task}, "", {todoListId: task.todoListId, title: task.title}))

    expect(endState["todoListId1"].length).toBe(3);
    expect(endState["todoListId2"].length).toBe(4);
    expect(endState["todoListId2"][0].id).toBeDefined();
    expect(endState["todoListId2"][0].title).toBe("juice");
    expect(endState["todoListId2"][0].status).toBe(TaskStatuses.New)
})

test('status of specified task should be changed', () => {

    let payload = {
        taskId: "2",
        model: {status: TaskStatuses.New},
        todoListId: "todoListId2"
    };

    const endState = tasksReducer(startState, updateTask.fulfilled(payload, "", payload))

    expect(endState["todoListId2"][1].status).toBe(TaskStatuses.New);
    expect(endState["todoListId2"][1].id).toBe("2");
    expect(endState["todoListId1"][1].status).toBe(TaskStatuses.Completed);
});

test('title of specified task should be changed', () => {

    let payload = {
        taskId: "2",
        model: {title: "beer"},
        todoListId: "todoListId2"
    };
    const action = updateTask.fulfilled(payload, "", payload);

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId2"][1].title).toBe("beer");
    expect(endState["todoListId2"][1].id).toBe("2");
    expect(endState["todoListId1"][1].title).toBe("JS");
});

test('new array should be added when new todolist is added', () => {

    let todoList = {todoList: {id: "todoListId3", title: "What to create", addedDate: "", order: 2}};

    const endState = tasksReducer(startState, addTodoList.fulfilled(todoList, "", todoList.todoList.title))

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != "todoListId1" && k != "todoListId2");
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
});

test('empty array should be added for todolists', () => {

    let tasks = {
        todoListId: "todoListId1", tasks: [
            {
                id: "1", title: "CSS", status: TaskStatuses.New, addedDate: "", deadline: "",
                description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1"
            }]
    };

    const endState = tasksReducer({"todoListId1": []}, fetchTasks.fulfilled(tasks, "", tasks.todoListId))

    expect(endState["todoListId1"].length).toBe(1);
})

test('entity status task should be changed', () => {

    const action = ActionCreators.changeTasksEntityStatus({todoListId: "todoListId1", taskId: "2", entityStatus: "succeeded"});

    const endState = tasksReducer(startState, action)

    expect(endState["todoListId1"][1].entityStatus).toBe("succeeded");
});