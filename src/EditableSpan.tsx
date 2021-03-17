import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import {TextField} from "@material-ui/core";

type EditableSpanPropsType = {
    title: string
    changeItem: (newTitle: string) => void
}

export const EditableSpan= React.memo((props: EditableSpanPropsType)=> {

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
            />
            : <span onDoubleClick={onEditMode}>{props.title}</span>
    );
})