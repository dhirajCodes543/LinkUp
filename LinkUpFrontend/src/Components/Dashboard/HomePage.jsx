import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Users,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Menu,
  X,
  Sun,
  Moon,
  Mail,
  Phone as LuPhone,
  User as LuUser
} from 'lucide-react';
const FaInstagram = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaInstagram })));
const FaGithub = lazy(() => import('react-icons/fa').then(module => ({ default: module.FaGithub })));
const ToastContainer = lazy(() => import('react-toastify').then(module => ({ default: module.ToastContainer })));
import useThemeStore from '../../Stores/ThemeStore';
import useAuthStore from '../../Stores/AuthStore';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';   


const LinkUpLanding = () => {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const backendData = useAuthStore((state) => state.backendData);

  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const navigate = useNavigate();
  
  const smoothScrollTo = (elementId) => {
    const element = document.getElementById(elementId);

    if (!element) return;

    if (mobileMenuOpen) {
      
      setMobileMenuOpen(false);
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }, 500);
    } else {
      
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    }
  };


  
  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: "Find Your Peers",
      description: "Connect with tech students from top universities worldwide"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Secure Chat",
      description: "Private messaging with end-to-end encryption"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Safe Environment",
      description: "Verified student community with moderation"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "CS Student, IIT Delhi",
      text: "LinkUp helped me find study partners and solve coding challenges. The community is amazing!",
      rating: 5
    },
    {
      name: "Arjun Patel",
      role: "Engineering Student, NIT Trichy",
      text: "I've made genuine friends here who understand the struggles of tech studies.",
      rating: 5
    },
    {
      name: "Sneha Reddy",
      role: "IT Student, BITS Pilani",
      text: "Perfect platform for getting help with projects and career advice.",
      rating: 5
    }
  ];


  const startWork = () => {
    if (!isLoggedIn) {
      toast.info('Please sign up to continue');
      setTimeout(() => {
        navigate('/signup');
      }, 1500);
    } else if (!backendData) {
      toast.info('Please complete your user info');
      setTimeout(() => {
        navigate('/userinfo');
      }, 1500);
    }
    else {
      navigate('/chat');
    }
  };

  
  useEffect(() => {

    console.log(isLoggedIn)

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  
  const handleAuth = (action) => {
    if (action === 'login')
      navigate('/signin')
    if (action === 'logout')
      navigate('/logout')
    if (action === 'signup')
      navigate('/signup')
  };

  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <Suspense fallback={null}>
        <ToastContainer theme={darkMode ? 'dark' : 'light'} />
      </Suspense>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 backdrop-blur-md ${darkMode ? 'bg-gray-900/80 border-gray-700' : 'bg-white/80 border-gray-200'} border-b`}>
        <ToastContainer />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center space-x-2"
            >
              <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-blue-600">
                LinkUp
              </span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => smoothScrollTo('features')}
                className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors cursor-pointer`}
              >
                Features
              </button>
              <button
                onClick={() => smoothScrollTo('benefits')}
                className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors cursor-pointer`}
              >
                Benefits
              </button>
              <button
                onClick={() => smoothScrollTo('testimonials')}
                className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors cursor-pointer`}
              >
                Reviews
              </button>
              <button
                onClick={() => smoothScrollTo('contact')}
                className={`hover:${darkMode ? 'text-blue-400' : 'text-blue-600'} transition-colors cursor-pointer`}
              >
                Contact
              </button>

              <button
                onClick={() => toggleDarkMode()}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'} transition-colors`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {isLoggedIn ? (
                <button
                  onClick={() => navigate('/logout')}
                  className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
                >
                  Logout
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleAuth('login')}
                    className={`px-4 py-2 rounded-lg ${darkMode ? 'border-gray-600 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-50'} border transition-colors`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => handleAuth('signup')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105"
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`md:hidden ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} border-t`}
            >
              <div className="px-4 py-4 space-y-4">
                <button onClick={() => smoothScrollTo('features')} className="block py-2 text-left w-full">Features</button>
                <button onClick={() => smoothScrollTo('benefits')} className="block py-2 text-left w-full">Benefits</button>
                <button onClick={() => smoothScrollTo('testimonials')} className="block py-2 text-left w-full">Reviews</button>
                <button onClick={() => smoothScrollTo('contact')} className="block py-2 text-left w-full">Contact</button>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => toggleDarkMode()}
                    className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                  >
                    {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>

                  {isLoggedIn ? (
                    <button
                      onClick={() => navigate('/logout')}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Logout
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAuth('login')}
                        className={`px-4 py-2 rounded-lg border ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}
                      >
                        Sign In
                      </button>
                      <button
                        onClick={() => handleAuth('signup')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            >
              Connect with{' '}
              <span className="text-blue-600">
                Tech Students
              </span>{' '}
              Like You
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Find peers, share problems, get advice — all through secure voice and message chat
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              <button
                onClick={() => startWork()}
                className="group px-8 py-4 bg-blue-600 text-white rounded-xl text-lg font-semibold hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center space-x-2"
              >
                <span>{isLoggedIn ? 'Start Chatting' : 'Get Started'}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={`relative max-w-4xl mx-auto rounded-2xl overflow-hidden p-6 transition-all duration-300 hover:shadow-2xl ${darkMode ? 'bg-gray-800/95 backdrop-blur-sm border border-gray-700' : 'bg-white/95 backdrop-blur-sm border border-gray-200'} shadow-xl`}
            >
              <div className="space-y-6">
                {/* Chat Message 1 */}
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <LuUser className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className={`p-4 rounded-lg rounded-tl-md max-w-[75%] transition-all duration-300 ${darkMode ? 'bg-gray-700 hover:bg-gray-650' : 'bg-gray-100 hover:bg-gray-50'}`}>
                    <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'} leading-relaxed`}>
                      Hey! This is Dhiraj from NIT Jamshedpur — happy to connect!
                    </p>
                    <span className={`text-xs mt-2 block ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>2:45 PM</span>
                  </div>
                </div>

                {/* Chat Message 2 */}
                <div className="flex items-start gap-3 justify-end">
                  <div className="p-4 rounded-lg rounded-tr-md max-w-[75%] bg-blue-600 text-white transition-all duration-300 hover:bg-blue-700">
                    <p className="leading-relaxed">Direct from IIT Patna — let's figure it out on call</p>
                    <span className="text-xs mt-2 block text-blue-100">2:46 PM</span>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-blue-600' : 'bg-blue-500'}`}>
                    <LuUser className="w-4 h-4 text-white" />
                  </div>
                </div>

                {/* Voice Call Button */}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How LinkUp Works</h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Simple, secure, and designed for tech students who want to connect and grow together
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{
                  type: "tween",
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: "easeOut"
                }}
                viewport={{ once: true, margin: "-50px" }}
                className={`p-6 rounded-xl ${darkMode ? 'bg-gray-900 shadow-lg hover:shadow-xl' : 'bg-gray-50 shadow-md hover:shadow-lg'
                  } transition-shadow duration-300`}
              >
                <div className={`w-16 h-16 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'
                  } flex items-center justify-center mb-4 text-white`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose LinkUp?</h2>
              <div className="space-y-6">
                {[
                  "Find solutions to tech, academic, or career problems quickly",
                  "Build a network of peers and mentors in your field",
                  "Practice communication skills in a safe environment",
                  "Reduce feelings of isolation in your studies"
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Active Community</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>10,000+ tech students</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Daily Connections</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>500+ conversations daily</p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">Success Rate</h3>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>95% find helpful connections</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}  overflow-x-hidden sm:overflow-x-visible`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Students Say</h2>
            <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Real experiences from our community
            </p>
          </motion.div>

          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} text-center`}
              >
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-lg mb-6 italic">"{testimonials[activeTestimonial].text}"</p>
                <div>
                  <h4 className="font-semibold">{testimonials[activeTestimonial].name}</h4>
                  <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {testimonials[activeTestimonial].role}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === activeTestimonial
                    ? 'bg-blue-500'
                    : darkMode ? 'bg-gray-600' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={`p-12 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Connect?
            </h2>
            <p className={`text-xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Join thousands of tech students who are already building meaningful connections
            </p>
            <button
              onClick={() => startWork()}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all transform hover:scale-105"
            >
              {isLoggedIn ? 'Start Connecting Now' : 'Join LinkUp Today'}
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className={`py-12 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-8 h-8 rounded-lg ${darkMode ? 'bg-blue-600' : 'bg-blue-500'} flex items-center justify-center`}>
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-blue-600">
                  LinkUp
                </span>
              </div>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                Connecting tech students worldwide through secure, meaningful conversations.
              </p>
              <div className="flex space-x-4">
                <Suspense fallback={<div className="w-9 h-9 bg-gray-300 rounded-lg animate-pulse" />}>
                  <a href="https://www.instagram.com/ddra890/" className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors`}>
                    <FaInstagram className="w-5 h-5" />
                  </a>
                </Suspense>
                <Suspense fallback={<div className="w-9 h-9 bg-gray-300 rounded-lg animate-pulse" />}>
                  <a href="https://github.com/dhirajCodes543" className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors`}>
                    <FaGithub className="w-5 h-5" />
                  </a>
                </Suspense>
                <a href="mailto:d4dhirajbarnwal@gmail.com" className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} transition-colors`}>
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><button onClick={() => smoothScrollTo('features')} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors text-left`}>Features</button></li>
                <li><button onClick={() => smoothScrollTo('benefits')} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors text-left`}>Benefits</button></li>
                <li><button onClick={() => smoothScrollTo('testimonials')} className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors text-left`}>Testimonials</button></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Privacy Policy</a></li>
                <li><a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Terms of Service</a></li>
                <li><a href="#" className={`${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}>Contact</a></li>
              </ul>
            </div>
          </div>

          <div className={`mt-8 pt-8 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              © 2025 LinkUp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LinkUpLanding;
