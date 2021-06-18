import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../api/todolist-api";
import {tasksActions} from "./index";
import {useActions} from "../../utils/utils-redux";


export type TaskPropsType = {
    task: TaskType
    todoListId: string
    disabled: boolean
}

export const Task: React.FC<TaskPropsType> = React.memo((props) => {

    const {updateTask, removeTask} = useActions(tasksActions)

    const removeTaskCallback = useCallback(() => removeTask({
        taskId: props.task.id,
        todoListId: props.todoListId
    }), [props.task.id, props.todoListId, removeTask])

    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => updateTask({
        taskId: props.task.id,
        model: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New},
        todoListId: props.todoListId
    }), [props.task.id, props.todoListId, updateTask])

    const changeTaskTitle = useCallback((newTitle: string) => {
        updateTask({taskId: props.task.id, model: {title: newTitle}, todoListId: props.todoListId})
    }, [props.task.id, props.todoListId, updateTask])

    const CompletedClassName = props.task.status === TaskStatuses.Completed ? "is-done" : ""

    return (
        <div style={{position: "relative"}}>
            <li className={CompletedClassName}>
                <Checkbox
                    color={"secondary"}
                    checked={props.task.status === TaskStatuses.Completed}
                    onChange={changeTaskStatus}/>
                <EditableSpan title={props.task.title} changeItem={changeTaskTitle} disabled={props.disabled}/>
                <IconButton onClick={removeTaskCallback} disabled={props.disabled}
                            style={{position: "absolute", right: "2px", top: "0"}}>
                    <Delete fontSize={"small"}/>
                </IconButton>
            </li>
        </div>
    );
})