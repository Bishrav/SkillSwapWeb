import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';

export default function AddSkill({ setAuth }) {
    const navigate = useNavigate();
    const [inputs, setInputs] = useState({
        title: "",
        description: "",
        category: "",
        image_url: "",
        fee: ""
    });

    const { title, description, category, image_url, fee } = inputs;

    const onChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/posts", {
                title, description, category, image_url, fee
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            console.log(response.data);
            navigate("/");
        } catch (err) {
            console.error(err.response?.data || "Error creating post");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
            <Navbar setAuth={setAuth} />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="bg-white dark:bg-[#1e293b] shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-800 transition-colors">
                    <div className="px-6 py-8 sm:p-10 bg-indigo-600">
                        <h2 className="text-3xl font-extrabold text-white">Share Your Skill</h2>
                        <p className="mt-2 text-indigo-200">Post a skill you want to teach or trade with others.</p>
                    </div>
                    <div className="px-6 py-8 sm:p-10">
                        <form className="space-y-6" onSubmit={onSubmitForm}>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Skill Title</label>
                                <input type="text" name="title" id="title" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" value={title} onChange={onChange} placeholder="e.g. Advanced Guitar Lessons" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                    <input type="text" name="category" id="category" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" value={category} onChange={onChange} placeholder="e.g. Music" />
                                </div>
                                <div>
                                    <label htmlFor="fee" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Fee / Exchange (Optional)</label>
                                    <input type="text" name="fee" id="fee" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" value={fee} onChange={onChange} placeholder="e.g. $20/hr or Trade for Coding" />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                                <input type="url" name="image_url" id="image_url" className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" value={image_url} onChange={onChange} placeholder="https://example.com/image.jpg" />
                                {image_url && (
                                    <div className="mt-2 aspect-w-16 aspect-h-9 relative rounded-lg overflow-hidden bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700">
                                        <p className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 text-sm">Preview</p>
                                        <img
                                            src={image_url}
                                            alt="Preview"
                                            className="relative w-full h-48 object-cover"
                                            onError={(e) => { e.target.style.display = 'none' }}
                                            onLoad={(e) => { e.target.style.display = 'block'; e.target.previousElementSibling.style.display = 'none' }}
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea id="description" name="description" rows="4" required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors" value={description} onChange={onChange} placeholder="Describe what you can teach..."></textarea>
                            </div>
                            <div>
                                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg hover:shadow-indigo-600/30 transition-all">
                                    Post Skill
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
