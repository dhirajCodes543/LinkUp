import SignupPage from "./Components/Authentication/SignupPage/SignupPage";
import SignupPageVerification from "./Components/Authentication/SignupPage/SignupPageVerification";
import SigninPage from "./Components/Authentication/SigninPage/SigninPage";
import HomePage from "./Components/Dashboard/HomePage";
import ResetPasswordPage from "./Components/Authentication/SigninPage/ResetPasswordPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import useAuthStore from "./Stores/AuthStore"; // adjust path if needed
import UserInfo from "./Components/UserInfo/UserInfo";
import Layout from "./Components/Layouts/Layout";
import Main from "./Components/Dashboard/Chat/Main";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <motion.svg
        width="64"
        height="64"
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        animate={{ rotate: 360 }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
        aria-label="Loading"
      >
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="#3B82F6"  // Tailwind blue-500
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.2"
        />
        <motion.path
          d="M60 32a28 28 0 0 1-28 28"
          stroke="#2563EB"  // Tailwind blue-600
          strokeWidth="8"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "loop",
          }}
        />
      </motion.svg>
    </div>
  );
};

function App() {
  const loading = useAuthStore((state) => state.loading);

  if (loading) {
    return <LoadingSpinner />;
  }


  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/userinfo" element={<UserInfo />} />
        <Route path="/chat" element={<Main />} />


        <Route element={<Layout />}>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/verification" element={<SignupPageVerification />} />
          <Route path="/signin" element={<SigninPage />} />
          <Route path="/resetpassword" element={<ResetPasswordPage />} />
        </Route>


      </Routes>
    </Router>
  );
}

export default App;
