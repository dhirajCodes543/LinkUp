import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft, FiSun, FiMoon } from "react-icons/fi";
import { sendPasswordResetEmail } from "firebase/auth";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../../firebase";
import useThemeStore from "../../../Stores/ThemeStore";

const ResetPasswordPage = () => {
    const { darkMode, toggleDarkMode } = useThemeStore(); // ✅ Zustand toggle added
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error("Please enter your email address", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
            return;
        }

        setLoading(true);

        try {

            await sendPasswordResetEmail(auth, email);

            toast.success("Password reset email sent. Check your inbox!", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });

            setTimeout(() => navigate("/signin"), 2000);
        } catch (error) {
            console.error("Password reset error:", error);
            toast.error("Failed to send reset email. Please try again.", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
        } finally {
            setLoading(false);
        }
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
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors mr-4"
                            aria-label="Go back"
                        >
                            <FiArrowLeft size={24} />
                        </button>
                        <h1 className="text-2xl font-bold">Reset Password</h1>
                    </div>
                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
                        aria-label={darkMode ? "Light mode" : "Dark mode"}
                    >
                        {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </button>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <p>Password should be minimum 6 characters.</p>
                        <input
                            type="email"
                            autoFocus
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your registered email"
                            className={`w-full px-4 py-2 rounded-lg mt-2 border ${
                                darkMode 
                                    ? 'bg-gray-700 border-gray-600 placeholder-gray-400' 
                                    : 'bg-gray-50 border-gray-300 placeholder-gray-500'
                            }`}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg transition-colors text-white ${
                            loading 
                                ? 'bg-blue-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? "Sending Reset Link..." : "Send Reset Link"}
                    </motion.button>
                </form>

                <div className="mt-6 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Remember your password?{' '}
                        <button
                            onClick={() => navigate("/signin")}
                            className={`font-semibold hover:underline ${
                                darkMode 
                                    ? 'text-blue-400 hover:text-blue-300' 
                                    : 'text-blue-600 hover:text-blue-500'
                            }`}
                        >
                            Sign In
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPasswordPage;
