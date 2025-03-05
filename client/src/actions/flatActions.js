import axios from "axios";
import {
    GET_ERRORS,
    FLAT_ADD,
    FLAT_UPDATE
} from "./types";

// Use the backend URL from environment variables
const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const addFlat = (flatData, history) => dispatch => {
    axios
        .post(`${BASE_URL}/flat-add`, flatData) // Use template literals to insert the base URL
        .then(res =>
            dispatch({
                type: FLAT_ADD,
                payload: res.data, // Use res.data instead of res to get actual response data
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response ? err.response.data : { error: "Server error" }
        })
    );
};

export const updateFlat = (flatData) => dispatch => {
    axios
        .post(`${BASE_URL}/flat-update`, flatData) // Use the same BASE_URL variable
        .then(res =>
            dispatch({
                type: FLAT_UPDATE,
                payload: res.data,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response ? err.response.data : { error: "Server error" }
        })
    );
};
