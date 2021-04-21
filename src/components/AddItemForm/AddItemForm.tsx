import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormPropsType = {
    addItem: (title: string) => void
    title: string
    disabled?: boolean
}

export const AddItemForm: React.FC<AddItemFormPropsType> = React.memo(({addItem, title, disabled = false}) => {

    const [value, setValue] = useState<string>("")
    const [error, setError] = useState<string | null>(null)

    const onChangeTitleItemHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value)
        setError(null)
    }

    const onKeyPressHandler = (e: KeyboardEvent<HTMLInputElement>) => {
        if (error !== null) {
            setError(null)
        }
        if (e.key === "Enter") addItemHandler()
    }

    const addItemHandler = () => {
        const trimmedTitle = value.trim()
        if (trimmedTitle) {
            addItem(trimmedTitle)
        } else {
            setError("Title is required!")
        }
        setValue("")
    }

    return (
        <div>
            <TextField
                variant={"outlined"}
                value={value}
                onChange={onChangeTitleItemHandler}
                onKeyPress={onKeyPressHandler}
                onBlur={() => {
                    setError(null)
                }}
                helperText={error ? "Title is required!" : ""}
                label={title}
                error={!!error}
                disabled={disabled}
            />
            <IconButton onClick={addItemHandler} color="primary" disabled={disabled}>
                <AddBox/>
            </IconButton>
        </div>
    );
})

