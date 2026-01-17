import React, { useState } from 'react';
import { Heart, Bookmark, ShoppingCart, UserPlus, UserCheck, MessageCircle, Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function PostCard({ post, likedPosts, handleLike, handleSave, handleAddToCart, handleFollow, handleUnfollow }) {
    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    const getComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/comments/${post.id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setComments(response.data);
        } catch (err) {
            console.error(err.message);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await axios.post(`http://localhost:5000/comments/${post.id}`, {
                content: newComment
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (err) {
            console.error(err.message);
            toast.error("Failed to post comment");
        }
    };

    const toggleComments = () => {
        if (!showComments) {
            getComments();
        }
        setShowComments(!showComments);
    };

    return (
        <div className="bg-white dark:bg-[#1e293b] overflow-hidden shadow-lg rounded-xl flex flex-col mb-6 border border-gray-100 dark:border-slate-800 animate-fadeIn transition-colors duration-300">
            <div className="p-4 flex justify-between items-start">
                <div className="flex items-center">
                    <Link to={`/profile/${post.user_id}`} className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center text-white font-bold text-xl overflow-hidden cursor-pointer hover:opacity-90">
                        {post.profile_image ? (
                            <img src={post.profile_image} alt="" className="h-full w-full object-cover" />
                        ) : (
                            post.username?.charAt(0).toUpperCase()
                        )}
                    </Link>
                    <div className="ml-3">
                        <Link to={`/profile/${post.user_id}`} className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2 hover:underline cursor-pointer">
                            {post.first_name} {post.last_name}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400">@{post.username} • {formatDistanceToNow(new Date(post.created_at))} ago</p>
                    </div>
                </div>

                {post.is_following ? (
                    <button onClick={() => handleUnfollow(post.user_id)} className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1.5 rounded-full hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors">
                        <UserCheck className="w-4 h-4 mr-1.5" /> Following
                    </button>
                ) : (
                    <button onClick={() => handleFollow(post.user_id)} className="flex items-center text-indigo-600 dark:text-indigo-400 font-bold text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 px-3 py-1.5 rounded-full transition-colors">
                        <UserPlus className="w-4 h-4 mr-1.5" /> Follow
                    </button>
                )}
            </div>

            <div className="px-4 pb-3">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">{post.title}</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{post.category || 'General'}</span>
                    {post.fee && <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{post.fee}</span>}
                    {/* Assuming post.price might be a new field, if not, use post.fee */}
                    {post.price && <span className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">${post.price}</span>}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">{post.description}</p>
            </div>

            {post.image_url && (
                <div className="relative h-64 w-full overflow-hidden bg-gray-100 dark:bg-slate-800">
                    <img src={post.image_url} alt={post.title} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}

            <div className="px-4 py-3 border-t border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-800/50">
                <div className="flex items-center space-x-6">
                    <button onClick={() => handleLike(post.id)} className="flex items-center group">
                        <Heart className={`w-6 h-6 mr-1.5 transition-all ${post.is_liked ? 'fill-red-500 text-red-500 scale-110' : 'text-gray-400 dark:text-gray-500 group-hover:text-red-500'}`} />
                        <span className={`text-sm font-bold transition-colors ${post.is_liked ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500'}`}>{post.likes_count || 0}</span>
                    </button>
                    <button onClick={toggleComments} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                        <MessageCircle className="w-6 h-6 mr-1.5 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-bold">{showComments ? comments.length : (parseInt(post.comments_count) || 0)}</span>
                    </button>
                </div>
                <div className="flex space-x-3">
                    <button onClick={() => handleSave(post.id)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-yellow-500 dark:hover:text-yellow-500 transition-all transform hover:scale-110">
                        <Bookmark className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleAddToCart(post.id)} className="p-2 text-gray-400 dark:text-gray-500 hover:text-green-600 dark:hover:text-green-400 transition-all transform hover:scale-110">
                        <ShoppingCart className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="px-4 py-4 bg-gray-50 dark:bg-slate-900/50 border-t border-gray-100 dark:border-slate-800 animate-slideDown">
                    <div className="space-y-4 max-h-60 overflow-y-auto mb-4 scrollbar-hide">
                        {comments.length > 0 ? comments.map(comment => (
                            <div key={comment.id} className="flex space-x-3">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 text-xs font-bold">
                                    {comment.profile_image ? (
                                        <img src={comment.profile_image} alt="" className="h-full w-full object-cover rounded-full" />
                                    ) : (
                                        comment.username?.charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-xs font-bold text-gray-900 dark:text-white">{comment.username}</p>
                                        <p className="text-[10px] text-gray-500 dark:text-gray-400">{comment.created_at ? formatDistanceToNow(new Date(comment.created_at)) + ' ago' : 'just now'}</p>
                                    </div>
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                                </div>
                            </div>
                        )) : <p className="text-center text-gray-500 dark:text-gray-400 text-sm py-2 italic font-medium">No comments yet. Be the first!</p>}
                    </div>

                    <form onSubmit={handleCommentSubmit} className="flex items-center bg-white dark:bg-slate-800 rounded-full p-1.5 pr-2 border-2 border-gray-100 dark:border-slate-700 focus-within:border-indigo-500 dark:focus-within:border-indigo-600 transition-all">
                        <input
                            type="text"
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                        />
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full transform hover:scale-105 active:scale-95 transition-all">
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
