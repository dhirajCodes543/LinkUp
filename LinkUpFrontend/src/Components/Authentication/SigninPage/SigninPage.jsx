import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSun, FiMoon } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../../firebase";
import { FiEye, FiEyeOff } from "react-icons/fi";
import useThemeStore from "../../../Stores/ThemeStore";

const SigninPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const { darkMode, toggleDarkMode } = useThemeStore();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        if (loading) return;
        setLoading(true);

        const { email, password } = formData;

        if (!email.trim() || !password.trim()) {
            toast.error("Please fill in all fields", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("Logged in successfully!", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
            setTimeout(() => navigate("/"), 1500);
        } catch (error) {
            console.error("Login failed:", error);
            toast.error("Invalid email or password.", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        if (loading) return;
        setLoading(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const isNewUser = result._tokenResponse?.isNewUser;

            toast.success("Logged in with Google!", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });

            setTimeout(() => {
                if (isNewUser) {
                    navigate("/userinfo");
                } else {
                    navigate("/dashboard");
                }
            }, 1500);
        } catch (error) {
            console.error("Google login failed:", error);
            toast.error("Google login failed.", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
        } finally {
            setLoading(false);
        }
    };


    const handlePasswordReset = async () => {
        if (loading) return;
        navigate("/resetpassword")
    };

    return (
        <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className={`p-8 rounded-lg shadow-xl w-full max-w-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Sign In</h1>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
                        aria-label={darkMode ? "Light mode" : "Dark mode"}
                    >
                        {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </button>
                </div>

                <form onSubmit={handleEmailLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="username"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                className={`w-full px-4 py-2 pr-10 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-2 flex items-center text-gray-500"
                                tabIndex={-1}
                            >
                                {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handlePasswordReset}
                            className={`text-sm mt-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'} hover:underline`}
                        >
                            Forgot Password?
                        </button>
                    </div>


                    <motion.button
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg transition-colors text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </motion.button>
                </form>

                <div className="mt-4 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Don't have an account? {' '}
                        <button
                            onClick={() => navigate('/')}
                            className={`font-semibold hover:underline ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                        >
                            Create one
                        </button>
                    </p>
                </div>

                <div className="mt-8">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className={`w-full border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className={`px-2 ${darkMode ? 'bg-gray-800' : 'bg-white'} text-gray-500`}>
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            disabled={loading}
                            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
                            onClick={handleGoogleLogin}
                        >
                            <FcGoogle size={20} />
                            <span className="text-sm">Google</span>
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SigninPage;