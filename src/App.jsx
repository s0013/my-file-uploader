// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import FileUploader from './FileU';
import Header from './Header';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = (status) => {
        setIsAuthenticated(status);
    };

    const handleRegister = (status) => {
        setIsAuthenticated(status);
    };

    return (
        <Router>
            <div className="min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/" element={<Login onLogin={handleLogin} />} />
                    <Route path="/Header" />
                    <Route path="/login" element={<Login onLogin={handleLogin} />} />
                    <Route path="/register" element={<Register onRegister={handleRegister} />} />
                    <Route path="/upload" element={isAuthenticated ? <FileUploader /> : <Login onLogin={handleLogin} />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
