import React from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUser } from "../../actions/userActions";
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import { Modal } from "bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import FieldRenderer from '../common/FieldRenderer';

class UserUpdateModal extends React.Component {
    constructor(props) {
        super(props);
        const { record = {}, metadata = [] } = props;
        const initState = metadata.reduce((acc, field) => {
            acc[field.name] = record[field.name] || '';
            return acc;
        }, {});
        this.state = { ...initState, password: '', errors: {}, modalInstance: null };
    }

    componentDidMount() {
        this.setState({ modalInstance: new Modal(document.getElementById('update-user-modal')) });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.record !== this.props.record) {
            this.setState({ ...this.props.record });
        }
        if (prevProps.errors !== this.props.errors) {
            this.setState({ errors: this.props.errors });
        }
    }

    onChange = (value) => {
        this.setState({ ...value });
    };

    onUserUpdate = (e) => {
        e.preventDefault();
        const { id, name, email, password, userPermission } = this.state;
        const updatedUser = { _id: id, name, email, password, userPermission };
    
        this.props.updateUser(updatedUser, (success) => {
            if (success) {
                toast.success("User updated successfully", { position: toast.POSITION.TOP_CENTER });
    
                // Close the modal properly
                if (this.modalInstance) {
                    this.modalInstance.hide();
                }
    
                // Manually remove Bootstrap modal classes if needed
                const modalElement = document.getElementById("update-user-modal");
                if (modalElement) {
                    modalElement.classList.remove("show");
                    modalElement.style.display = "none";
                    document.body.classList.remove("modal-open");
                    const modalBackdrop = document.querySelector(".modal-backdrop");
                    if (modalBackdrop) modalBackdrop.remove();
                }
            } else {
                toast.error("Failed to update user. Please try again.");
            }
        });
    };
    
    
    

    renderFields = () => {
        return this.props.metadata.map((field) => (
            <FieldRenderer
                key={field.name}
                changeHandler={this.onChange}
                label={field.label}
                value={this.state[field.name]}
                error={this.state.errors[field.name]}
                name={field.name}
                type={field.type}
                className={field.className || ''}
                {...field}
            />
        ));
    };

    render() {
        return (
            <div className="modal fade" id="update-user-modal" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Update User</h4>
                        </div>
                        <div className="modal-body">
                            <form noValidate onSubmit={this.onUserUpdate} id="update-user">
                                {this.renderFields()}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button form="update-user" type="submit" className="btn btn-primary">Update User</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

UserUpdateModal.propTypes = {
    updateUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors,
});

export default connect(mapStateToProps, { updateUser })(withRouter(UserUpdateModal));
