import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { User, Mail, BookOpen, PenTool, Camera, Edit2, ShoppingBag, Trash2, Heart, Plus, X, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

export default function Profile({ setAuth }) {
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [orders, setOrders] = useState([]); // New state for orders
    const [editingImage, setEditingImage] = useState(false);
    const [imageUrl, setImageUrl] = useState("");

    const getProfile = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users/profile", {
                headers: { token: localStorage.getItem("token") }
            });
            setUser(response.data.user);
            setImageUrl(response.data.user.profile_image || "");
        } catch (err) {
            console.error(err.message);
        }
    };

    const getMyPosts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users/my-posts", {
                headers: { token: localStorage.getItem("token") }
            });
            setPosts(response.data);
        } catch (err) {
            console.error(err.message);
        }
    }

    // New function to get orders
    const getOrders = async () => {
        try {
            const response = await axios.get("http://localhost:5000/orders", {
                headers: { token: localStorage.getItem("token") }
            });
            setOrders(response.data);
        } catch (err) {
            console.error(err.message);
        }
    }

    const [likedPosts, setLikedPosts] = useState([]);

    const getLikedPosts = async () => {
        try {
            const response = await axios.get("http://localhost:5000/interaction/liked", {
                headers: { token: localStorage.getItem("token") }
            });
            setLikedPosts(response.data);
        } catch (err) {
            console.error(err.message);
        }
    }

    const updateImage = async (e) => {
        e.preventDefault();
        try {
            await axios.put("http://localhost:5000/users/update-image", {
                profile_image: imageUrl
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            setEditingImage(false);
            getProfile();
        } catch (err) {
            console.error(err.message);
        }
    }

    const [experiences, setExperiences] = useState([]);
    const [educations, setEducations] = useState([]);
    const [showExpModal, setShowExpModal] = useState(false);
    const [showEduModal, setShowEduModal] = useState(false);

    // Form States
    const [expForm, setExpForm] = useState({ company: '', duration: '', work_type: '', skills: '', description: '' });
    const [eduForm, setEduForm] = useState({ university: '', duration: '', course: '' });

    const getExperiences = async () => {
        try {
            const response = await axios.get("http://localhost:5000/profile/experience", {
                headers: { token: localStorage.getItem("token") }
            });
            setExperiences(response.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const getEducations = async () => {
        try {
            const response = await axios.get("http://localhost:5000/profile/education", {
                headers: { token: localStorage.getItem("token") }
            });
            setEducations(response.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const addExperience = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/profile/experience", expForm, {
                headers: { token: localStorage.getItem("token") }
            });
            setExpForm({ company: '', duration: '', work_type: '', skills: '', description: '' });
            setShowExpModal(false);
            getExperiences();
            toast.success("Experience added!");
        } catch (err) {
            console.error(err.message);
        }
    };

    const addEducation = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/profile/education", eduForm, {
                headers: { token: localStorage.getItem("token") }
            });
            setEduForm({ university: '', duration: '', course: '' });
            setShowEduModal(false);
            getEducations();
            toast.success("Education added!");
        } catch (err) {
            console.error(err.message);
        }
    };

    const deleteExperience = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/profile/experience/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setExperiences(experiences.filter(exp => exp.id !== id));
            toast.success("Experience deleted");
        } catch (err) {
            console.error(err.message);
        }
    };

    const deleteEducation = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/profile/education/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setEducations(educations.filter(edu => edu.id !== id));
            toast.success("Education deleted");
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getProfile();
        getMyPosts();
        getOrders();
        getLikedPosts();
        getExperiences();
        getEducations();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar setAuth={setAuth} />
            <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8">

                {/* Profile Header Card */}
                <div className="bg-white dark:bg-[#1e293b] shadow-xl rounded-2xl overflow-hidden mb-10 transform transition-all hover:shadow-2xl duration-300 border border-gray-100 dark:border-slate-800">
                    <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 h-40 sm:h-52 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black opacity-10 pattern-grid-lg"></div>
                    </div>

                    <div className="px-6 sm:px-10 pb-8">
                        <div className="relative flex flex-col sm:flex-row items-end -mt-16 sm:-mt-20 mb-6">
                            <div className="relative group">
                                <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white dark:border-slate-800 bg-white dark:bg-slate-700 shadow-lg flex items-center justify-center text-5xl font-bold text-indigo-500 overflow-hidden z-10 relative">
                                    {user.profile_image ? (
                                        <img src={user.profile_image} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        user.username?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <button
                                    onClick={() => setEditingImage(!editingImage)}
                                    className="absolute bottom-2 right-2 bg-indigo-600 text-white rounded-full p-2.5 shadow-lg border-2 border-white hover:bg-indigo-700 transition-transform transform hover:scale-110 z-20"
                                    title="Edit Profile Picture"
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="mt-4 sm:mt-0 sm:ml-6 flex-1 text-center sm:text-left">
                                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{user.first_name} {user.last_name}</h2>
                                <p className="text-lg font-medium text-indigo-600 dark:text-indigo-400">@{user.username}</p>
                            </div>

                            <div className="flex space-x-6 mt-6 sm:mt-0">
                                <div className="text-center group cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg transition-colors">
                                    <span className="block text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{user.followers_count || 0}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Followers</span>
                                </div>
                                <div className="text-center group cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/30 p-2 rounded-lg transition-colors">
                                    <span className="block text-2xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{user.following_count || 0}</span>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">Following</span>
                                </div>
                            </div>
                        </div>

                        {editingImage && (
                            <div className="mt-6 p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 animate-fadeIn">
                                <form onSubmit={updateImage} className="flex gap-4">
                                    <input
                                        type="url"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="Paste your new profile image URL here..."
                                        className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 border border-indigo-200 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition-colors"
                                        autoFocus
                                    />
                                    <button type="submit" className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 shadow-md transition-transform active:scale-95">
                                        Save Update
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Experience & Education */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Experience Section */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-8 transform transition-all hover:shadow-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg mr-3">
                                        <Briefcase className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    Experience
                                </h4>
                                <button onClick={() => setShowExpModal(true)} className="flex items-center text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 px-4 py-2 rounded-full transition-colors">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </button>
                            </div>

                            {experiences.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                                    <p className="text-gray-500 dark:text-gray-400 italic">Share your professional journey</p>
                                </div>
                            ) : (
                                <div className="relative border-l-2 border-indigo-100 dark:border-indigo-900/50 ml-3 space-y-8 pb-2">
                                    {experiences.map((exp) => (
                                        <div key={exp.id} className="relative pl-8 group">
                                            {/* Timeline Dot */}
                                            <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-white dark:bg-slate-700 border-4 border-indigo-400 group-hover:border-indigo-600 transition-colors"></div>

                                            <div className="bg-gray-50 dark:bg-slate-800/50 hover:bg-white dark:hover:bg-slate-800 p-5 rounded-xl border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-md transition-all duration-300 relative">
                                                <button onClick={() => deleteExperience(exp.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>

                                                <h5 className="text-lg font-bold text-gray-900 dark:text-white">{exp.company}</h5>
                                                <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-2">{exp.work_type} • {exp.duration}</p>
                                                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">{exp.description}</p>

                                                {exp.skills && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {exp.skills.split(',').map((skill, i) => (
                                                            <span key={i} className="text-xs font-medium bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-slate-600 px-2 py-1 rounded-md shadow-sm">
                                                                {skill.trim()}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Education Section */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-8 transform transition-all hover:shadow-xl border border-gray-100 dark:border-slate-800">
                            <div className="flex justify-between items-center mb-6">
                                <h4 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                                    <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-3">
                                        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    Education
                                </h4>
                                <button onClick={() => setShowEduModal(true)} className="flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 px-4 py-2 rounded-full transition-colors">
                                    <Plus className="w-4 h-4 mr-1" /> Add
                                </button>
                            </div>

                            {educations.length === 0 ? (
                                <div className="text-center py-8 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-gray-300 dark:border-slate-700">
                                    <p className="text-gray-500 dark:text-gray-400 italic">Add your academic achievements</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {educations.map((edu) => (
                                        <div key={edu.id} className="relative bg-gradient-to-br from-gray-50 to-white dark:from-slate-800/50 dark:to-slate-800 p-5 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-900/50 hover:shadow-md transition-all duration-300 group">
                                            <button onClick={() => deleteEducation(edu.id)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <h5 className="text-lg font-bold text-gray-900 dark:text-white">{edu.university}</h5>
                                            <p className="text-base text-gray-700 dark:text-gray-300 font-medium">{edu.course}</p>
                                            <div className="mt-2 inline-block bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs px-2 py-1 rounded font-semibold">
                                                {edu.duration}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Stats & Side Content */}
                    <div className="space-y-8">
                        {/* Order History Widget */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-slate-800 pb-3">
                                <ShoppingBag className="w-5 h-5 mr-2 text-indigo-500" />
                                Recent Orders
                            </h3>
                            {orders.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-4">No recent activity.</p>
                            ) : (
                                <ul className="space-y-4">
                                    {orders.slice(0, 3).map((order) => (
                                        <li key={order.order_id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors">
                                            <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                                                {order.image_url ? (
                                                    <img className="h-full w-full object-cover" src={order.image_url} alt="" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold">{order.title?.charAt(0)}</div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{order.title}</p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">From {order.first_name}</p>
                                            </div>
                                            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">Done</span>
                                        </li>
                                    ))}
                                    {orders.length > 3 && (
                                        <button className="w-full text-center text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline pt-2">View All Orders</button>
                                    )}
                                </ul>
                            )}
                        </div>

                        {/* Liked Skills Mini-Grid */}
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-slate-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center border-b border-gray-100 dark:border-slate-800 pb-3">
                                <Heart className="w-5 h-5 mr-2 text-red-500 hover:scale-110 transition-transform cursor-pointer" />
                                Liked Skills
                            </h3>
                            {likedPosts.length === 0 ? (
                                <p className="text-gray-400 text-sm text-center py-4">Nothing liked yet.</p>
                            ) : (
                                <div className="grid grid-cols-2 gap-2">
                                    {likedPosts.slice(0, 4).map(post => (
                                        <div key={post.id} className="aspect-square bg-gray-100 dark:bg-slate-700 rounded-lg overflow-hidden relative group cursor-pointer">
                                            {post.image_url ? (
                                                <img src={post.image_url} alt={post.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center bg-indigo-50 dark:bg-indigo-900/30 text-indigo-300 dark:text-indigo-700 font-bold">Swap</div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <p className="text-white text-xs font-medium truncate">{post.title}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* My Posted Skills - Full Width Bottom */}
                <div className="mt-12">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 pl-2 border-l-4 border-indigo-600">My Posted Skills</h3>
                    {posts.length === 0 ? (
                        <div className="text-center py-12 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3">
                                <PenTool className="h-full w-full" />
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No skills posted</h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by sharing your expertise with the world.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {posts.map(post => (
                                <div key={post.id} className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-100 dark:border-slate-800">
                                    <div className="relative h-48 overflow-hidden">
                                        {post.image_url ? (
                                            <img className="h-full w-full object-cover transform group-hover:scale-110 transition-transform duration-500" src={post.image_url} alt={post.title} />
                                        ) : (
                                            <div className="h-full w-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center text-gray-400 dark:text-gray-500">No Image</div>
                                        )}
                                        <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { }} className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-indigo-600"><Edit2 className="w-4 h-4" /></button>
                                            <button
                                                onClick={async () => {
                                                    try {
                                                        await axios.delete(`http://localhost:5000/posts/${post.id}`, { headers: { token: localStorage.getItem("token") } });
                                                        setPosts(posts.filter(p => p.id !== post.id));
                                                        toast.success("Skill deleted");
                                                    } catch (err) { console.error(err); }
                                                }}
                                                className="bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 block">{post.category || 'General'}</span>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 truncate" title={post.title}>{post.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2 h-10">{post.description}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-slate-800">
                                            <span className="text-xs text-gray-400 dark:text-gray-500">{formatDistanceToNow(new Date(post.created_at))} ago</span>
                                            {post.fee && <span className="font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-3 py-1 rounded-full text-xs">{post.fee}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showExpModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all scale-100 border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Experience</h3>
                            <button onClick={() => setShowExpModal(false)} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"><X className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
                        </div>
                        <form onSubmit={addExperience} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company / Organization</label>
                                <input className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" placeholder="e.g. Google" value={expForm.company} onChange={e => setExpForm({ ...expForm, company: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                    <input className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. 2020-Present" value={expForm.duration} onChange={e => setExpForm({ ...expForm, duration: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                    <input className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. Full-time" value={expForm.work_type} onChange={e => setExpForm({ ...expForm, work_type: e.target.value })} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Skills Used</label>
                                <input className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g. React, Node.js" value={expForm.skills} onChange={e => setExpForm({ ...expForm, skills: e.target.value })} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                <textarea className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Briefly describe your role..." rows="3" value={expForm.description} onChange={e => setExpForm({ ...expForm, description: e.target.value })}></textarea>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-indigo-700 shadow-lg hover:shadow-indigo-500/30 transition-all">Save Experience</button>
                        </form>
                    </div>
                </div>
            )}

            {showEduModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                    <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-lg w-full p-8 transform transition-all scale-100 border border-gray-100 dark:border-slate-700">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Add Education</h3>
                            <button onClick={() => setShowEduModal(false)} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors"><X className="w-5 h-5 text-gray-500 dark:text-gray-400" /></button>
                        </div>
                        <form onSubmit={addEducation} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">University / School</label>
                                <input className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors" placeholder="e.g. Stanford University" value={eduForm.university} onChange={e => setEduForm({ ...eduForm, university: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Degree / Course</label>
                                <input className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors" placeholder="e.g. BSc Computer Science" value={eduForm.course} onChange={e => setEduForm({ ...eduForm, course: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
                                <input className="w-full bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-colors" placeholder="e.g. 2018-2022" value={eduForm.duration} onChange={e => setEduForm({ ...eduForm, duration: e.target.value })} />
                            </div>
                            <button type="submit" className="w-full bg-blue-600 text-white py-3.5 rounded-lg font-bold text-lg hover:bg-blue-700 shadow-lg hover:shadow-blue-500/30 transition-all">Save Education</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
