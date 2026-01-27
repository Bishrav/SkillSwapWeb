import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Heart, Bookmark, Award, ShoppingCart, UserPlus, UserCheck, Search, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import Footer from '../components/Footer';
import PostCard from '../components/PostCard';

export default function Home({ setAuth }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [likedPosts, setLikedPosts] = useState({});

    const getPosts = async (searchTerm = "") => {
        try {
            const response = await axios.get(`http://localhost:5000/posts?search=${searchTerm}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setPosts(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        getPosts(search);
    };

    const handleFollow = async (userId) => {
        try {
            await axios.post(`http://localhost:5000/follow/${userId}`, {}, {
                headers: { token: localStorage.getItem("token") }
            });

            setPosts(posts.map(post =>
                post.user_id === userId ? { ...post, is_following: true } : post
            ));
            toast.success("Followed successfully!");
        } catch (err) {
            toast.error(err.response?.data || "Error following user");
        }
    };

    const handleUnfollow = async (userId) => {
        try {
            await axios.delete(`http://localhost:5000/follow/${userId}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setPosts(posts.map(post =>
                post.user_id === userId ? { ...post, is_following: false } : post
            ));
            toast.success("Unfollowed");
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToCart = async (postId) => {
        try {
            const response = await axios.post("http://localhost:5000/cart/add", {
                post_id: postId
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            toast.success(response.data, {
                icon: '🛒',
                duration: 3000,
                style: {
                    borderRadius: '12px',
                    background: '#10b981',
                    color: '#fff',
                    fontWeight: 'bold',
                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.2)'
                },
            });
        } catch (err) {
            toast.error(err.response?.data || "Error adding to cart");
        }
    };

    const handleLike = async (postId) => {
        setPosts(posts.map(post =>
            post.id === postId
                ? {
                    ...post,
                    is_liked: !post.is_liked,
                    likes_count: post.is_liked ? parseInt(post.likes_count) - 1 : parseInt(post.likes_count) + 1
                }
                : post
        ));

        setLikedPosts(prev => ({ ...prev, [postId]: true }));

        setTimeout(() => {
            setLikedPosts(prev => ({ ...prev, [postId]: false }));
        }, 300);

        try {
            const response = await axios.post("http://localhost:5000/interaction/like", {
                post_id: postId
            }, {
                headers: { token: localStorage.getItem("token") }
            });

            if (response.data.match) {
                toast.success(`IT'S A MATCH! You matched with ${response.data.matched_with}`, {
                    duration: 5000,
                    icon: '🔥',
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSave = async (postId) => {
        try {
            const response = await axios.post("http://localhost:5000/interaction/save", {
                post_id: postId
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            toast.success(response.data);
        } catch (err) {
            toast.error(err.response?.data || "Error saving post");
        }
    };

    useEffect(() => {
        getPosts();


        if (sessionStorage.getItem("justLoggedIn")) {
            toast.success("Welcome to SkillSwap! Explore and trade skills.", {
                duration: 4000,
                icon: '🚀',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
            sessionStorage.removeItem("justLoggedIn");
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] flex flex-col transition-colors duration-300">
            <Navbar setAuth={setAuth} />

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 flex-grow w-full">
                <div className="px-4 py-6 sm:px-0">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold heading-premium">Discover Skills</h1>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="relative w-full md:w-96">
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="Search for skills, categories..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                        </form>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : (
                        <div className="space-y-8 max-w-2xl mx-auto">
                            {posts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    likedPosts={likedPosts}
                                    handleLike={handleLike}
                                    handleSave={handleSave}
                                    handleAddToCart={handleAddToCart}
                                    handleFollow={handleFollow}
                                    handleUnfollow={handleUnfollow}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
