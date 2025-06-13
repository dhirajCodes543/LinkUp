import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Users, Code, Trophy, Briefcase, Coffee } from 'lucide-react';
import useThemeStore from '../../Stores/ThemeStore';

const slides = [
  {
    id: 1,
    title: "Connect with Tech Students",
    subtitle: "Your College Tech Community",
    description: "Join thousands of computer science and engineering students from top universities. Build meaningful connections with peers who share your passion for technology.",
    icon: Users,
    accent: "blue"
  },
  {
    id: 2,
    title: "Learn & Code Together",
    subtitle: "Collaborative Development",
    description: "Share knowledge, collaborate on projects, and learn from experienced developers. Get help with assignments and grow your programming skills together.",
    icon: Code,
    accent: "emerald"
  },
  {
    id: 3,
    title: "Launch Your Career",
    subtitle: "From Student to Professional",
    description: "Get mentorship from industry professionals, find internship opportunities, and receive career guidance from alumni working at top tech companies.",
    icon: Briefcase,
    accent: "purple"
  },
  {
    id: 4,
    title: "Showcase Your Work",
    subtitle: "Build Your Portfolio",
    description: "Share your projects, get constructive feedback, and build a strong portfolio that stands out to recruiters and tech companies.",
    icon: Trophy,
    accent: "orange"
  },
  {
    id: 5,
    title: "Developer Community",
    subtitle: "Where Ideas Come to Life",
    description: "Join study sessions, participate in hackathons, and connect with like-minded students who understand the developer journey.",
    icon: Coffee,
    accent: "slate"
  }
];

const LeftPanelSlider = () => {
  const { darkMode } = useThemeStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  const currentSlideData = slides[currentSlide];

  const getAccentColor = (accent, darkMode) => {
    const colors = {
      blue: darkMode ? 'text-blue-400' : 'text-blue-600',
      emerald: darkMode ? 'text-emerald-400' : 'text-emerald-600',
      purple: darkMode ? 'text-purple-400' : 'text-purple-600',
      orange: darkMode ? 'text-orange-400' : 'text-orange-600',
      slate: darkMode ? 'text-slate-400' : 'text-slate-600'
    };
    return colors[accent] || colors.blue;
  };

  const slideVariants = {
    enter: { opacity: 0, y: 20 },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const iconVariants = {
    hover: { scale: 1.1, rotate: 5 }
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background with Overlay */}
      <motion.div
        key={currentSlide}
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 4, ease: "easeOut" }}
      >
        <div className={`absolute inset-0 ${darkMode ? 'bg-gray-950' : 'bg-gray-100'} backdrop-blur-[2px]`} />
      </motion.div>

      {/* Subtle Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3e%3cg fill='none' fill-rule='evenodd'%3e%3cg fill='%23ffffff' fill-opacity='0.1'%3e%3cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e")`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* Logo */}
      <motion.div className="absolute top-6 left-6 z-50">
        <Link to="/" className="group relative ">
          <motion.div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800/70 border border-gray-700/50' : 'bg-white/80 border border-gray-200'} backdrop-blur-sm`}>
            <motion.span className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>LinkUp</motion.span>
          </motion.div>
        </Link>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 sm:px-8 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div key={currentSlide} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.6, ease: "easeInOut" }} className="text-center max-w-lg mx-auto">
            <motion.div className="mb-8" variants={iconVariants} whileHover="hover">
              <div className={`inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl backdrop-blur-md border ${darkMode ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white/30 border-white/50'} shadow-lg`}>
                <currentSlideData.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${getAccentColor(currentSlideData.accent, darkMode)}`} />
              </div>
            </motion.div>

            <div className="space-y-4 sm:space-y-6">
              <motion.h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>{currentSlideData.title}</motion.h1>
              <motion.h2 className={`text-lg sm:text-xl font-medium ${getAccentColor(currentSlideData.accent, darkMode)}`}>{currentSlideData.subtitle}</motion.h2>
              <motion.p className={`text-sm sm:text-base lg:text-lg leading-relaxed max-w-md mx-auto ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{currentSlideData.description}</motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        <motion.div className="absolute bottom-16 sm:bottom-12 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-3">
            {slides.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentSlide ? getAccentColor(currentSlideData.accent, darkMode).replace('text-', 'bg-') : darkMode ? 'bg-gray-500 hover:bg-gray-400' : 'bg-gray-400 hover:bg-gray-500'}`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeftPanelSlider;
