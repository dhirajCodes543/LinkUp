import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useThemeStore from '../../Stores/ThemeStore';
import axios from 'axios';
import { auth } from '../../firebase';
import { FiMoon, FiSun, FiCheck, FiX } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../Stores/AuthStore';
import { useRef } from 'react';
// Constants moved to separate file (mock for example)
const techInterests = [
    { name: 'Artificial Intelligence', emoji: '🤖' },
    { name: 'Machine Learning', emoji: '🧠' },
    { name: 'Web Development', emoji: '🌐' },
    { name: 'Mobile Development', emoji: '📱' },
    { name: 'DevOps', emoji: '🛠️' },
    { name: 'Cloud Computing', emoji: '☁️' },
    { name: 'Cybersecurity', emoji: '🔒' },
    { name: 'Blockchain', emoji: '⛓️' },
    { name: 'Problem Solving (DSA/CP)', emoji: '🧩' },  // Puzzle piece for logical challenges
    { name: 'Data Science', emoji: '📊' },
    { name: 'UI/UX Design', emoji: '🎨' },
    { name: 'Game Development', emoji: '🎮' },
    { name: 'Frontend Development', emoji: '🎯' },  // Represents precision and UI targeting
    { name: 'Backend Development', emoji: '🧱' }    // Symbolizes structure and foundation

];


