import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Trash2, CreditCard } from 'lucide-react';

export default function Cart({ setAuth }) {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCheckout, setShowCheckout] = useState(false);
    const [user, setUser] = useState({});

    const getCart = async () => {
        try {
            const response = await axios.get("http://localhost:5000/cart", {
                headers: { token: localStorage.getItem("token") }
            });
            setCartItems(response.data);
            setLoading(false);
        } catch (err) {
            console.error(err.message);
            setLoading(false);
        }
    };

    const getUser = async () => {
        try {
            const response = await axios.get("http://localhost:5000/users/profile", {
                headers: { token: localStorage.getItem("token") }
            });
            setUser(response.data.user);
        } catch (err) {
            console.error(err.message);
        }
    }

    const [contactNumber, setContactNumber] = useState("");
    const [deliveryAddress, setDeliveryAddress] = useState("");

    const handleCheckout = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/orders/checkout", {
                first_name: user.first_name,
                last_name: user.last_name,
                contact_number: contactNumber,
                delivery_address: deliveryAddress
            }, {
                headers: { token: localStorage.getItem("token") }
            });
            alert("Order placed successfully!");
            setShowCheckout(false);
            setCartItems([]);
        } catch (err) {
            console.error(err.message);
            alert(err.response?.data || "Error processing order");
        }
    }

    const removeItem = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/cart/${id}`, {
                headers: { token: localStorage.getItem("token") }
            });
            setCartItems(cartItems.filter(item => item.cart_id !== id));
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getCart();
        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f172a] font-sans text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar setAuth={setAuth} />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8 flex items-center">
                    <CreditCard className="w-8 h-8 mr-3 text-indigo-600 dark:text-indigo-400" />
                    Shopping Cart
                </h1>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div className="text-center py-24 bg-white dark:bg-[#1e293b] rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col items-center transition-colors">
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-6 rounded-full mb-6 animate-bounce-slow">
                            <CreditCard className="w-12 h-12 text-indigo-400 dark:text-indigo-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any skills to trade yet.</p>
                        <a href="/" className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg hover:shadow-indigo-500/30">
                            Explore Skills
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">
                            {cartItems.map((item, index) => (
                                <div key={item.cart_id} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 relative group animate-fadeIn" style={{ animationDelay: `${index * 100}ms` }}>

                                    {/* Image Thumbnail */}
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 mr-0 sm:mr-6">
                                        {item.image_url ? (
                                            <img src={item.image_url} alt={item.title} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400 dark:text-gray-500 font-bold bg-gray-100 dark:bg-slate-800">
                                                {item.title?.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.title}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">by <span className="font-medium text-indigo-600 dark:text-indigo-400">{item.first_name} {item.last_name}</span></p>
                                        <span className="inline-block bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs px-2 py-1 rounded font-semibold border border-indigo-100 dark:border-indigo-900/50">
                                            {item.category || 'Skill'}
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center sm:items-end space-y-2 ml-0 sm:ml-4">
                                        <p className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{item.fee || 'Trade'}</p>
                                        <button
                                            onClick={() => removeItem(item.cart_id)}
                                            className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                            title="Remove item"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Order Summary Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white dark:bg-[#1e293b] p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-slate-800 sticky top-24 transition-colors">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Total Items</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{cartItems.length}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Platform Fee</span>
                                        <span className="font-medium text-green-600 dark:text-green-400">Free</span>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-slate-700 pt-4 flex justify-between items-center">
                                        <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                                        <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                                            {cartItems.filter(i => i.fee).length > 0 ? 'Calculated at Checkout' : 'Trade Only'}
                                        </span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setShowCheckout(true)}
                                    className="w-full bg-indigo-600 text-white py-4 rounded-xl hover:bg-indigo-700 transition-all transform hover:scale-105 font-bold shadow-lg hover:shadow-indigo-500/30 flex justify-center items-center group"
                                >
                                    <span>Proceed to Checkout</span>
                                    <CreditCard className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">Secure checkout powered by SkillSwap</p>
                            </div>
                        </div>
                    </div>
                )}

                {showCheckout && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
                        <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-lg w-full p-8 relative transform transition-all scale-100 border border-gray-100 dark:border-slate-800 transition-colors">
                            <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-slate-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700 hover:text-gray-700 dark:hover:text-white transition">✕</button>

                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm">Review your details to complete the trade.</p>
                            </div>

                            <form className="space-y-5" onSubmit={handleCheckout}>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">First Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={user.first_name || ''}
                                            onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                                            className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Last Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={user.last_name || ''}
                                            onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                                            className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Contact Number</label>
                                    <input type="tel" required className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow transition-colors" placeholder="+1 (555) 000-0000" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Delivery / Meeting Address</label>
                                    <textarea required className="block w-full px-4 py-3 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-shadow transition-colors" rows="3" placeholder="Enter your preferred location or address..." value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}></textarea>
                                </div>

                                <button type="submit" className="w-full bg-green-600 text-white py-4 rounded-xl hover:bg-green-700 transition-all font-bold text-lg shadow-lg hover:shadow-green-500/30 active:scale-95 mt-4">
                                    Confirm Order
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
