import React from 'react';
import classnames from "classnames";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { addEmployee } from '../../actions/employeeActions';
import { withRouter } from "react-router-dom";
import { toast } from 'react-toastify';
import { Modal } from "bootstrap"; // Import Bootstrap's Modal API
import 'react-toastify/dist/ReactToastify.css';

class EmployeeAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      employeeId: "",
      employeeName: "",
      phoneNumber: "",
      profession: "",
      errors: {},
    };
  }

  componentDidUpdate(prevProps) {
    // Update errors if they change
    if (prevProps.errors !== this.props.errors) {
      this.setState({ errors: this.props.errors });
    }
    // When a successful response arrives, hide the modal and display a toast
    if (
      this.props.auth &&
      this.props.auth.user &&
      this.props.auth.user.data &&
      this.props.auth.user.data.message &&
      prevProps.auth.user !== this.props.auth.user
    ) {
      this.handleClose(); // close modal on successful response
      toast(this.props.auth.user.data.message, {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  }

  handleClose = () => {
    const modalElement = document.getElementById("add-employee-modal");
    if (modalElement) {
      const modalInstance =
        Modal.getInstance(modalElement) || new Modal(modalElement);
      modalInstance.hide();
    }
  };

  onChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  onEmployeeAdd = (e) => {
    e.preventDefault();
    console.log("Submitting employee:", this.state);
    const newEmployee = {
      employeeId: this.state.employeeId,
      employeeName: this.state.employeeName,
      phoneNumber: this.state.phoneNumber,
      profession: this.state.profession,
    };
    this.props.addEmployee(newEmployee, this.props.history);
  };

  render() {
    const { errors } = this.state;
    return (
      <div>
        <div
          className="modal fade"
          id="add-employee-modal"
          tabIndex="-1"
          aria-hidden="true"
          data-reset="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Add Employee Data</h4>
                {/* Updated close button for Bootstrap 5 */}
                <button 
                  type="button" 
                  onClick={this.handleClose} 
                  className="btn-close" 
                  aria-label="Close">
                </button>
              </div>
              <div className="modal-body">
                <form noValidate onSubmit={this.onEmployeeAdd} id="add-employee">
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="employeeId">Employee Id</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.employeeId}
                        id="employeeId"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.employeeId,
                        })}
                      />
                      <span className="text-danger">{errors.employeeId}</span>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="employeeName">Employee Name</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.employeeName}
                        id="employeeName"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.employeeName,
                        })}
                      />
                      <span className="text-danger">{errors.employeeName}</span>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="phoneNumber">Phone Number</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.phoneNumber}
                        id="phoneNumber"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.phoneNumber,
                        })}
                      />
                      <span className="text-danger">{errors.phoneNumber}</span>
                    </div>
                  </div>
                  <div className="row mt-2">
                    <div className="col-md-3">
                      <label htmlFor="profession">Profession</label>
                    </div>
                    <div className="col-md-9">
                      <input
                        onChange={this.onChange}
                        value={this.state.profession}
                        id="profession"
                        type="text"
                        className={classnames("form-control", {
                          invalid: errors.profession,
                        })}
                      />
                      <span className="text-danger">{errors.profession}</span>
                    </div>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  onClick={this.handleClose} 
                  className="btn btn-secondary">
                  Close
                </button>
                <button
                  form="add-employee"
                  type="submit"
                  className="btn btn-primary"
                >
                  Add Employee
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

EmployeeAddModal.propTypes = {
  addEmployee: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(
  mapStateToProps,
  { addEmployee }
)(withRouter(EmployeeAddModal));
