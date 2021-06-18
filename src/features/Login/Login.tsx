import React from 'react'
import {Avatar, Box, Button,
    Checkbox,
    Container,
    CssBaseline,
    FormControlLabel, Grid, Link,
    makeStyles,
    TextField,
    Typography} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import {FormikHelpers, useFormik} from "formik";
import {useSelector} from "react-redux";
import {Redirect} from "react-router-dom";
import {authActions, authSelectors} from "./index"
import {useAppDispatch} from "../../utils/utils-redux";

type FormValuesType = {
    email: string
    password: string
    rememberMe: boolean
}

type FormikErrorType = {
    email?: string
    password?: string
    rememberMe?: boolean
}

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/andrew9488/todoList" target={'_blank'} rel="noopener noreferrer">
                Website
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(3),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));


export const Login: React.FC = () => {

    const classes = useStyles();
    const isLoggedIn = useSelector(authSelectors.isLoggedInSelector)
    const dispatch = useAppDispatch()

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
        validate: (values) => {
            const errors: FormikErrorType = {};
            if (!values.email) {
                errors.email = 'Required';
            } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
                errors.email = 'Invalid email address';
            }

            if (!values.password) {
                errors.password = 'Required';
            } else if (values.password.length < 3) {
                errors.password = 'Must be 3 characters or more';
            }
            return errors;
        },
        onSubmit: async (values, formikHelpers: FormikHelpers<FormValuesType>) => {
            const thunk = authActions.login(values)
            const action = await dispatch(thunk)
            if (authActions.login.rejected.match(action)) {
                if (action.payload?.fieldsErrors?.length) {
                    const error = action.payload?.fieldsErrors[0]
                    formikHelpers.setFieldError(error.field, error.error)
                }
            }
        },
    });

    if (isLoggedIn) {
        return <Redirect to="/"/>
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={formik.handleSubmit}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        autoComplete="email"
                        autoFocus
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ?
                        <div style={{color: 'red'}}>{formik.errors.email}</div> : ''}
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ?
                        <div style={{color: 'red'}}>{formik.errors.password}</div> : ''}
                    <FormControlLabel
                        control={<Checkbox checked={formik.values.rememberMe}
                                           {...formik.getFieldProps('rememberMe')}
                                           color="primary"/>}
                        label="Remember me"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Login
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href='https://social-network.samuraijs.com/' variant="body2" target={'_blank'}>
                                {'Don\'t have an account? Sign Up'}
                            </Link>
                        </Grid>
                        <Grid style={{marginTop: '20px', color: '#0000008A'}}>
                            <p>You can use common test account credentials:</p>
                            <p>Email: free@samuraijs.com</p>
                            <p>Password: free</p>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright/>
            </Box>
        </Container>
    )
}
