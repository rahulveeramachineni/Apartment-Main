import React, { Component, Fragment } from "react";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList, faPlus } from "@fortawesome/free-solid-svg-icons";
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

class Users extends Component {
    constructor(props) {
        super(props);

        this.columns = [
            { key: "_id", text: "Id", className: "id", align: "left", sortable: true },
            { key: "name", text: "Name", className: "name", align: "left", sortable: true },
            { key: "email", text: "Email", className: "email", align: "left", sortable: true },
            { key: "userPermission", text: "Permission", className: "userPermission", align: "left", sortable: true },
            { key: "date", text: "Date", className: "date", align: "left", sortable: true },
            {
                key: "action",
                text: "Action",
                className: "action",
                width: 100,
                align: "left",
                sortable: false,
                cell: (record) => {
                    return (
                        <Fragment>
                            <button
                                className="btn btn-primary btn-sm"
                                onClick={() => this.editRecord(record)}
                                style={{ marginRight: "5px" }}
                            >
                                <i className="fa fa-edit"></i>
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => this.deleteRecord(record)}>
                                <i className="fa fa-trash"></i>
                            </button>
                        </Fragment>
                    );
                },
            },
        ];

        this.config = {
            page_size: 10,
            length_menu: [10, 20, 50],
            filename: "Users",
            no_data_text: "No user found!",
            button: { excel: true, print: true, csv: true },
            language: {
                length_menu: "Show _MENU_ result per page",
                filter: "Filter in records...",
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
            currentRecord: {
                id: "",
                name: "",
                email: "",
                password: "",
                password2: "",
                userPermission: "",
            },
        };
    }

    componentDidMount() {
        this.getData();
    }

    componentDidUpdate(prevProps) {
        if (this.props.records !== prevProps.records) {
            this.getData();
        }
    }

    getData = () => {
        const token = localStorage.getItem("token");
        axios
            .post("/api/user-data", {}, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                this.setState({ records: res.data });
            })
            .catch((error) => {
                console.error("Error fetching user data:", error);
                toast.error("Failed to load users.");
            });
    };

    editRecord = (record) => {
        this.setState({ currentRecord: record });
    };

    deleteRecord = (record) => {
        const token = localStorage.getItem("token");

        axios
            .post("/api/user-delete", { _id: record._id }, { headers: { Authorization: `Bearer ${token}` } })
            .then((res) => {
                if (res.status === 200) {
                    toast.success(res.data.message, { position: toast.POSITION.TOP_CENTER });
                    this.getData();
                }
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                toast.error("Failed to delete user.");
            });
    };

    openAddUserModal = () => {
        const modalElement = document.getElementById("add-user-modal");
        const modalInstance = new Modal(modalElement);
        modalInstance.show();
    };

    render() {
        return (
            <DefaultLayout>
                <ToastContainer />
                <UserAddModal />
                <UserUpdateModal record={this.state.currentRecord} metadata={UserMetadata} />
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
