/**
 * Main Application Component
 * Manages authentication state and global routing.
 */
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import AddSkill from './pages/AddSkill';
import Profile from './pages/Profile';
import Matches from './pages/Matches';
import Saved from './pages/Saved';
import Cart from './pages/Cart';
import PostDetails from './pages/PostDetails';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './routes/PrivateRoute';
import PublicRoute from './routes/PublicRoute';
import { ThemeProvider } from './context/ThemeContext';
import SplashScreen from './components/SplashScreen';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showSplash, setShowSplash] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            setShowSplash(true);
            const timer = setTimeout(() => {
                setShowSplash(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [isAuthenticated]);

    const setAuth = (boolean) => {
        setIsAuthenticated(boolean);
    };

    async function isAuth() {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/auth/verify", {
                method: "GET",
                headers: { token: token }
            });

            const parseRes = await response.json();

            parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
        } catch (err) {
            console.error(err.message);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        isAuth();
    }, []);

    if (loading) return null;

    return (
        <ThemeProvider>
            <Router>
                <div className="bg-gray-100 dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
                    {showSplash && <SplashScreen />}
                    <Routes>
                        <Route element={<PublicRoute isAuthenticated={isAuthenticated} />}>
                            <Route path="/login" element={<Login setAuth={setAuth} />} />
                            <Route path="/signup" element={<Signup setAuth={setAuth} />} />
                        </Route>

                        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} />}>
                            <Route path="/" element={<Home setAuth={setAuth} />} />
                            <Route path="/add-skill" element={<AddSkill setAuth={setAuth} />} />
                            <Route path="/profile" element={<Profile setAuth={setAuth} />} />
                            <Route path="/matches" element={<Matches setAuth={setAuth} />} />
                            <Route path="/bookmarks" element={<Saved setAuth={setAuth} />} />
                            <Route path="/cart" element={<Cart setAuth={setAuth} />} />
                            <Route path="/post/:id" element={<PostDetails setAuth={setAuth} />} />
                            <Route path="/profile/:id" element={<UserProfile setAuth={setAuth} />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </Router>
        </ThemeProvider>
    );
}

export default App;
