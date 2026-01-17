import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

export default function Matches({ setAuth }) {
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        // Need a route to get matches. 
        // "if the other person posted also likes then they can trade their skill"
        // I haven't implemented a GET /matches endpoint. I should.
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
            <Navbar setAuth={setAuth} />
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Matches</h1>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Coming soon... (Backend endpoint needed)</p>
            </div>
        </div>
    );
}
