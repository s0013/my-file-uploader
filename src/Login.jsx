// src/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/login', { username, password });
            localStorage.setItem('token', response.data.token);
            onLogin(true);
            navigate('/upload'); // Redirect to the upload page after successful login
        } catch (error) {
            setErrorMessage('Login failed. Please check your username and password.');
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex justify-center items-center flex-grow bg-gray-100">
                <div className="bg-white shadow-lg rounded-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl">
                    <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Login</h2>
                    {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
                            />
                        </div>
                        <div className="mb-4">
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="border border-gray-300 p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-150"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 w-full shadow-md hover:shadow-lg"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-4 text-center">
                        <span className="text-gray-600">Don't have an account? </span>
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 hover:underline"
                        >
                            Register here
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
