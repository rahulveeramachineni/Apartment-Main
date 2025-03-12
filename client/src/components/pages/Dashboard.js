import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import Navbar from "../partials/Navbar";
import Sidebar from "../partials/Sidebar";
import Flats from "./Flats";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";

class Dashboard extends Component {
    constructor() {
        super();
        this.state = {
            isAdmin: false,
            isFlatOwner: false,
            isTenant: false,
            isEmployee: false,
            isOutsider: false,
            isCameraOpen: false,
            capturedImage: null
        };
        this.videoRef = React.createRef();
        this.canvasRef = React.createRef();
    }

    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    componentDidMount() {
        switch(localStorage.userPermission) {
            case 'Admin': 
                this.setState({ isAdmin: true });
                break;
            case 'FlatOwners': 
                this.setState({ isFlatOwner: true });
                break;
            case 'Tenant': 
                this.setState({ isTenant: true });
                break;
            case 'Employee': 
                this.setState({ isEmployee: true });
                break;
            case 'Outsider':   
                this.setState({ isOutsider: true });
                break;
            default:
                break;
        }
    }

    startCamera = () => {
        this.setState({ isCameraOpen: true }, () => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    this.videoRef.current.srcObject = stream;
                })
                .catch(err => console.error("Error accessing camera: ", err));
        });
    };

    capturePhoto = () => {
        const canvas = this.canvasRef.current;
        const video = this.videoRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageDataUrl = canvas.toDataURL("image/png");
        this.setState({ capturedImage: imageDataUrl });

        // Stop the video stream
        const stream = video.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }

        this.setState({ isCameraOpen: false });
    };

    retakePhoto = () => {
        this.setState({ capturedImage: null }, this.startCamera);
    };
    

    render() {
        if(this.state.isOutsider) {
            return <Flats />;
        }

        return (
            <div>
                <Navbar />
                <div className="d-flex" id="wrapper">
                    <Sidebar
                        isAdmin={this.state.isAdmin}
                        isFlatOwner={this.state.isFlatOwner}
                        isTenant={this.state.isTenant}
                        isEmployee={this.state.isEmployee}
                    />
                    <div id="page-content-wrapper">
                        <div className="container-fluid">
                            <button className="btn btn-link mt-2" id="menu-toggle">
                                <FontAwesomeIcon icon={faList} />
                            </button>

                            {this.state.isAdmin &&
                                <div>
                                    <div className="row px-2">
                                        {/* Other admin cards */}
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Users</h5>
                                                    <p className="card-text">Create, Edit, Delete Users.</p>
                                                    <a href="/users" className="btn btn-dark">
                                                        <i className="fa fa-user" aria-hidden="true"></i> Go to Users
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Flat</h5>
                                                    <p className="card-text">Add, Edit and Delete the Flat.</p>
                                                    <a href="/flats" className="btn btn-dark">
                                                        <i className="fa fa-building" aria-hidden="true"></i> Flat Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Facility</h5>
                                                    <p className="card-text">Add, Edit and Delete the Facility.</p>
                                                    <a href="/facilitys" className="btn btn-dark">
                                                        <i className="fa fa-gamepad" aria-hidden="true"></i> Facilities
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Employee</h5>
                                                    <p className="card-text">Add, Edit and Delete the Employee.</p>
                                                    <a href="/employees" className="btn btn-dark">
                                                        <i className="fa fa-user" aria-hidden="true"></i> Employee Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row px-2">
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Tenant</h5>
                                                    <p className="card-text">Add, Edit and Delete the Tenant.</p>
                                                    <a href="/tenants" className="btn btn-dark">
                                                        <i className="fa fa-building" aria-hidden="true"></i> Tenant Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {this.state.isFlatOwner &&
                                <div>
                                    <div className="row px-2">
                                        {/* Flat Owner cards */}
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Flat</h5>
                                                    <p className="card-text">Add, Edit and Delete the Flat.</p>
                                                    <a href="/flats" className="btn btn-dark">
                                                        <i className="fa fa-building" aria-hidden="true"></i> Flat Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Facility</h5>
                                                    <p className="card-text">Add, Edit and Delete the Facility.</p>
                                                    <a href="/facilitys" className="btn btn-dark">
                                                        <i className="fa fa-gamepad" aria-hidden="true"></i> Facilities
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Employee</h5>
                                                    <p className="card-text">Add, Edit and Delete the Employee.</p>
                                                    <a href="/employees" className="btn btn-dark">
                                                        <i className="fa fa-user" aria-hidden="true"></i> Employee Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Tenant</h5>
                                                    <p className="card-text">Add, Edit and Delete the Tenant.</p>
                                                    <a href="/tenants" className="btn btn-dark">
                                                        <i className="fa fa-building" aria-hidden="true"></i> Tenant Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {this.state.isTenant &&
                                <div>
                                    <div className="row px-2">
                                        {/* Tenant cards */}
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Facility</h5>
                                                    <p className="card-text">Add, Edit and Delete the Facility.</p>
                                                    <a href="/facilitys" className="btn btn-dark">
                                                        <i className="fa fa-gamepad" aria-hidden="true"></i> Facilities
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Employee</h5>
                                                    <p className="card-text">Add, Edit and Delete the Employee.</p>
                                                    <a href="/employees" className="btn btn-dark">
                                                        <i className="fa fa-user" aria-hidden="true"></i> Employee Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Tenant</h5>
                                                    <p className="card-text">Add, Edit and Delete the Tenant.</p>
                                                    <a href="/tenants" className="btn btn-dark">
                                                        <i className="fa fa-building" aria-hidden="true"></i> Tenant Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }

                            {this.state.isEmployee &&
                                <div>
                                    <div className="row px-2">
                                        {/* Employee cards */}
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Facility</h5>
                                                    <p className="card-text">Add, Edit and Delete the Facility.</p>
                                                    <a href="/facilitys" className="btn btn-dark">
                                                        <i className="fa fa-gamepad" aria-hidden="true"></i> Facilities
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
                                            <div className="card bg-light shadow-lg">
                                                <div className="card-body">
                                                    <h5 className="card-title">Employee</h5>
                                                    <p className="card-text">Add, Edit and Delete the Employee.</p>
                                                    <a href="/employees" className="btn btn-dark">
                                                        <i className="fa fa-user" aria-hidden="true"></i> Employee Details
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-3 p-sm-2">
    <div className="card bg-light shadow-lg">
        <div className="card-body">
            <h5 className="card-title">Capture Photo</h5>
            <p className="card-text">Use camera to capture a photo.</p>

            {!this.state.isCameraOpen && !this.state.capturedImage && (
                <button className="btn btn-dark" onClick={this.startCamera}>
                    Open Camera
                </button>
            )}

            {this.state.isCameraOpen && (
                <div>
                    <video ref={this.videoRef} autoPlay className="w-100"></video>
                    <button className="btn btn-success mt-2" onClick={this.capturePhoto}>
                        Capture Photo
                    </button>
                </div>
            )}

            {this.state.capturedImage && (
                <div>
                    <img src={this.state.capturedImage} alt="Captured" className="img-fluid mt-2" />
                    <button className="btn btn-primary mt-2">Upload Photo</button>
                    <button className="btn btn-warning mt-2 ml-2" onClick={this.retakePhoto}>
                        Retake Photo
                    </button>
                </div>
            )}

            <canvas ref={this.canvasRef} style={{ display: "none" }}></canvas>
        </div>
    </div>
</div>

                                    </div>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Dashboard.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { logoutUser }
)(Dashboard);
