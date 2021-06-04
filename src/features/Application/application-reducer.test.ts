import {InitialStateType, slice} from "./application-reducer";
import {appActions} from "./index";
import {appActions as ActionCreators} from "../Actions/App"

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

    const endState = appReducer(initialState, ActionCreators.setAppStatus({status}))

    expect(endState.status).toBe("succeeded")

})

test("error should be set", () => {

    const error = null

    const endState = appReducer(initialState, ActionCreators.setAppError({error}))

    expect(endState.error).toBe(null)
})
test("initialized should be set", () => {


    const endState = appReducer(initialState, appActions.initializeApp.fulfilled({isInitialized: true}, ""))

    expect(endState.isInitialized).toBeTruthy()
})