
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { motion } from "framer-motion";
import useAuthStore from "./Stores/AuthStore";
import HomePage from "./Components/Dashboard/HomePage";


const MainVideoCall           = lazy(() => import("./Components/Dashboard/VideoCall/Main"));
const UserInfo                = lazy(() => import("./Components/UserInfo/UserInfo"));
const SignupPage              = lazy(() => import("./Components/Authentication/SignupPage/SignupPage"));
const SignupPageVerification  = lazy(() => import("./Components/Authentication/SignupPage/SignupPageVerification"));
const SigninPage              = lazy(() => import("./Components/Authentication/SigninPage/SigninPage"));
const ResetPasswordPage       = lazy(() => import("./Components/Authentication/SigninPage/ResetPasswordPage"));
const Layout                  = lazy(() => import("./Components/Layouts/Layout"));
const LogoutPage                  = lazy(() => import("./Components/Dashboard/VideoCall/Logout"));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
    <motion.svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      aria-label="Loading"
    >
      <circle cx="32" cy="32" r="28" stroke="#3B82F6" strokeWidth="8" opacity="0.25" />
      <motion.path
        d="M60 32a28 28 0 0 1-28 28"
        stroke="#2563EB"
        strokeWidth="8"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", repeatType: "loop" }}
      />
    </motion.svg>
  </div>
);

export default function App() {
  const loading = useAuthStore((s) => s.loading);

  if (loading) return <LoadingSpinner />;

  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/userinfo" element={<UserInfo />} />
          <Route path="/chat" element={<MainVideoCall />} />
          <Route path="/logout" element={<LogoutPage />} />

          
          <Route element={<Layout />}>
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/verification" element={<SignupPageVerification />} />
            <Route path="/signin" element={<SigninPage />} />
            <Route path="/resetpassword" element={<ResetPasswordPage />} />
          </Route>

        
          <Route path="*" element={<div className="text-center text-xl mt-20 text-red-500">404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
    </Router>
  );
}
