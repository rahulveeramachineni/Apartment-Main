import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
import ReactDatatable from "@ashvin27/react-datatable";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Modal } from "bootstrap";
import DefaultLayout from "../layout/DefaultLayout";
import FlatUpdateModal from "../partials/FlatUpdateModal";
import FlatAddModal from "../partials/FlatAddModal";
import flatMetadata from "./metadata/flatMetaData";

class Flats extends Component {
    constructor(props) {
        super(props);

        this.state = {
            records: [],
            currentRecord: {
                _id: "",
                flatNumber: "",
                flatOwnerName: "",
                flatOwnerNumber: "",
                flatOwnerProfession: "",
            },
        };

        this.getData = this.getData.bind(this);
        this.editRecord = this.editRecord.bind(this);
        this.deleteRecord = this.deleteRecord.bind(this);
        this.showAddFlatModal = this.showAddFlatModal.bind(this);
        this.hideAddFlatModal = this.hideAddFlatModal.bind(this);

        this.columns = [
            { key: "_id", text: "Id", className: "id", align: "left", sortable: true },
            { key: "flatNumber", text: "Flat Number", className: "flatNumber", align: "left", sortable: true },
            { key: "flatOwnerName", text: "Owner Name", className: "flatOwnerName", align: "left", sortable: true },
            { key: "flatOwnerNumber", text: "Owner Number", className: "flatOwnerNumber", align: "left", sortable: true },
            { key: "flatOwnerProfession", text: "Profession", className: "flatOwnerProfession", align: "left", sortable: true },
            { key: "date", text: "Date", className: "date", align: "left", sortable: true },
        ];

        if (localStorage.getItem("userPermission") === "Admin") {
            this.columns.push({
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: (record) => (
                    <Fragment>
                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() => this.editRecord(record)}
                            style={{ marginRight: "5px" }}>
                            <i className="fa fa-edit"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => this.deleteRecord(record)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                ),
            });
        }

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Flats",
            no_data_text: "No flats found!",
            button: { excel: true, print: true, csv: true },
            language: {
                length_menu: "Show _MENU_ results per page",
                filter: "Search records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: { first: "First", previous: "Previous", next: "Next", last: "Last" },
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };
    }

    componentDidMount() {
        this.checkAuth();
        this.getData();
    }

    checkAuth() {
        const token = localStorage.getItem("jwtToken");
        if (!token || token === "undefined") {
            console.warn("Authentication token not found. Redirecting to login.");
            toast.error("Session expired. Please log in again.");
            window.location.href = "/login";
        }
    }

    async getData() {
        try {
            const res = await axios.post("/api/flat-data", {}, this.getAuthHeaders());
            this.setState({ records: res.data });
        } catch (error) {
            console.error("Error fetching flats:", error);
            toast.error("Failed to load flats. Unauthorized access.");
        }
    }

    editRecord(record) {
        this.setState({ currentRecord: record });
    }

    async deleteRecord(record) {
        try {
            const res = await axios.post("/api/flat-delete", { _id: record._id }, this.getAuthHeaders());

            if (res.status === 200) {
                toast.success(res.data.message, { position: toast.POSITION.TOP_CENTER });
                this.getData();
            }
        } catch (error) {
            console.error("Delete failed:", error);
            toast.error("Failed to delete. Unauthorized access.");
        }
    }

    getAuthHeaders() {
        const token = localStorage.getItem("jwtToken");
        return token ? { headers: { Authorization: token } } : {};
    }

    showAddFlatModal() {
        const modalElement = document.getElementById("add-flat-modal");
        if (modalElement) {
            const modalInstance = new Modal(modalElement);
            modalInstance.show();
        }
    }

    hideAddFlatModal() {
        const modalElement = document.getElementById("add-flat-modal");
        if (modalElement) {
            const modalInstance = Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();
        }
    }

    render() {
        // Check if user is Admin or FlatOwners to show the add button.
        const canAddFlat = localStorage.getItem("userPermission") === "Admin" ||
                           localStorage.getItem("userPermission") === "FlatOwners";

        return (
            <DefaultLayout>
                <ToastContainer />
                <FlatAddModal hideModal={this.hideAddFlatModal} />
                <FlatUpdateModal record={this.state.currentRecord} metadata={flatMetadata} />

                <div id="page-content-wrapper">
                    <div className="container-fluid">
                        <button className="btn btn-link mt-3" id="menu-toggle">
                            <FontAwesomeIcon icon={faList} />
                        </button>

                        {canAddFlat && (
                            <button className="btn btn-outline-primary float-right mt-3 mr-2" onClick={this.showAddFlatModal}>
                                <FontAwesomeIcon icon={faPlus} /> Add Flat
                            </button>
                        )}

                        <h1 className="mt-2 text-primary">Flat List</h1>
                        <ReactDatatable config={this.config} records={this.state.records} columns={this.columns} />
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

Flats.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    records: state.records,
});

export default connect(mapStateToProps)(Flats);