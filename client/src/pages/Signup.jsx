import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function Signup({ setAuth }) {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        first_name: "",
        last_name: "",
        email: "",
        education: "",
        skills: ""
    });

    const { username, password, first_name, last_name, email, education, skills } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { username, password, first_name, last_name, email, education, skills };
            const response = await axios.post("http://localhost:5000/auth/signup", body);

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
                sessionStorage.setItem("justLoggedIn", "true");
                toast.success("Account created successfully!");
                setAuth(true);
            } else {
                setAuth(false);
                alert("Signup failed");
            }
        } catch (err) {
            const errorMessage = err.response?.data || err.message || "Error signing up";
            console.error("Signup error:", errorMessage);
            toast.error(typeof errorMessage === 'string' ? errorMessage : "An unexpected error occurred");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a] text-gray-200 py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl p-10 space-y-8 bg-[#111111] rounded-2xl shadow-2xl border border-[#222] transform transition-all duration-500">
                <div className="text-center animate-fadeInDown">
                    <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Create Account</h1>
                    <p className="text-sm text-gray-400">Join SkillSwap and start trading skills today</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={onSubmitForm}>
                    <div className="grid grid-cols-1 gap-y-6 gap-x-6 sm:grid-cols-2">
                        <div className="relative group">
                            <input
                                name="first_name"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="First Name"
                                value={first_name}
                                onChange={onChange}
                            />
                            <label className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">First Name</label>
                        </div>
                        <div className="relative group">
                            <input
                                name="last_name"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="Last Name"
                                value={last_name}
                                onChange={onChange}
                            />
                            <label className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Last Name</label>
                        </div>

                        <div className="relative group sm:col-span-2">
                            <input
                                name="username"
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="Username"
                                value={username}
                                onChange={onChange}
                            />
                            <label className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Username</label>
                        </div>

                        <div className="relative group sm:col-span-2">
                            <input
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="Email Address"
                                value={email}
                                onChange={onChange}
                            />
                            <label className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Email Address</label>
                        </div>

                        <div className="relative group sm:col-span-2">
                            <input
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="Password"
                                value={password}
                                onChange={onChange}
                            />
                            <label className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Password</label>
                        </div>

                        <div className="relative group sm:col-span-2">
                            <input
                                name="education"
                                type="text"
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer"
                                placeholder="Education"
                                value={education}
                                onChange={onChange}
                            />
                            <label className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Education (Optional)</label>
                        </div>

                        <div className="relative group sm:col-span-2">
                            <textarea
                                name="skills"
                                required
                                className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333] rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all text-white placeholder-transparent peer resize-none"
                                placeholder="Your Skills"
                                value={skills}
                                onChange={onChange}
                                rows="3"
                            />
                            <label className="absolute left-4 -top-2.5 text-xs text-indigo-500 bg-[#111111] px-1 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-indigo-500 peer-focus:bg-[#111111] peer-focus:px-1 pointer-events-none">Your Skills (comma separated)</label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full py-3.5 px-4 flex justify-center items-center gap-2 border border-transparent text-sm font-semibold rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#111111] transition-all shadow-lg hover:shadow-indigo-600/20"
                        >
                            Create Account
                        </button>
                    </div>
                </form>
                <div className="text-center mt-6">
                    <p className="text-sm text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
