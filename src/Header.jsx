// src/Header.jsx
import React from 'react';

const Header = () => {
    return (
        <header className=" bg-sky-700 shadow-md p-6 rounded-lg mb-6 text-center transition-transform duration-200 hover:shadow-xl">
            <h1 className="text-4xl font-semibold text-white">File Uploader</h1>
            <p className="mt-2 text-lg text-white">Upload your files with ease</p>
        </header>
    );
};

export default Header;
