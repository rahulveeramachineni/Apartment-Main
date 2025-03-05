import React from "react";
import Select from "react-select";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addUser } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { Modal } from "bootstrap";

import "react-toastify/dist/ReactToastify.css";

class UserAddModal extends React.Component {
    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            userPermission: "",
            errors: {},
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onHandleChange = (selectedOption) => {
        this.setState({ userPermission: selectedOption.value });
    };

    onUserAdd = (e) => {
        e.preventDefault();
    
        const { name, email, password, password2, userPermission } = this.state;
    
        if (password !== password2) {
            toast.error("Passwords do not match!");
            return;
        }
    
        if (!userPermission) {
            toast.error("Please select a user permission.");
            return;
        }
    
        // Include password2 in the payload
        const newUser = { name, email, password, password2, userPermission };
    
        this.props.addUser(newUser, this.props.history);
    
        // Show success message
        toast.success("User added successfully!");
    
        // Close modal properly
        const modalElement = document.getElementById("add-user-modal");
        const modalInstance = Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }
    
        // Clear form after submission
        this.setState({
            name: "",
            email: "",
            password: "",
            password2: "",
            userPermission: "",
        });
    };    

    render() {
        const options = [
            { value: "Admin", label: "Admin" },
            { value: "FlatOwners", label: "FlatOwners" },
            { value: "Tenant", label: "Tenant" },
            { value: "Employee", label: "Employee" },
        ];

        return (
            <div className="modal fade" id="add-user-modal" data-bs-backdrop="static">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Add User</h4>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <form onSubmit={this.onUserAdd}>
                                <input
                                    type="text"
                                    id="name"
                                    value={this.state.name}
                                    onChange={this.onChange}
                                    placeholder="Name"
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="email"
                                    id="email"
                                    value={this.state.email}
                                    onChange={this.onChange}
                                    placeholder="Email"
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                    placeholder="Password"
                                    className="form-control mb-2"
                                    required
                                />
                                <input
                                    type="password"
                                    id="password2"
                                    value={this.state.password2}
                                    onChange={this.onChange}
                                    placeholder="Confirm Password"
                                    className="form-control mb-2"
                                    required
                                />
                                <Select
                                    options={options}
                                    onChange={this.onHandleChange}
                                    placeholder="Select Permission"
                                    className="mb-2"
                                    required
                                />
                                <button type="submit" className="btn btn-primary mt-2">Add User</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UserAddModal.propTypes = {
    addUser: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
};

export default connect(null, { addUser })(withRouter(UserAddModal));
