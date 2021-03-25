import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {Meta, Story} from '@storybook/react/types-6-0';
import {Task, TaskPropsType} from "./Task";
import {action} from "@storybook/addon-actions";

export default {
    title: 'TodoList/Task',
    component: Task
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
    task: {id: "1", title: "JS", isDone: false},
    todoListId: "todoListId1"
}
export const TaskIsDoneStories = Template.bind({})
TaskIsDoneStories.args = {
    ...argsCallback,
    task: {id: "1", title: "CSS", isDone: true},
    todoListId: "todoListId1"
}