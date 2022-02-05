import axios from "axios";
import {REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAILED, LOGOUT, CLEAR_PROFILE} from "./types";
import {setAlert} from "./alert";
import setAuthToken from "../utils/setAuthToken";

export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }
    try {
        const response = await axios.get("/api/auth");
        dispatch({
            type: USER_LOADED,
            payload: response.data
        });
    }
    catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}

export const register = ({name, email, password}) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({name, email, password});
    try {
        const response = await axios.post("/api/users", body, config);
        dispatch({
            type: REGISTER_SUCCESS,
            payload: response.data
        });
        dispatch(loadUser());
    }
    catch (err) {
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: REGISTER_FAIL,
        })
    }
};

export const login = (email, password) => async dispatch => {
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    const body = JSON.stringify({email, password});
    try {
        const response = await axios.post("/api/auth", body, config);
        dispatch({
            type: LOGIN_SUCCESS,
            payload: response.data
        });
        dispatch(loadUser());
    }
    catch (err) {
        console.log(err);  
        const errors = err.response.data.errors;
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, "danger")));
        }
        dispatch({
            type: LOGIN_FAILED,
        })
    }
};

export const logout = () => dispatch => {
    dispatch({
        type: CLEAR_PROFILE
    })
    dispatch({
        type: LOGOUT
    });
}