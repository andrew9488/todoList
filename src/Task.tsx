import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "./EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskType} from "./AppWithRedux";

export type TaskPropsType = {
    task: TaskType
    todoListId: string
    changeStatus: (taskId: string, isDone: boolean, todoListId: string) => void
    changeTaskTitle: (taskId: string, title: string, todoListId: string) => void
    removeTask: (taskId: string, todoListId: string) => void
}



export const Task = React.memo((props: TaskPropsType) => {
    console.log('task is called')

    const removeTask = () => props.removeTask(props.task.id, props.todoListId)
    const changeStatus = (e: ChangeEvent<HTMLInputElement>) => props.changeStatus(props.task.id, e.currentTarget.checked, props.todoListId)
    const changeTaskTitle = useCallback((newTitle: string) => {
        props.changeTaskTitle(props.task.id, newTitle, props.todoListId)
    }, [props.changeTaskTitle, props.task.id, props.todoListId])

    return (
        <div>
            <li className={props.task.isDone ? "is-done" : ""}>
                <Checkbox
                    color={"secondary"}
                    checked={props.task.isDone}
                    onChange={changeStatus}/>
                <EditableSpan title={props.task.title} changeItem={changeTaskTitle}/>
                <IconButton onClick={removeTask}>
                    <Delete/>
                </IconButton>
            </li>
        </div>
    );
})