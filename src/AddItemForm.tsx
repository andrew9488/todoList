import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

type AddItemFormPropsType = {
    addItem: (title: string) => void
    title: string
}

export const AddItemForm = React.memo((props: AddItemFormPropsType) => {
    console.log("AddItemForm is called")
    const [title, setTitle] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const onChangeTitleItemHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setTitle(e.currentTarget.value)
        setError(null)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.key === "Enter") addItem()
    }

    const addItem = () => {
        const trimmedTitle = title.trim()
        if (trimmedTitle) {
            props.addItem(trimmedTitle)
        } else {
            setError("Title is required!")
        }
        setTitle("")
    }

    return (
        <div>
            <TextField
                variant={"outlined"}
                value={title}
                onChange={onChangeTitleItemHandler}
                onKeyPress={onKeyPressHandler}
                onBlur={() => {
                    setError(null)
                }}
                helperText={error ? "Title is required!" : ""}
                label={props.title}
                error={!!error}
            />
            <IconButton>
                <AddBox onClick={addItem}/>
            </IconButton>
        </div>
    );
})

