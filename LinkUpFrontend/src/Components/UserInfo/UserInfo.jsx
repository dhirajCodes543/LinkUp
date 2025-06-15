
import React, {
  useState,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import useThemeStore from "../../Stores/ThemeStore";
import useAuthStore from "../../Stores/AuthStore";
import { auth } from "../../firebase";


const FiMoon  = lazy(() => import("react-icons/fi").then(m => ({ default: m.FiMoon  })));
const FiSun   = lazy(() => import("react-icons/fi").then(m => ({ default: m.FiSun   })));
const FiCheck = lazy(() => import("react-icons/fi").then(m => ({ default: m.FiCheck })));
const FiX     = lazy(() => import("react-icons/fi").then(m => ({ default: m.FiX     })));


const techInterests = [
  { name: "Artificial Intelligence", emoji: "🤖" },
  { name: "Machine Learning",       emoji: "🧠" },
  { name: "Web Development",        emoji: "🌐" },
  { name: "Mobile Development",     emoji: "📱" },
  { name: "DevOps",                 emoji: "🛠️" },
  { name: "Cloud Computing",        emoji: "☁️" },
  { name: "Cybersecurity",          emoji: "🔒" },
  { name: "Blockchain",             emoji: "⛓️" },
  { name: "Problem Solving (DSA/CP)", emoji: "🧩" },
  { name: "Data Science",           emoji: "📊" },
  { name: "UI/UX Design",           emoji: "🎨" },
  { name: "Game Development",       emoji: "🎮" },
  { name: "Frontend Development",   emoji: "🎯" },
  { name: "Backend Development",    emoji: "🧱" },
];

const avatars = [
  { id: 1,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist1&backgroundColor=ffadad,ffd6a5,fdffb6" },
  { id: 2,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist2&backgroundColor=caffbf,9bf6ff,a0c4ff" },
  { id: 3,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist3&backgroundColor=ffb4a2,ffc6ff,bdb2ff" },
  { id: 4,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist4&backgroundColor=ffd6a5,fdffb6,caffbf" },
  { id: 5,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist5&backgroundColor=9bf6ff,a0c4ff,ffc6ff" },
  { id: 6,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist6&backgroundColor=fdffb6,caffbf,ffadad" },
  { id: 7,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist7&backgroundColor=a0c4ff,ffc6ff,ffd6a5" },
  { id: 8,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist8&backgroundColor=caffbf,ffadad,ffd6a5" },
  { id: 9,  url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist9&backgroundColor=ffc6ff,bdb2ff,9bf6ff" },
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
  { id: 30, url: "https://api.dicebear.com/7.x/notionists/svg?seed=notionist30&backgroundColor=fdffb6,ffadad,ffc6ff" },
];

export default function UserInfo() {
  const { darkMode, toggleDarkMode } = useThemeStore();
  const navigate = useNavigate();

  
  const [profileImage, setProfileImage] = useState(avatars[4].url);
  const [selectedCollege, setSelectedCollege] = useState("");
  const [interests, setInterests]       = useState([]);
  const [year, setYear]                 = useState("");
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [submitting, setSubmitting]     = useState(false);

  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!interests.length || !selectedCollege || !year) {
      toast.error("Please fill all required fields.", { theme: darkMode ? "dark" : "light" });
      return;
    }
    setSubmitting(true);

    const user = auth.currentUser;
    if (!user) { toast.error("User not signed in"); return; }
    try { await user.reload(); } catch {}
    if (!user.emailVerified) { toast.error("Verify your email first."); return; }

    try {
      const idToken = await user.getIdToken();
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/signup`,
        { avatar: profileImage, college: selectedCollege, interests, year },
        { headers: { Authorization: `Bearer ${idToken}` } }
      );
      useAuthStore.getState().setBackendData(data.user);
      toast.success("Profile created!", { theme: darkMode ? "dark" : "light" });
      navigate("/");
    } catch(error) {
      console.log(error)
      toast.error("Submit failed.", { theme: darkMode ? "dark" : "light" });
    } finally {
      setSubmitting(false);
    }
  }
  

  return (
    <Suspense fallback={<div className="p-4 text-center">Loading UI…</div>}>
      <div className={`min-h-screen transition-colors ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
        <ToastContainer />

      
        <AnimatePresence>
          {showAvatarModal && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              onClick={() => setShowAvatarModal(false)}
            >
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                className={`p-6 rounded-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto ${darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold">Choose Avatar</h3>
                  <button onClick={() => setShowAvatarModal(false)} className="p-2 rounded-full hover:bg-opacity-20">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                  {avatars.map((a) => (
                    <motion.button
                      key={a.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => { setProfileImage(a.url); setShowAvatarModal(false); }}
                      className={`p-1 rounded-full border-2 ${profileImage === a.url ? "border-blue-500 scale-110" : "border-transparent hover:border-gray-400"}`}
                    >
                      <img src={a.url} alt="Avatar" loading="lazy" className="rounded-full" />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          <div className="flex justify-between items-center mb-8">
            <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-3xl font-bold flex items-center gap-3">
              <span className="text-4xl">🧑‍💻</span> Profile Setup
            </motion.h1>
            <button onClick={toggleDarkMode} className={`p-3 rounded-xl ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}>
              {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>
          </div>

          
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 p-6 rounded-2xl shadow-xl backdrop-blur-sm"
            style={{
              backgroundColor: darkMode ? "rgba(17,24,39,0.8)" : "rgba(255,255,255,0.8)",
              border: `1px solid ${darkMode ? "rgba(55,65,81,0.5)" : "rgba(229,231,235,0.5)"}`
            }}
          >

            
            <div className="flex flex-col items-center mb-8">
              <motion.button type="button" onClick={() => setShowAvatarModal(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="group relative">
                <div className={`w-32 h-32 rounded-full border-4 ${darkMode ? "border-gray-600 hover:border-blue-500" : "border-gray-200 hover:border-blue-400"}`}>
                  <img src={profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                </div>
                <div className={`absolute bottom-0 right-0 p-1.5 rounded-full ${darkMode ? "bg-gray-700" : "bg-white"}`}>
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <FiCheck className="text-white w-4 h-4" />
                  </div>
                </div>
              </motion.button>
            </div>

          
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-lg font-semibold">🏫 College *</label>
                <input
                  type="text"
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  required
                  className={`w-full p-3 rounded-xl border-2 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-400"}`}
                  placeholder="Enter your college name"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-semibold">📅 Academic Year *</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  className={`w-full p-3 rounded-xl border-2 appearance-none ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"}`}
                >
                  <option value="">Select your year</option>
                  {[1, 2, 3, 4].map((yr) => (
                    <option key={yr} value={yr}>
                      {["1st", "2nd", "3rd", "4th"][yr - 1]} Year
                    </option>
                  ))}
                </select>
              </div>
            </div>

            
            <div className="space-y-2">
              <label className="block text-lg font-semibold">🎯 Tech Interests (max 4) *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {techInterests.map((int) => {
                  const selected = interests.includes(int.name);
                  const disabled = interests.length >= 4 && !selected;
                  return (
                    <motion.button
                      key={int.name}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={disabled}
                      onClick={() =>
                        selected
                          ? setInterests((prev) => prev.filter((i) => i !== int.name))
                          : setInterests((prev) => [...prev, int.name])
                      }
                      className={`group p-3 rounded-lg flex items-center gap-2.5 border transition-all ${
                        selected
                          ? darkMode ? "border-blue-600 bg-blue-900/30 shadow-sm" : "border-blue-400 bg-blue-50 shadow-sm"
                          : darkMode ? "border-gray-700 hover:border-gray-600 bg-gray-800" : "border-gray-200 hover:border-gray-300 bg-white"
                      } ${disabled ? "opacity-60 cursor-not-allowed" : "hover:shadow-md"}`}
                    >
                      <span className="text-xl">{int.emoji}</span>
                      <span className="text-sm flex-1 text-left">{int.name}</span>
                      {selected && (
                        <FiCheck className={`w-4 h-4 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

          
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={submitting || !interests.length || !selectedCollege || !year}
              className={`w-full py-3.5 rounded-xl font-semibold ${
                submitting || !interests.length || !selectedCollege || !year
                  ? "bg-gray-400 text-gray-600 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {submitting ? "Submitting…" : "🚀 Complete Profile Setup"}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </Suspense>
  );
}
