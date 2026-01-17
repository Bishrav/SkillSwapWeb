import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { formatDistanceToNow } from 'date-fns';
import { Heart, Award } from 'lucide-react';

export default function Saved({ setAuth }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSaved = async () => {
        try {
            const response = await axios.get("http://localhost:5000/interaction/saved", {
                headers: { token: localStorage.getItem("token") }
            });
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        getSaved();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar setAuth={setAuth} />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white flex items-center">
                            <Heart className="w-8 h-8 mr-3 text-red-500 fill-current animate-pulse-slow" />
                            Saved Skills
                        </h1>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">Skills you've earmarked for later.</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : posts.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors">
                        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-full mb-6">
                            <Heart className="w-12 h-12 text-red-300 dark:text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No saved skills yet</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Tap the heart icon on skills you like to save them here.</p>
                        <a href="/" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors shadow-lg">
                            Discover Skills
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post, index) => (
                            <div key={post.id} className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full animate-fadeInUp border border-gray-100 dark:border-slate-800" style={{ animationDelay: `${index * 100}ms` }}>
                                {/* Image Container */}
                                <div className="h-48 w-full overflow-hidden relative">
                                    {post.image_url ? (
                                        <img className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-700" src={post.image_url} alt={post.title} />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
                                            <span className="text-gray-400 dark:text-gray-500 font-bold text-lg">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-indigo-800 dark:text-indigo-300 text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm">
                                            {post.category || 'General'}
                                        </span>
                                    </div>
                                    {/* Quick Actions Overlay (Optional) */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                                        <Link to={`/post/${post.post_id || post.id}`} className="bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            View Details
                                        </Link>
                                    </div>
                                </div>

                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" title={post.title}>{post.title}</h3>
                                        {post.fee && <span className="text-green-600 dark:text-green-400 font-extrabold text-sm whitespace-nowrap bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md border border-green-100 dark:border-green-900/30">{post.fee}</span>}
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                                        {post.description}
                                    </p>

                                    <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                                                {post.username?.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">@{post.username}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            {formatDistanceToNow(new Date(post.created_at))} ago
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
