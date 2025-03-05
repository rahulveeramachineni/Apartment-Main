import React from 'react'
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import $ from 'jquery';
import axios from "axios";
import ReactDatatable from '@ashvin27/react-datatable';

import 'react-toastify/dist/ReactToastify.css';

class BookingFacilityListModal extends React.Component {

    constructor() {
        super();
        this.state = {
            records: [],
            errors: {},
        };

        this.config = {
            page_size: 10,
            length_menu: [ 10, 20, 50 ],
            filename: "BookingFacilitys",
            no_data_text: 'No booking found!',
            button: {
                excel: true,
                print: true,
                csv: true
            },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: {
                    first: "First",
                    previous: "Previous",
                    next: "Next",
                    last: "Last"
                }
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.columns = [
            {
                key: "bookingId",
                text: "BookingId",
                className: "bookingId",
                align: "left",
                sortable: true,
            },
            {
                key: "facilityName",
                text: "FacilityName",
                className: "facilityName",
                align: "left",
                sortable: true
            },
            {
                key: "bookedUser",
                text: "User Email",
                className: "bookedUser",
                align: "left",
                sortable: true
            },
            {
                key: "date",
                text: "Date",
                className: "date",
                align: "left",
                sortable: true
            }
        ];
    }

    componentDidMount() {
        this.getData();
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
            $('#view-booking-facility-modal').modal('hide');
            toast(nextProps.auth.user.data.message, {
                position: toast.POSITION.TOP_CENTER
            });
        }
    }

    getData() {
        axios
            .post("/api/booking-facility-data")
            .then(res => {
                console.log("res.data : ", res.data)
                let recordData = res.data.map((data, i) => {
                    return {
                        bookingId: data.bookingId, facilityName: data.facilitys.facilityName, numberofPersonsAllowed: data.facilitys.numberofPersonsAllowed, bookedUser: data.email, date: data.date
                    }
                })
                this.setState({ records: recordData})
            })
            .catch()
    }

    pageChange(pageData) {
        console.log("OnPageChange", pageData);
    }

    render() {
        const { errors } = this.state;
        return (
            <div>
                <div className="modal fade" id="view-booking-facility-modal" data-reset="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">List of Booked Facility</h4>
                                <button type="button" className="close" data-dismiss="modal">&times;</button>
                            </div>
                            <div className="modal-body">
                                <ReactDatatable
                                    config={this.config}
                                    records={this.state.records}
                                    columns={this.columns}
                                    onPageChange={this.pageChange.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

BookingFacilityListModal.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps
)(withRouter(BookingFacilityListModal));
