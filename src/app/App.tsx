import React, {useEffect} from 'react';
import './App.css';
import {AppBar, Button, CircularProgress, Container, IconButton, LinearProgress, Toolbar} from "@material-ui/core";
import {Menu} from "@material-ui/icons";
import {TodoLists} from "../features/Todolists/TodoLists";
import {useDispatch, useSelector} from "react-redux";
import {initializeAppTC} from "./app-reducer";
import {ErrorSnackbar} from "../components/ErrorSnackbar/ErrorSnackbar";
import {Login} from "../features/Login/Login";
import {Redirect, Route, Switch} from 'react-router-dom';
import {appStatusSelector, isInitializedSelector} from "./selectors";
import {isLoggedInSelector} from "../features/Login/selectors";


type AppPropsType = {
    demo?: boolean
}

export const App: React.FC<AppPropsType> = ({demo = false}) => {

    const isInitialized = useSelector(isInitializedSelector)
    const appStatus = useSelector(appStatusSelector)
    const isLoggedIn = useSelector(isLoggedInSelector)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(initializeAppTC())
    }, [])

    const logOut = () => {
        dispatch(logout())
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
                    {isLoggedIn && <Button color="inherit" onClick={logOut}>Logout</Button>}
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

