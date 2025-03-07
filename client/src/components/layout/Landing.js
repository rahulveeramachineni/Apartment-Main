import React from "react";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-3xl p-10 max-w-lg text-center">
                <h1 className="text-4xl font-bold text-white mb-4 animate-fadeIn">Welcome to Our App 🚀</h1>
                <p className="text-lg text-gray-200 mb-6">
                    A minimal full-stack app with user authentication via JWTs.
                </p>
                
                <div className="flex justify-center gap-6">
                    <Link 
                        to="/register"
                        className="px-6 py-3 text-lg font-semibold text-white bg-blue-500 rounded-full shadow-lg transform transition hover:bg-blue-600 hover:scale-105"
                    >
                        Register
                    </Link>
                    <Link 
                        to="/login"
                        className="px-6 py-3 text-lg font-semibold text-gray-900 bg-white rounded-full shadow-lg transform transition hover:bg-gray-200 hover:scale-105"
                    >
                        Log In
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Landing;
