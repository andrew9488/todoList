import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import {IconButton, TextField} from "@material-ui/core";
import {AddBox} from "@material-ui/icons";

export type AddItemFormSubmitHelperType = {
    setError: (error: string) => void
    setValue: (value: string) => void
}

export type AddItemFormPropsType = {
    addItem: (title: string, helper: AddItemFormSubmitHelperType) => void
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
        if (e.key === "Enter") {
            addItemHandler()
                .then()
        }
    }

    const addItemHandler = async () => {
        const trimmedTitle = value.trim()
        if (trimmedTitle !== "") {
            addItem(trimmedTitle, {setError, setValue})
        } else {
            setError("Title is required!")
        }
    }

    return (
        <div style={{display: "flex", alignItems: "center", position: "relative"}}>
            <div style={{width: "218px"}}>
                <TextField
                    variant={"outlined"}
                    value={value}
                    onChange={onChangeTitleItemHandler}
                    onKeyPress={onKeyPressHandler}
                    onBlur={() => {
                        setError(null)
                    }}
                    helperText={error}
                    label={title}
                    error={!!error}
                    disabled={disabled}
                />
            </div>
            <IconButton onClick={addItemHandler} color="primary" disabled={disabled}
                        style={{marginLeft: "14px", position: "absolute", right:"0px", top:"0px"}}>
                <AddBox/>
            </IconButton>
        </div>
    );
})

