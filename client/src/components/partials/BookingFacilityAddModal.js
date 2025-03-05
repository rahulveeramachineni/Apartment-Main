import React from 'react'
import Select from 'react-select'
import classnames from "classnames";
import PropTypes, { object } from "prop-types";
import { connect } from "react-redux";
import { addBookingFacility } from '../../actions/facilityActions';
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";

import 'react-toastify/dist/ReactToastify.css';

class BookingFacilityAddModal extends React.Component {

    constructor() {
        super();
        this.state = {
            bookingId: "",
            facilitys: [],
            numberOfPeople: "",
            profession: "",
            facility: object,
            user: localStorage.email,
            errors: {},
            records: []
        };
    }

    componentDidMount() {
        console.log("localStorage.email : ", localStorage.email);
        console.log("this.state.user : ", this.state.user);
        this.getFacilityData();
    }

    componentWillReceiveProps(nextProps) {
        debugger;
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
        if (nextProps.auth !== undefined
            && nextProps.auth.user !== undefined
            && nextProps.auth.user.data !== undefined
            && nextProps.auth.user.data.message !== undefined) {
            $('#add-booking-facility-modal').modal('hide');
            toast(nextProps.auth.user.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    handleChange = e => {
        console.log("selectedOption : ", e);
        this.setState({ facility : e.value});
    }

    onBookingFacilityAdd = e => {
       
        e.preventDefault();
        const newBookingFacility = {
            bookingId: this.state.bookingId,
            facilitys: this.state.facility,
            email: this.state.user
        };
        this.props.addBookingFacility(newBookingFacility, this.props.history);
    };

    getFacilityData() {
        axios
            .post("/api/facility-data")
            .then(res => {
                this.setState({ facilitys: res.data})
            })
    }

    render() {
        const { errors } = this.state;
        let options = this.state.facilitys.map(function (facility) {
            return { value: facility._id, label: facility.facilityName };
          })
        return (
            <div>
                <div className="modal fade" id="add-booking-facility-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Book Facility</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <form noValidate onSubmit={this.onBookingFacilityAdd} id="add-booking-facility">
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="bookingId">Booking Id</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                onChange={this.onChange}
                                                value={this.state.bookingId}
                                                id="bookingId"
                                                type="text"
                                                error={errors.bookingId}
                                                className={classnames("form-control", {
                                                    invalid: errors.bookingId
                                                })}/>
                                            <span className="text-danger">{errors.bookingId}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="facilitys">Facilities</label>
                                        </div>
                                        <div className="col-md-9">
                                            <Select options={options} onChange={this.handleChange} />
                                            <span className="text-danger">{errors.facilitys}</span>
                                        </div>
                                    </div>
                                    <div className="row mt-2">
                                        <div className="col-md-3">
                                            <label htmlFor="user">Email</label>
                                        </div>
                                        <div className="col-md-9">
                                            <input
                                                value={this.state.user}
                                                id="user"
                                                type="text"
                                                className={classnames("form-control", {
                                                    invalid: errors.user
                                                })}
                                                readonly
                                            />
                                            <span className="text-danger">{errors.user}</span>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button
                                    form="add-booking-facility"
                                    type="submit"
                                    className="btn btn-primary">
                                    Book Facility
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

BookingFacilityAddModal.propTypes = {
    addBookingFacility: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { addBookingFacility }
)(withRouter(BookingFacilityAddModal));
