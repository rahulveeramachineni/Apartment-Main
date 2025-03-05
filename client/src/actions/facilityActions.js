import axios from "axios";
import {
    GET_ERRORS,
    FACILITY_ADD,
    FACILITY_UPDATE,
    BOOKINGFACILITY_ADD
} from "./types";

export const addFacility = (facilityData, history) => dispatch => {
    axios
        .post("/api/facility-add", facilityData)
        .then(res =>
            dispatch({
                type: FACILITY_ADD,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};

export const addBookingFacility = (facilityData, history) => dispatch => {
    axios
        .post("/api/booking-facility-add", facilityData)
        .then(res =>
            dispatch({
                type: BOOKINGFACILITY_ADD,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};


export const updateFacility = (facilityData) => dispatch => {
    axios
        .post("/api/facility-update", facilityData)
        .then(res =>
            dispatch({
                type: FACILITY_UPDATE,
                payload: res,
            })
        ).catch(err =>
        dispatch({
            type: GET_ERRORS,
            payload: err.response.data
        })
    );
};
