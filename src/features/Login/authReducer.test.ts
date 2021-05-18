import {authReducer, InitialStateType, loginTC} from "./authReducer";

let startState: InitialStateType;

beforeEach(() => {
    startState = {
        isLoggedIn: false
    }
})

test("isLoggedIn should be set", () => {

    let isLoggedIn = {isLoggedIn: true};
    let payload = {
        email: "abv@mail.ru",
        password: "qwerty123",
        rememberMe: true,
    }
    const endState = authReducer(startState, loginTC.fulfilled(isLoggedIn, "", payload))

    expect(endState.isLoggedIn).toBeTruthy()

})