import {InitialStateType, setAppStatus, slice, setAppError} from "./application-reducer";
import {appActions} from "./index";

const appReducer = slice.reducer

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

    const endState = appReducer(initialState, setAppStatus({status}))

    expect(endState.status).toBe("succeeded")

})

test("error should be set", () => {

    const error = null

    const endState = appReducer(initialState, setAppError({error}))

    expect(endState.error).toBe(null)
})
test("initialized should be set", () => {


    const endState = appReducer(initialState, appActions.initializeApp.fulfilled({isInitialized: true}, ""))

    expect(endState.isInitialized).toBeTruthy()
})