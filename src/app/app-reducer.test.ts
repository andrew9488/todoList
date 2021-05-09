import {appReducer, InitialStateType, setAppErrorAC, setAppStatusAC, setIsInitializedAC} from "./app-reducer";

let initialState: InitialStateType;

beforeEach(() => {
    initialState = {
        status: "idle",
        error: "some error",
        isInitialized: false
    }
})

test("status should be set", () => {

    const status = "succeeded"

    const endState = appReducer(initialState, setAppStatusAC({status}))

    expect(endState.status).toBe("succeeded")

})

test("error should be set", () => {

    const error = null

    const endState = appReducer(initialState, setAppErrorAC({error}))

    expect(endState.error).toBe(null)
})
test("initialized should be set", () => {


    const endState = appReducer(initialState, setIsInitializedAC({isInitialized: true}))

    expect(endState.isInitialized).toBeTruthy()
})