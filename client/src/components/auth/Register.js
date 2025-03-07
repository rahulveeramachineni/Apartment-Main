import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { registerUser } from "../../actions/authActions";
import classnames from "classnames";


class Register extends Component {

    constructor() {
        super();
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.errors !== this.props.errors) {
            this.setState({ errors: this.props.errors });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
            userPermission: "Outsider"
        };
        this.props.registerUser(newUser, this.props.history);
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container register-page">
                <div className="row mt-5">
                    <div className="col-md-5 mx-auto mt-5 card shadow-lg p-4">
                        <div className="card-body">
                            <h2 className="text-center text-primary">Register</h2>
                            <p className="text-center text-muted">Create your account</p>

                            <form noValidate onSubmit={this.onSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.name}
                                        id="name"
                                        type="text"
                                        className={classnames("form-control", { "is-invalid": errors.name })}
                                    />
                                    <div className="invalid-feedback">{errors.name}</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.email}
                                        id="email"
                                        type="email"
                                        className={classnames("form-control", { "is-invalid": errors.email })}
                                    />
                                    <div className="invalid-feedback">{errors.email}</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.password}
                                        id="password"
                                        type="password"
                                        className={classnames("form-control", { "is-invalid": errors.password })}
                                    />
                                    <div className="invalid-feedback">{errors.password}</div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password2" className="form-label">Confirm Password</label>
                                    <input
                                        onChange={this.onChange}
                                        value={this.state.password2}
                                        id="password2"
                                        type="password"
                                        className={classnames("form-control", { "is-invalid": errors.password2 })}
                                    />
                                    <div className="invalid-feedback">{errors.password2}</div>
                                </div>

                                {/* ✅ Buttons aligned horizontally */}
                                <div className="d-flex align-items-center justify-content-between mt-4">
                                    <button type="submit" className="btn btn-primary px-4">
                                        Sign Up
                                    </button>

                                    <div className="d-flex align-items-center">
                                        <span className="text-secondary me-2">Already have an account?</span>
                                        <Link to="/login" className="btn btn-outline-primary">
                                            Login
                                        </Link>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { registerUser }
)(withRouter(Register));
