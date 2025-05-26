import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiMail, FiClock, FiArrowLeft } from "react-icons/fi";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, reload } from "firebase/auth";
import { auth } from "../../../firebase";
import useThemeStore from "../../../Stores/ThemeStore";

const SignupPageVerification = () => {
    const { darkMode, toggleDarkMode } = useThemeStore()
    const user = auth.currentUser;
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(async () => {
            const currentUser = auth.currentUser;
            if (currentUser) {
                try {
                    await reload(currentUser);
                    if (currentUser.emailVerified) {
                        toast.success("Email verification successful");
                        clearInterval(interval);
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        navigate("/userinfo");
                    }
                } catch (err) {
                    console.error("Error checking email verification:", err);
                }
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [navigate]);


    useEffect(() => {
        if (countdown <= 0) return;

        const timer = setInterval(() => {
            setCountdown(prevCount => prevCount - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [countdown]);


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleResend = async () => {
        if (countdown > 0) return;

        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast.error("No user signed in");
            return;
        }

        try {
            await sendEmailVerification(currentUser);
            toast.success("Verification email sent. Please check your inbox.");
            setCountdown(300);
        } catch (emailError) {
            console.error("Failed to send verification email:", emailError);
            toast.error("Failed to send verification email.");
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
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
                    >
                        <FiArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold">Verify Your Email</h1>
                    <button
                        onClick={() => toggleDarkMode()}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
                    >
                        {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </button>
                </div>

                <div className="space-y-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex justify-center"
                    >
                        <FiMail size={64} className={`${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    </motion.div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold">Almost There!</h2>
                        <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            We've sent a verification link to your email address.
                            Please check your inbox and click the link to activate your account.
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: countdown === 0 ? 1.05 : 1 }}
                        whileTap={{ scale: countdown === 0 ? 0.95 : 1 }}
                        onClick={handleResend}
                        disabled={countdown > 0}
                        className={`w-full py-3 rounded-lg font-medium ${countdown > 0
                            ? `${darkMode ? 'bg-gray-700' : 'bg-gray-200'} text-gray-400 cursor-not-allowed`
                            : `${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`
                            }`}
                    >
                        {countdown > 0 ? `Resend in ${formatTime(countdown)}` : "Resend Verification Link"}
                    </motion.button>

                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        <p>Didn't receive the email?</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Check your spam/junk folder</li>
                            <li>Ensure your email address is correct</li>
                            <li>Contact support@yourapp.com</li>
                        </ul>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default SignupPageVerification;