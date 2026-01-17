import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Lightbulb, ShoppingCart, Bookmark, User, LogOut, PlusSquare, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ setAuth }) {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const logout = (e) => {
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
        navigate("/login");
    };

    return (
        <nav className="bg-white dark:bg-[#1e293b] border-b border-gray-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                                SkillSwap
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            <Home className="w-5 h-5 mr-1" /> Home
                        </Link>
                        <Link to="/add-skill" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            <PlusSquare className="w-5 h-5 mr-1" /> Skill
                        </Link>
                        <Link to="/cart" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            <ShoppingCart className="w-5 h-5 mr-1" /> Cart
                        </Link>
                        <Link to="/bookmarks" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            <Bookmark className="w-5 h-5 mr-1" /> Saved
                        </Link>
                        <Link to="/profile" className="flex items-center text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            <User className="w-5 h-5 mr-1" /> Profile
                        </Link>

                        <div className="h-6 w-px bg-gray-200 dark:bg-slate-700 mx-1"></div>

                        <ThemeToggle />

                        <button onClick={logout} className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 px-2 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                            <LogOut className="w-5 h-5 mr-1" /> Logout
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center md:hidden gap-4">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-white dark:bg-slate-800 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white dark:bg-[#1e293b] border-t border-gray-100 dark:border-slate-800 transition-colors duration-300">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link to="/" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium">
                            <Home className="w-5 h-5 mr-2" /> Home
                        </Link>
                        <Link to="/add-skill" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium">
                            <PlusSquare className="w-5 h-5 mr-2" /> Post Skill
                        </Link>
                        <Link to="/cart" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium">
                            <ShoppingCart className="w-5 h-5 mr-2" /> Cart
                        </Link>
                        <Link to="/bookmarks" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium">
                            <Bookmark className="w-5 h-5 mr-2" /> Saved
                        </Link>
                        <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 block px-3 py-2 rounded-md text-base font-medium">
                            <User className="w-5 h-5 mr-2" /> Profile
                        </Link>
                        <button onClick={logout} className="w-full flex items-center text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 block px-3 py-2 rounded-md text-base font-medium text-left">
                            <LogOut className="w-5 h-5 mr-2" /> Logout
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
