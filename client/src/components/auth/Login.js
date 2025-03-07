import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../../actions/authActions";
import classnames from "classnames";
import { Link } from "react-router-dom";  // ✅ Import Link for navigation

class Login extends Component {
    constructor() {
        super();
        this.state = {
            email: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }

        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email,
            password: this.state.password
        };
        this.props.loginUser(userData);
    };

    render() {
        const { errors } = this.state;
        return (
            <div className="container login-page">
                <div className="row mt-5">
                    <div className="col-md-5 mx-auto mt-5 card shadow-lg p-4">
                        <div className="card-body">
                            <h2 className="text-center text-primary mt-3">Login</h2>
                            <form noValidate onSubmit={this.onSubmit} className="white">
                                <label htmlFor="email">Email</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.email}
                                    id="email"
                                    type="email"
                                    className={classnames("form-control", { invalid: errors.email })}
                                />
                                <span className="text-danger">{errors.email}</span>
                                <br />
                                <label htmlFor="password">Password</label>
                                <input
                                    onChange={this.onChange}
                                    value={this.state.password}
                                    id="password"
                                    type="password"
                                    className={classnames("form-control", { invalid: errors.password })}
                                />
                                <span className="text-danger">{errors.password}</span>

                                
                                <div className="d-flex align-items-center justify-content-between mt-4">
                                    <button type="submit" className="btn btn-primary px-4">
                                        Login
                                    </button>
                                         <div className="d-flex align-items-center">
                                        <span className="text-secondary mr-2">Don't have an account?</span>
                                        <Link to="/register" className="btn btn-outline-primary">
                                            Sign Up
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

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { loginUser }
)(Login);
