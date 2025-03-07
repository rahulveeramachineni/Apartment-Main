import React, { Component, Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import ReactDatatable from "@ashvin27/react-datatable";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import UserAddModal from "../partials/UserAddModal";
import UserUpdateModal from "../partials/UserUpdateModal";
import { toast, ToastContainer } from "react-toastify";
import DefaultLayout from "../layout/DefaultLayout";
import UserMetadata from "./metadata/userMetadata";
import { Modal } from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

class Users extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            { key: "_id", text: "Id", className: "id", align: "left", sortable: true },
            { key: "name", text: "Name", className: "name", align: "left", sortable: true },
            { key: "email", text: "Email", className: "email", align: "left", sortable: true },
            { key: "userPermission", text: "Role", className: "role", align: "left", sortable: true }, // 🔹 Changed "userPermission" to "role"
            { key: "date", text: "Date", className: "date", align: "left", sortable: true },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: (record) => (
                    <Fragment>
                        <button className="btn btn-primary btn-sm" onClick={() => this.openEditModal(record)}>
                            <i className="fa fa-edit"></i>
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => this.deleteRecord(record)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </Fragment>
                ),
            },
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Users",
            no_data_text: "No user found!",
            button: { excel: true, print: true, csv: true },
            language: {
                length_menu: "Show _MENU_ results per page",
                filter: "Filter records...",
                info: "Showing _START_ to _END_ of _TOTAL_ records",
                pagination: { first: "First", previous: "Previous", next: "Next", last: "Last" },
            },
            show_length_menu: true,
            show_filter: true,
            show_pagination: true,
            show_info: true,
        };

        this.state = {
            records: [],
            currentRecord: {},
        };
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post("/api/user-data", {}, { headers: { Authorization: `Bearer ${token}` } });
            console.log(res);
            this.setState({ records: res.data });
        } catch (error) {
            console.error("Error fetching user data:", error);
            toast.error("Failed to load users.");
        }
    };

    openEditModal = (record) => {
        this.setState({ currentRecord: record }, () => {
            const modalElement = document.getElementById("update-user-modal");
            if (modalElement) {
                const modalInstance = new Modal(modalElement);
                modalInstance.show();
            }
        });
    };

    openAddUserModal = () => {
        const modalElement = document.getElementById("add-user-modal");
        if (modalElement) {
            const modalInstance = new Modal(modalElement);
            modalInstance.show();
        }
    };

    addUser = async (userData) => {
        const token = localStorage.getItem("token");
        try {
            await axios.post(
                "/api/user-add",
                { ...userData, role: "tenant" }, // 🔹 Ensuring user is always added as a tenant
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("User added successfully!");
            this.getData();
        } catch (error) {
            console.error("Error adding user:", error);
            toast.error("Failed to add user.");
        }
    };

    deleteRecord = async (record) => {
        const token = localStorage.getItem("token");
        try {
            const res = await axios.post("/api/user-delete", { _id: record._id }, { headers: { Authorization: `Bearer ${token}` } });
            if (res.status === 200) {
                toast.success(res.data.message, { position: toast.POSITION.TOP_CENTER });
                this.getData();
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("Failed to delete user.");
        }
    };

    render() {
        return (
            <DefaultLayout>
                <ToastContainer />
                <UserAddModal onSuccess={this.getData} addUser={this.addUser} /> {/* 🔹 Passed addUser */}
                <UserUpdateModal record={this.state.currentRecord} metadata={UserMetadata} onSuccess={this.getData} />
                <div id="page-content-wrapper">
                    <div className="container-fluid">
                        <button className="btn btn-outline-primary float-right mt-3 mr-2" onClick={this.openAddUserModal}>
                            <FontAwesomeIcon icon={faPlus} /> Add User
                        </button>
                        <h1 className="mt-2 text-primary">Users List</h1>
                        <ReactDatatable config={this.config} records={this.state.records} columns={this.columns} />
                    </div>
                </div>
            </DefaultLayout>
        );
    }
}

Users.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    records: state.records,
});

export default connect(mapStateToProps)(Users);
