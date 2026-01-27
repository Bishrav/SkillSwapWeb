import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Login({ setAuth }) {
    const [inputs, setInputs] = useState({
        username: "",
        password: ""
    });

    const { username, password } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { username, password };
            const response = await axios.post("http://localhost:5000/auth/login", body);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                sessionStorage.setItem("justLoggedIn", "true");
                setAuth(true);

                console.log("Login successful, token set");
            } else {
                setAuth(false);
                alert("Login failed: No token received");
            }
        } catch (err) {
            const errorMessage = err.response?.data || err.message || "Error logging in";
            console.error("Login error:", errorMessage);
            toast.error(typeof errorMessage === 'string' ? errorMessage : "An unexpected error occurred");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-gray-200">
            <div className="w-full max-w-md p-10 space-y-8 bg-[#111111] rounded-2xl shadow-2xl border border-[#222] transform transition-all duration-500">
                <div className="text-center animate-fadeInDown">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Welcome Back</h1>
                    <p className="text-sm text-gray-400">Sign in to continue your journey</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmitForm}>
                    <div className="space-y-4">
                        <div className="relative group">
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="Username"
                                value={username}
                                onChange={onChange}
                            />
                            <label htmlFor="username" className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Username</label>
                        </div>
                        <div className="relative group">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                            />
                            <label htmlFor="password" className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Password</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 px-4 flex justify-center items-center gap-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#111111] transition-all shadow-lg hover:shadow-indigo-600/20"
                    >
                        Sign in
                    </button>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign up now
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
