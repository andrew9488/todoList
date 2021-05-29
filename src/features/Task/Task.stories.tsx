import React from 'react';
import {Meta, Story} from '@storybook/react/types-6-0';
import {Task, TaskPropsType} from "./Task";
import {action} from "@storybook/addon-actions";
import {TaskPriorities, TaskStatuses} from "../../api/todolist-api";
import {ReduxStoreProviderDecorator} from "../../stories/decorators/ReduxStoreProviderDecorator";

export default {
    title: 'TodoList/Task',
    component: Task,
    decorators: [ReduxStoreProviderDecorator]
} as Meta;

const changeStatusCallback = action("status was changed")
const changeTaskTitleCallback = action("title was changed")
const removeTaskCallback = action("task was changed")

const Template: Story<TaskPropsType> = (args) => <Task {...args} />;

const argsCallback = {
    changeStatus: changeStatusCallback,
    changeTaskTitle: changeTaskTitleCallback,
    removeTask: removeTaskCallback
}


export const TaskIsNotDoneStories = Template.bind({})
TaskIsNotDoneStories.args = {
    ...argsCallback,
    task: {
        id: "1", title: "JS", status: TaskStatuses.New, addedDate: "", deadline: "",
        description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1",
    },
    todoListId: "todoListId1"
}
export const TaskIsDoneStories = Template.bind({})
TaskIsDoneStories.args = {
    ...argsCallback,
    task: {
        id: "1", title: "CSS", status: TaskStatuses.Completed, addedDate: "", deadline: "",
        description: "", order: 0, priority: TaskPriorities.Low, startDate: "", todoListId: "todoListId1"
    },
    todoListId: "todoListId1"
}