import React, { useState } from 'react';
import { Heart, LogOut, ArrowLeft } from 'lucide-react';
import useThemeStore from '../../../Stores/ThemeStore';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const LogoutPage = () => {
    const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const darkMode = useThemeStore((state) => state.darkMode);

  // Firebase logout function
  const handleLogout = async () => {
    setIsLoading(true);
    try {
       signOut(auth)
      .then(() => {
        console.log("Logged out");
      })
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add your post-logout logic here (redirect, etc.)
      console.log('User logged out successfully');
      setShowConfirmation(true);
      
      setTimeout(() => {
        // Redirect to login page or home
        navigate("/signin")
      }, 2000);
      
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStay = () => {
    // Navigate back or close modal
    window.history.back();
  };

  if (showConfirmation) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-5 transition-all duration-300 ${
        darkMode 
          ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className={`max-w-md w-full rounded-3xl p-12 text-center shadow-2xl border transition-all duration-300 ${
          darkMode
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-slate-200'
        }`}>
          <div className="animate-bounce mb-6">
            <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
              darkMode ? 'bg-green-900' : 'bg-green-100'
            }`}>
              <Heart className={`w-8 h-8 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
            </div>
          </div>
          <h2 className={`text-2xl font-bold mb-4 ${
            darkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Until We Meet Again
          </h2>
          <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            You've been logged out successfully. We'll be here waiting for your return! 💙
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-5 transition-all duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className={`max-w-md w-full rounded-3xl p-12 text-center shadow-2xl border transition-all duration-300 transform hover:scale-105 ${
        darkMode
          ? 'bg-slate-800 border-slate-700'
          : 'bg-white border-slate-200'
      }`}>
        {/* Decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
        
        {/* Sad emoji animation */}
        <div className="mb-8 animate-pulse">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center text-4xl ${
            darkMode ? 'bg-slate-700' : 'bg-slate-100'
          }`}>
            😢
          </div>
        </div>

        {/* Main heading */}
        <h1 className={`text-3xl font-bold mb-4 ${
          darkMode ? 'text-white' : 'text-slate-800'
        }`}>
          Please Don't Leave Us
        </h1>

        {/* Emotional message */}
        <p className={`text-lg mb-2 ${
          darkMode ? 'text-slate-300' : 'text-slate-600'
        }`}>
          We've grown so attached to having you here
        </p>
        
        <div className="flex items-center justify-center mb-8">
          <Heart className={`w-5 h-5 text-red-500 animate-pulse mx-1`} />
          <Heart className={`w-4 h-4 text-red-400 animate-pulse mx-1 delay-100`} />
          <Heart className={`w-3 h-3 text-red-300 animate-pulse mx-1 delay-200`} />
        </div>

        <p className={`mb-8 leading-relaxed ${
          darkMode ? 'text-slate-400' : 'text-slate-500'
        }`}>
          Your presence makes our platform brighter. Are you sure you want to say goodbye? 
          We promise we'll keep your favorite settings warm for when you return! 🌟
        </p>

        {/* Action buttons */}
        <div className="space-y-4">
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
              darkMode
                ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
                : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Logging you out...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <LogOut className="w-5 h-5 mr-2" />
                Yes, Logout
              </div>
            )}
          </button>

          <button
            onClick={handleStay}
            className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg border-2 ${
              darkMode
                ? 'bg-transparent border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white'
                : 'bg-transparent border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Actually, I'll Stay
            </div>
          </button>
        </div>

        {/* Footer message */}
        <div className={`mt-8 pt-6 border-t ${
          darkMode ? 'border-slate-700' : 'border-slate-200'
        }`}>
          <p className={`text-sm ${
            darkMode ? 'text-slate-500' : 'text-slate-400'
          }`}>
            Remember, you're always welcome back anytime! 💝
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;