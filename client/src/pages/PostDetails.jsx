import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';

export default function PostDetails({ setAuth }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [likedPosts, setLikedPosts] = useState({});

    const getPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/posts/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setPost(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
            toast.error("Could not load post");
            navigate('/');
        }
    };
    const handleLike = async (postId) => {
        setPost(prev => ({
            ...prev,
            is_liked: !prev.is_liked,
            likes_count: prev.is_liked ? parseInt(prev.likes_count) - 1 : parseInt(prev.likes_count) + 1
        }));
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

    const handleFollow = async (userId) => {
        try {
            await axios.post(`http://localhost:5000/follow/${userId}`, {}, {
                headers: { token: localStorage.getItem("token") }
            });
            setPost({ ...post, is_following: true });
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
            setPost({ ...post, is_following: false });
            toast.success("Unfollowed");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        getPost();
    }, [id]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] transition-colors duration-300">
            <Navbar setAuth={setAuth} />
            <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <button onClick={() => navigate(-1)} className="mb-6 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium flex items-center transition-colors">
                    ← Back
                </button>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : post ? (
                    <PostCard
                        post={post}
                        likedPosts={likedPosts}
                        handleLike={handleLike}
                        handleSave={handleSave}
                        handleAddToCart={handleAddToCart}
                        handleFollow={handleFollow}
                        handleUnfollow={handleUnfollow}
                    />
                ) : null}
            </div>
        </div>
    );
}
