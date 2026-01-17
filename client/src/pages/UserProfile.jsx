import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import { User, UserPlus, UserCheck, MapPin, Calendar, Mail, BookOpen, Briefcase, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfile({ setAuth }) {
    const { id } = useParams();
    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState({});

    const getProfile = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setUser(response.data.user);
        } catch (err) {
            console.error(err.message);
            toast.error("Could not load user profile");
        }
    };

    const getUserPosts = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/posts/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
            setLoading(false);
        }
    };

    const handleFollow = async () => {
        try {
            await axios.post(`http://localhost:5000/follow/${id}`, {}, {
                headers: { token: localStorage.getItem("token") }
            });
            setUser({ ...user, is_following: true, followers_count: Number(user.followers_count) + 1 });
            toast.success("Followed successfully!");
        } catch (err) {
            toast.error(err.response?.data || "Error following user");
        }
    };

    const handleUnfollow = async () => {
        try {
            await axios.delete(`http://localhost:5000/follow/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setUser({ ...user, is_following: false, followers_count: Number(user.followers_count) - 1 });
            toast.success("Unfollowed");
        } catch (err) {
            console.error(err);
        }
    };

    // Reusing handlers (consider moving these to a hook later)
    const handleLike = async (postId) => {
        setPosts(posts.map(p =>
            p.id === postId
                ? {
                    ...p,
                    is_liked: !p.is_liked,
                    likes_count: p.is_liked ? parseInt(p.likes_count) - 1 : parseInt(p.likes_count) + 1
                }
                : p
        ));
        setLikedPosts(prev => ({ ...prev, [postId]: true }));
        setTimeout(() => setLikedPosts(prev => ({ ...prev, [postId]: false })), 300);

        try {
            await axios.post("http://localhost:5000/interaction/like", { post_id: postId }, {
                headers: { token: localStorage.getItem("token") }
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (postId) => {
        try {
            const response = await axios.post("http://localhost:5000/interaction/save", { post_id: postId }, {
                headers: { token: localStorage.getItem("token") }
            });
            toast.success(response.data);
        } catch (err) {
            toast.error(err.response?.data || "Error saving post");
        }
    };

    const handleAddToCart = async (postId) => {
        try {
            const response = await axios.post("http://localhost:5000/cart/add", { post_id: postId }, {
                headers: { token: localStorage.getItem("token") }
            });
            toast.success(response.data, { icon: '🛒' });
        } catch (err) {
            toast.error(err.response?.data || "Error adding to cart");
        }
    };

    useEffect(() => {
        getProfile();
        getUserPosts();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex justify-center items-center transition-colors">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
            <Navbar setAuth={setAuth} />

            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-48 sm:h-64"></div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 sm:-mt-32 pb-12">
                <div className="relative mb-8">
                    <div className="bg-white dark:bg-[#1e293b] rounded-3xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-slate-800 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-6 items-start">
                            {/* Profile Image */}
                            <div className="relative -mt-20 sm:-mt-24">
                                <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-4 border-white dark:border-slate-800 shadow-lg bg-gray-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400">
                                    {user.profile_image ? (
                                        <img src={user.profile_image} alt="" className="h-full w-full object-cover" />
                                    ) : (
                                        user.username?.charAt(0).toUpperCase()
                                    )}
                                </div>
                            </div>

                            {/* User Info */}
                            <div className="flex-1 space-y-4 w-full">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{user.first_name} {user.last_name}</h1>
                                        <p className="text-indigo-600 dark:text-indigo-400 font-medium">@{user.username}</p>
                                    </div>
                                    {user.is_self ? (
                                        <span className="px-6 py-2 bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400 rounded-full font-bold border border-gray-200 dark:border-slate-700 cursor-default">
                                            You
                                        </span>
                                    ) : user.is_following ? (
                                        <button onClick={handleUnfollow} className="flex items-center px-6 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                                            <UserCheck className="w-5 h-5 mr-2" /> Following
                                        </button>
                                    ) : (
                                        <button onClick={handleFollow} className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 shadow-lg transform hover:scale-105 transition-all">
                                            <UserPlus className="w-5 h-5 mr-2" /> Follow
                                        </button>
                                    )}
                                </div>

                                <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400 text-sm">
                                    {user.skills && (
                                        <div className="flex items-center">
                                            <Award className="w-4 h-4 mr-2 text-indigo-500" />
                                            Skills: {user.skills}
                                        </div>
                                    )}
                                    {user.education && (
                                        <div className="flex items-center">
                                            <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                                            {user.education}
                                        </div>
                                    )}
                                    <div className="flex items-center text-gray-900 dark:text-white font-bold">
                                        <span className="text-xl mr-1">{user.input_count || user.followers_count}</span>
                                        <span className="font-normal text-gray-500 dark:text-gray-400">Followers</span>
                                    </div>
                                    <div className="flex items-center text-gray-900 dark:text-white font-bold">
                                        <span className="text-xl mr-1">{user.following_count}</span>
                                        <span className="font-normal text-gray-500 dark:text-gray-400">Following</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white px-2">Posts & Skills</h2>
                    {posts.length === 0 ? (
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl p-12 text-center text-gray-500 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-slate-800 transition-colors">
                            <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                            <p className="text-lg">No posts yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    likedPosts={likedPosts}
                                    handleLike={handleLike}
                                    handleSave={handleSave}
                                    handleAddToCart={handleAddToCart}
                                    handleFollow={() => { }} // Already on profile, no need to follow from card
                                    handleUnfollow={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
