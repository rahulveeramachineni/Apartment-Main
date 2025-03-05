import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import {
    GET_ERRORS,
    SET_CURRENT_USER,
    USER_LOADING
} from "./types";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const registerUser = (userData, history) => dispatch => {
    console.log("Sending request to:", `${BASE_URL}/register`);
    axios
        .post(`${BASE_URL}/register`, userData)
        .then(res => {
            console.log("Response received:", res);
            history.push("/login");
        })
        .catch(err => {
            console.error("Error response:", err.response);
            dispatch({
                type: GET_ERRORS,
                payload: err.response ? err.response.data : { message: "Unknown error occurred" }
            });
        });
};

export const addUser = (userData, history) => dispatch => {
    console.log("Sending request to:", `${BASE_URL}/users/add`);
    axios
        .post(`${BASE_URL}/users/add`, userData)
        .then(res => {
            console.log("User added successfully:", res.data);
            history.push("/dashboard");
        })
        .catch(err => {
            console.error("Error response:", err.response);
            dispatch({
                type: GET_ERRORS,
                payload: err.response ? err.response.data : { message: "Failed to add user" }
            });
        });
};

export const loginUser = userData => dispatch => {
    console.log("Sending request to:", `${BASE_URL}/login`);
    axios
        .post(`${BASE_URL}/login`, userData)
        .then(res => {
            const { token, userPermission, email } = res.data;
            localStorage.setItem("jwtToken", token);
            localStorage.setItem("userPermission", userPermission);
            localStorage.setItem("email", email);
            console.log("email :", email);
            setAuthToken(token);
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded));
        })
        .catch(err => {
            console.error("Error response:", err.response);
            dispatch({
                type: GET_ERRORS,
                payload: err.response ? err.response.data : { message: "Login failed" }
            });
        });
};

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    };
};

export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
};

export const logoutUser = () => dispatch => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userPermission");
    localStorage.removeItem("email");
    setAuthToken(false);
    dispatch(setCurrentUser({}));
};
