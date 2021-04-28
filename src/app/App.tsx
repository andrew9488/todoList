import React, {useEffect} from 'react';
import './App.css';
import {
    AppBar,
    Button,
    CircularProgress,
    Container,
    IconButton,
    LinearProgress,
    Toolbar,
    Typography
} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodoLists} from "../features/Todolists/TodoLists";
import {useDispatch, useSelector} from "react-redux";
import {AppRootStateType} from "./store";
import {initializeAppTC, RequestStatusType} from "./app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Redirect, Route, Switch} from 'react-router-dom';
import {logoutTC} from "../features/Login/authReducer";


type AppPropsType = {
    demo?: boolean
}

export const App: React.FC<AppPropsType> = ({demo = false}) => {

    const isInitialized = useSelector<AppRootStateType, boolean>(state => state.app.isInitialized)
    const isLoggedIn = useSelector<AppRootStateType, boolean>(state => state.auth.isLoggedIn)

    const appStatus = useSelector<AppRootStateType, RequestStatusType>(state => state.app.status)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logout = () => {
        dispatch(logoutTC())
    }

    if (!isInitialized) {
        return <div
            style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress color="secondary" size={150}/>
        </div>
    }

    return (
        <div className="App">
            <AppBar position="static">
                <ErrorSnackbar/>
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                        <Menu/>
                    </IconButton>
                    <Typography variant="h6">
                        News
                    </Typography>
                    {isLoggedIn && <Button color="inherit" onClick={logout}>Logout</Button>}
                </Toolbar>
                {appStatus === "loading" && <LinearProgress color="secondary"/>}
            </AppBar>
            <Container fixed>
                <Switch>
                    <Route exact path="/" render={() => <TodoLists demo={demo}/>}/>
                    <Route path="/login" render={() => <Login/>}/>
                    <Route path="/404" render={() => <h1>ERROR 404. PAGE NOT FOUND</h1>}/>
                    <Redirect from="*" to="/404"/>
                </Switch>
            </Container>
        </div>
    );
}

