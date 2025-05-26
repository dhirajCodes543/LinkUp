import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSun, FiMoon, FiGithub, FiEye, FiEyeOff } from "react-icons/fi"; // Added FiEye and FiEyeOff
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { auth } from "../../../firebase";
import useThemeStore from "../../../Stores/ThemeStore";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import useAuthStore from "../../../Stores/AuthStore";

const SignupPage = () => {
    const { darkMode, toggleDarkMode } = useThemeStore()
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false); // State for password toggle
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password toggle

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        // Check for empty fields
        const emptyFields = Object.entries(formData).filter(([_, value]) => value.trim() === "");
        if (emptyFields.length > 0) {
            toast.error("Please fill in all fields", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
            setLoading(false)
            return;
        }

        // Check password length
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
            setLoading(false)
            return;
        }

        // Check password match
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match", {
                position: "top-right",
                autoClose: 3000,
                theme: darkMode ? "dark" : "light",
            });
            setLoading(false)
            return;
        }

        try {
            // Create user
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            const user = userCredential.user;
            try {
                await updateProfile(user, {
                    displayName: `${formData.firstName} ${formData.lastName}`,
                });
            } catch (updateError) {
                console.error("Failed to update profile:", updateError);
                toast.error("Failed to update user profile.");
                setLoading(false)
                return;
            }

            try {
                await sendEmailVerification(user);
                toast.success("Verification email sent. Please check your inbox.");
            } catch (emailError) {
                console.error("Failed to send verification email:", emailError);
                toast.error("Failed to send verification email.");
            }


            setTimeout(() => {
                navigate("/verification");
            }, 2000);

        } catch (createUserError) {
            console.error("Failed to create user:", createUserError);
            toast.error(createUserError.message);
        } finally {
            setLoading(false)
        }
    };

    const handleGoogleSignIn = async () => {
        setLoading(true)
        const provider = new GoogleAuthProvider()
        try {
            const result = await signInWithPopup(auth, provider);
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log(credential)
            const token = credential.accessToken;
            const user = result.user;
            toast.success("Google sign-in successfull")
             await new Promise(resolve => setTimeout(resolve, 1500));
            navigate("/userinfo")
        } catch (error) {
            console.error("Google Sign-in failed", error)
            toast.error("Google sign-in failed")
        } finally {
            setLoading(false)
        }
    }

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
                    <h1 className="text-2xl font-bold">Create Account</h1>
                    <button
                        onClick={() => toggleDarkMode()}
                        className="p-2 rounded-full hover:bg-opacity-20 hover:bg-gray-500 transition-colors"
                        aria-label={darkMode ? "Light mode" : "Dark mode"}
                    >
                        {darkMode ? <FiSun size={24} /> : <FiMoon size={24} />}
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                autoComplete="given-name"
                                required
                                value={formData.firstName}
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            />
                        </div>
                        <div className="flex-1">
                            <label className="block text-sm font-medium mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                autoComplete="family-name"
                                required
                                value={formData.lastName}
                                className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium mb-2">Password (min 6 characters)</label>
                        <input
                            type={showPassword ? "text" : "password"}  // toggle type here
                            name="password"
                            autoComplete="new-password"
                            required
                            minLength={6}
                            value={formData.password}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-9 text-gray-500"
                            tabIndex={-1}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium mb-2">Confirm Password</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"} // toggle type here
                            name="confirmPassword"
                            autoComplete="new-password"
                            required
                            value={formData.confirmPassword}
                            className={`w-full px-4 py-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'}`}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-9 text-gray-500"
                            tabIndex={-1}
                            aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                        >
                            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                        </button>
                    </div>

                    <motion.button
                        whileHover={{ scale: loading ? 1 : 1.02 }}
                        whileTap={{ scale: loading ? 1 : 0.98 }}
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg transition-colors text-white ${loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                    >
                        {loading ? "Creating Account..." : "Create Account"}
                    </motion.button>
                </form>

                {/* Added "Already have account" section */}
                <div className="mt-4 text-center">
                    <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                        Already have an account? {' '}
                        <button
                            onClick={() => navigate('/signin')}
                            className={`font-semibold hover:underline ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}
                        >
                            Sign in
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
                            onClick={handleGoogleSignIn}
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

export default SignupPage;