const avatars = [
    { id: 1, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist1&backgroundColor=ffadad,ffd6a5,fdffb6" },
    { id: 2, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist2&backgroundColor=caffbf,9bf6ff,a0c4ff" },
    { id: 3, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist3&backgroundColor=ffb4a2,ffc6ff,bdb2ff" },
    { id: 4, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist4&backgroundColor=ffd6a5,fdffb6,caffbf" },
    { id: 5, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist5&backgroundColor=9bf6ff,a0c4ff,ffc6ff" },
    { id: 6, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist6&backgroundColor=fdffb6,caffbf,ffadad" },
    { id: 7, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist7&backgroundColor=a0c4ff,ffc6ff,ffd6a5" },
    { id: 8, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist8&backgroundColor=caffbf,ffadad,ffd6a5" },
    { id: 9, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist9&backgroundColor=ffc6ff,bdb2ff,9bf6ff" },
    { id: 10, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist10&backgroundColor=ffadad,ffd6a5,fdffb6" },
    { id: 11, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist11&backgroundColor=caffbf,9bf6ff,a0c4ff" },
    { id: 12, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist12&backgroundColor=ffb4a2,ffc6ff,bdb2ff" },
    { id: 13, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist13&backgroundColor=ffd6a5,fdffb6,caffbf" },
    { id: 14, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist14&backgroundColor=9bf6ff,a0c4ff,ffc6ff" },
    { id: 15, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist15&backgroundColor=fdffb6,caffbf,ffadad" },
    { id: 16, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist16&backgroundColor=a0c4ff,ffc6ff,ffd6a5" },
    { id: 17, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist17&backgroundColor=caffbf,ffadad,ffd6a5" },
    { id: 18, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist18&backgroundColor=ffc6ff,bdb2ff,9bf6ff" },
    { id: 19, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist19&backgroundColor=ffadad,ffd6a5,fdffb6" },
    { id: 20, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist20&backgroundColor=caffbf,9bf6ff,a0c4ff" },
    { id: 21, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist21&backgroundColor=ffd6a5,ffb4a2,caffbf" },
    { id: 22, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist22&backgroundColor=fdffb6,9bf6ff,ffc6ff" },
    { id: 23, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist23&backgroundColor=bdb2ff,a0c4ff,ffadad" },
    { id: 24, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist24&backgroundColor=9bf6ff,ffc6ff,ffd6a5" },
    { id: 25, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist25&backgroundColor=caffbf,ffd6a5,fdffb6" },
    { id: 26, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist26&backgroundColor=ffb4a2,ffc6ff,bdb2ff" },
    { id: 27, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist27&backgroundColor=ffadad,ffd6a5,9bf6ff" },
    { id: 28, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist28&backgroundColor=ffc6ff,fdffb6,a0c4ff" },
    { id: 29, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist29&backgroundColor=caffbf,9bf6ff,ffd6a5" },
    { id: 30, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist30&backgroundColor=fdffb6,ffadad,ffc6ff" }
];

const UserInfo = () => {
    const { darkMode, toggleDarkMode } = useThemeStore();
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef(null);
    const [profileImage, setProfileImage] = useState(avatars[4].url);
    const [collegeQuery, setCollegeQuery] = useState('');
    const [colleges, setColleges] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState('');
    const [interests, setInterests] = useState([]);
    const [year, setYear] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
    const [showAvatarModal, setShowAvatarModal] = useState(false);

    const navigate = useNavigate()

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setShowCollegeDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset highlighted index when colleges change
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [colleges]);

    const fetchColleges = useCallback(async (query) => {
        if (query.length < 2) {
            setColleges([]);
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await axios.get(
                `http://universities.hipolabs.com/search?name=${query}&country=india`
            );

            const filteredColleges = data
                .map(college => college.name)
                .filter(name => name.toLowerCase().includes(query.toLowerCase()))
                .slice(0, 10);

            setColleges(filteredColleges);

            if (filteredColleges.length === 0) {
                setTimeout(() => {
                    toast.error('No colleges found. Try a different search term', {
                        theme: darkMode ? 'dark' : 'light',
                        toastId: 'no-colleges-found' // Prevent duplicate toasts
                    });
                }, 1500); // 1500 milliseconds = 1.5 seconds
            }


        } catch (error) {
            toast.error('Failed to fetch colleges. Using default list', { theme: darkMode ? 'dark' : 'light' });
            setColleges([
                'Indian Institute of Technology (IIT) Mumbai',
                'National Institute of Technology (NIT) Karnataka',
                'Delhi Technological University',
                'Birla Institute of Technology and Science (BITS) Pilani',
                'Indian Institute of Science (IISc) Bangalore',
                'Indian Institute of Information Technology (IIIT) Hyderabad'
            ]);
        }
        setIsLoading(false);
    }, [darkMode]);

    // Debounced college search
    useEffect(() => {
        const debounceTimer = setTimeout(() => fetchColleges(collegeQuery), 500);
        return () => clearTimeout(debounceTimer);
    }, [collegeQuery, fetchColleges]);

    const handleSubmit = async (e) => {
        setIsLoading(true)
        e.preventDefault();
        if (interests.length === 0 || !selectedCollege || !year) {
            toast.error('Please fill all required fields', { theme: darkMode ? 'dark' : 'light' });
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            toast.error("User not signed in");
            return;
        }

       try {
         await user.reload(); 
       } catch (error) {
        toast.error("Error: Try again")
       }

        if (!user.emailVerified) {
            toast.error("Please verify your email before continuing.");
            return;
        }

        let idToken
        try {
            idToken = await user.getIdToken()
            // console.log(idToken)
        } catch (error) {
            console.error("Error", error)
            toast.error("Profile Setup Failed, Try later")
        }
        const avatar = profileImage
        const college = selectedCollege
        try {
            const response = await axios.post(
                "/api/signup",
                { avatar, college, interests, year },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            useAuthStore.getState().setBackendData(response.data.user);
            // console.log(useAuthStore.getState().backendData);
            console.log(response)
            setTimeout(() => {
                toast.success('Profile created successfully', {
                    theme: darkMode ? 'dark' : 'light',
                });
            }, 1500);

            navigate("/")

            setCollegeQuery("")
            setColleges([])
            setSelectedCollege("")
            setInterests([])
            setYear('')
            setShowCollegeDropdown(false)
            setShowAvatarModal(false)
        } catch (error) {
            toast.error('Failed to submit profile. Please try again.', {
                theme: darkMode ? 'dark' : 'light'
            });
            console.error("Error", error);
        } finally {
            setIsLoading(false)
        }
        // Submit logic here
    };

    return (
        <div className={`min-h-screen transition-colors duration-0 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            <ToastContainer />
            <AnimatePresence>
                {showAvatarModal && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.42, 0, 0.58, 1] }}
                        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                        onClick={() => setShowAvatarModal(false)}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 20, opacity: 0 }}
                            className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} p-6 rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">Choose Avatar</h3>
                                <button
                                    onClick={() => setShowAvatarModal(false)}
                                    className={`p-2 rounded-full hover:bg-opacity-20 ${darkMode ? 'hover:bg-white' : 'hover:bg-black'}`}
                                >
                                    <FiX className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                                {avatars.map(avatar => (
                                    <motion.button
                                        key={avatar.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => {
                                            setProfileImage(avatar.url);
                                            setShowAvatarModal(false);
                                        }}
                                        className={`p-1 rounded-full border-2 transition-transform ${profileImage === avatar.url
                                            ? 'border-blue-500 scale-110'
                                            : 'border-transparent hover:border-gray-400'
                                            }`}
                                    >
                                        <img
                                            src={avatar.url}
                                            alt="Avatar"
                                            loading="lazy"
                                            decoding="async"
                                            className="w-full h-auto rounded-full"
                                        />
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold flex items-center gap-3"
                    >
                        <span className="text-4xl">🧑‍💻</span>
                        Profile Setup
                    </motion.h1>
                    <button
                        onClick={toggleDarkMode}
                        className={`p-3 rounded-xl transition-colors ${darkMode
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                            }`}
                    >
                        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>
                </div>

                <motion.form
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 bg-opacity-60 backdrop-filter backdrop-blur-sm p-6 rounded-2xl shadow-xl"
                    style={{
                        backgroundColor: darkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                        border: `1px solid ${darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(229, 231, 235, 0.5)'}`
                    }}
                >
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center mb-8">
                        <motion.button
                            type="button"
                            onClick={() => setShowAvatarModal(true)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative"
                        >
                            <div className={`w-32 h-32 rounded-full border-4 transition-all ${darkMode
                                ? 'border-gray-600 hover:border-blue-500'
                                : 'border-gray-200 hover:border-blue-400'
                                }`}>
                                <img
                                    src={profileImage}
                                    alt="Profile"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <div className={`absolute bottom-0 right-0 p-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-white'
                                } shadow-sm`}>
                                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                                    <FiCheck className="text-white w-4 h-4" />
                                </div>
                            </div>
                        </motion.button>
                    </div>

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* College Search */}
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold">🏫 College *</label>
                            <div className="relative" ref={containerRef}>
                                <input
                                    type="text"
                                    value={selectedCollege || collegeQuery}
                                    onChange={(e) => {
                                        setCollegeQuery(e.target.value);
                                        setSelectedCollege('');
                                        setShowCollegeDropdown(true);
                                        setHighlightedIndex(-1);
                                    }}
                                    onKeyDown={(e) => {
                                        if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
                                            e.preventDefault();
                                            if (e.key === 'ArrowDown') {
                                                setHighlightedIndex(prev =>
                                                    Math.min(prev + 1, Math.min(colleges.length - 1, 9))
                                                );
                                            } else if (e.key === 'ArrowUp') {
                                                setHighlightedIndex(prev => Math.max(prev - 1, 0));
                                            } else if (e.key === 'Enter' && highlightedIndex >= 0) {
                                                setSelectedCollege(colleges[highlightedIndex]);
                                                setCollegeQuery('');
                                                setShowCollegeDropdown(false);
                                            } else if (e.key === 'Escape') {
                                                setShowCollegeDropdown(false);
                                            }
                                        }
                                    }}
                                    required
                                    className={`w-full p-3 rounded-xl border-2 transition-colors ${darkMode
                                        ? 'bg-gray-700 border-gray-600 focus:border-blue-500 text-white'
                                        : 'bg-white border-gray-300 focus:border-blue-400 text-gray-900'
                                        }`}
                                    placeholder="Search your college..."
                                />
                                {isLoading && (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="absolute right-3 top-3.5 w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full"
                                    />
                                )}

                                {showCollegeDropdown && colleges.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`absolute z-10 w-full mt-2 rounded-xl shadow-lg max-h-60 overflow-y-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
                                            }`}
                                    >
                                        {colleges.slice(0, 10).map((college, index) => (
                                            <div
                                                key={college}
                                                ref={el => {
                                                    if (index === highlightedIndex) {
                                                        el?.scrollIntoView({ block: "nearest" });
                                                    }
                                                }}
                                                onClick={() => {
                                                    setSelectedCollege(college);
                                                    setCollegeQuery('');
                                                    setShowCollegeDropdown(false);
                                                }}
                                                className={`p-3 cursor-pointer transition-colors ${darkMode
                                                    ? `hover:bg-gray-700 ${highlightedIndex === index ? 'bg-gray-700' : ''}`
                                                    : `hover:bg-gray-100 ${highlightedIndex === index ? 'bg-gray-100' : ''}`
                                                    } first:rounded-t-xl last:rounded-b-xl`}
                                            >
                                                {college}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        {/* Year Selection */}
                        <div className="space-y-2">
                            <label className="block text-lg font-semibold">📅 Academic Year *</label>
                            <select
                                value={year}
                                onChange={(e) => setYear(e.target.value)}
                                required
                                className={`w-full p-3 rounded-xl border-2 appearance-none ${darkMode
                                    ? 'bg-gray-700 border-gray-600 text-white'
                                    : 'bg-white border-gray-300 text-gray-900'
                                    }`}
                            >
                                <option value="">Select your year</option>
                                {[1, 2, 3, 4].map((yr) => (
                                    <option key={yr} value={yr}>
                                        {yr === 1 ? '1st' : yr === 2 ? '2nd' : yr === 3 ? '3rd' : '4th'} Year
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Interests Grid */}
                    <div className="space-y-2">
                        <label className="block text-lg font-semibold">🎯 Tech Interests (max 4) *</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {techInterests.map((interest) => (
                                <motion.button
                                    type="button"
                                    key={interest.name}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    onClick={() => {
                                        if (interests.includes(interest.name)) {
                                            setInterests(interests.filter(i => i !== interest.name));
                                        } else if (interests.length < 4) {
                                            setInterests([...interests, interest.name]);
                                        }
                                    }}
                                    className={`group p-3 rounded-lg flex items-center gap-2.5 transition-all
          border ${interests.includes(interest.name)
                                            ? `${darkMode ? 'border-blue-600 bg-blue-900/30' : 'border-blue-400 bg-blue-50'} shadow-sm`
                                            : `${darkMode ? 'border-gray-700 hover:border-gray-600 bg-gray-800' : 'border-gray-200 hover:border-gray-300 bg-white'}`
                                        } ${interests.length >= 4 && !interests.includes(interest.name)
                                            ? 'opacity-60 cursor-not-allowed'
                                            : 'hover:shadow-md'
                                        }`}
                                    disabled={interests.length >= 4 && !interests.includes(interest.name)}
                                >
                                    <span className="text-xl shrink-0">{interest.emoji}</span>
                                    <span className="text-left flex-1 font-medium text-sm">
                                        {interest.name}
                                    </span>
                                    {interests.includes(interest.name) && (
                                        <FiCheck className={`shrink-0 w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'
                                            }`} />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className={`w-full py-3.5 rounded-xl font-semibold transition-colors ${(interests.length === 0 || !selectedCollege || !year)
                            ? 'bg-gray-400 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                        disabled={interests.length === 0 || !selectedCollege || !year}
                    >
                        🚀 Complete Profile Setup
                    </motion.button>
                </motion.form>
            </div>
        </div>
    );
};

export default UserInfo;