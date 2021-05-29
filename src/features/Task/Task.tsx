import React, {ChangeEvent, useCallback} from "react";
import {Checkbox, IconButton} from "@material-ui/core";
import {EditableSpan} from "../../components/EditableSpan/EditableSpan";
import {Delete} from "@material-ui/icons";
import {TaskStatuses, TaskType} from "../../api/todolist-api";
import {tasksActions} from "./index";
import {useActions} from "../../bll/store";


export type TaskPropsType = {
    task: TaskType
    todoListId: string
    disabled: boolean
}

export const Task: React.FC<TaskPropsType> = React.memo((props) => {

    const {updateTaskTC, removeTaskTC} = useActions(tasksActions)

    const removeTask = useCallback(() => removeTaskTC({
        taskId: props.task.id,
        todoListId: props.todoListId
    }), [props.task.id, props.todoListId])

    const changeTaskStatus = useCallback((e: ChangeEvent<HTMLInputElement>) => updateTaskTC({
        taskId: props.task.id,
        model: {status: e.currentTarget.checked ? TaskStatuses.Completed : TaskStatuses.New},
        todoListId: props.todoListId
    }), [props.task.id, props.todoListId])

    const changeTaskTitle = useCallback((newTitle: string) => {
        updateTaskTC({taskId: props.task.id, model: {title: newTitle}, todoListId: props.todoListId})
    }, [props.task.id, props.todoListId])

    return (
        <div style={{position: "relative"}}>
            <li className={props.task.status === TaskStatuses.Completed ? "is-done" : ""}>
                <Checkbox
                    color={"secondary"}
                    checked={props.task.status === TaskStatuses.Completed}
                    onChange={changeTaskStatus}/>
                <EditableSpan title={props.task.title} changeItem={changeTaskTitle} disabled={props.disabled}/>
                <IconButton onClick={removeTask} disabled={props.disabled}
                            style={{position: "absolute", right: "2px", top: "0"}}>
                    <Delete fontSize={"small"}/>
                </IconButton>
            </li>
        </div>
    );
})