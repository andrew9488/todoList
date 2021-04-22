import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {TextField} from "@material-ui/core";

export type EditableSpanPropsType = {
    title: string
    changeItem: (newTitle: string) => void
    disabled?: boolean
}

export const EditableSpan: React.FC<EditableSpanPropsType> = React.memo((props) => {

    const [editMode, setEditMode] = useState<boolean>(false)
    const [title, setTitle] = useState<string>(props.title)

    const onEditMode = () => {
        setEditMode(true)
    }
    const offEditMode = () => {
        setEditMode(false)
        props.changeItem(title)
    }

    const onChangeTitleHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter")
            offEditMode()
    }

    return (
        editMode
            ? <TextField value={title}
                         autoFocus
                         onBlur={offEditMode}
                         onChange={onChangeTitleHandler}
                         onKeyPress={onKeyPressHandler}
                         disabled={props.disabled}
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
})