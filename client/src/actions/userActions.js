import axios from "axios";
import { GET_ERRORS, USER_ADD, USER_UPDATE } from "./types";

export const addUser = (userData, history) => (dispatch) => {
    console.log(userData);
    axios
        .post("/api/user-add", userData)
        .then((res) =>
            dispatch({
                type: USER_ADD,
                payload: res.data, // Ensure payload contains response data
            })
        )
        .catch((err) =>
            dispatch({
                type: GET_ERRORS,
                payload: err.response ? err.response.data : { message: "An error occurred" },
            })
        );
};

export const updateUser = (userData, callback) => async (dispatch) => {
    try {
        console.log("Updating user with data:", userData);
        const res = await axios.post("/api/user-update", userData);

        if (res.status === 200) {
            dispatch({
                type: USER_UPDATE,
                payload: res.data, // Ensure payload contains response data
            });
            if (callback) callback(true); // Return true for success
        } else {
            if (callback) callback(false); // Return false for failure
        }
    } catch (err) {
        console.error("Error updating user:", err);
        dispatch({
            type: GET_ERRORS,
            payload: err.response ? err.response.data : { message: "Failed to update user" },
        });
        if (callback) callback(false); // Return false for failure
    }
};
