import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC} from "./app-reducer";

let initialState: InitialStateType;

beforeEach(() => {
    initialState = {
        status: "idle",
        error: "some error"
    }
})

test("status should be change", () => {

    const status = "succeeded"

    const endState = appReducer(initialState, setAppStatusAC(status))

    expect(endState.status).toBe("succeeded")

})

test("error should be set", () => {

    const error = null

    const endState = appReducer(initialState, setAppErrorAC(error))

    expect(endState.error).toBe(null)
})