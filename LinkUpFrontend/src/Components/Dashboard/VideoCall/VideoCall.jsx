
import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useThemeStore from "../../../Stores/ThemeStore";


const FaPaperPlane = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaPaperPlane })));
const FaCircle = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaCircle })));
const FaMoon = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaMoon })));
const FaSun = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaSun })));
const FaSignOutAlt = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaSignOutAlt })));
const FaExpand = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaExpand })));
const FaCompress = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaCompress })));

export default function AblyChat({
  token,
  setToken,
  clientId,
  room,
  userPhoto = null,
  userName = "Test User",
  collegeName = "Demo College",
  isOnline = true,
}) {
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const { darkMode, toggleDarkMode } = useThemeStore();
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [peerOnline, setPeerOnline] = useState(true);
  const [peerLeftToast, setPeerLeftToast] = useState(false);


  const ablyRef = useRef(null);
  const channelRef = useRef(null);
  const logRef = useRef(null);
  const inputRef = useRef(null);

  
  useEffect(() => {
    if (!token || !clientId || !room) return;

    let isMounted = true;

    (async () => {
      const AblyMod = await import("ably");            
      if (!isMounted) return;

      const ably = new AblyMod.default.Realtime({
        token,
        clientId,
        disconnectedRetryTimeout: 30_000,
        suspendedRetryTimeout: 30_000,
      });
      ablyRef.current = ably;

      const channel = ably.channels.get(room);
      channelRef.current = channel;

      ably.connection.on("connected", () => setIsConnected(true));
      ably.connection.on("disconnected", () => {
        setIsConnected(false);
        toast.error("⚠️ Connection lost. Leaving chat...", {
          position: "bottom-center",
          autoClose: 3000,
          theme: darkMode ? "dark" : "light",
        });

        // Leave after delay
        setTimeout(() => {
          setToken(null);
        }, 3000);
      });

      ably.connection.on("suspended", () => {
        toast.warn("📡 Connection suspended. Retrying...", {
          position: "bottom-center",
          autoClose: 4000,
          theme: darkMode ? "dark" : "light",
        });
        setTimeout(() => setToken(null), 4000);
      });

      ably.connection.on("failed", () => {
        toast.error("❌ Failed to connect to Ably.", {
          position: "bottom-center",
          autoClose: 4000,
          theme: darkMode ? "dark" : "light",
        });
        setTimeout(() => setToken(null), 4000);
      });


      channel.subscribe("chat", ({ data, clientId: sender, timestamp }) => {
        if (sender === clientId) return;
        const id = `${sender}-${timestamp || Date.now()}`;
        setMessages((prev) => [
          ...prev,
          { me: false, text: data, id, senderId: sender, timestamp },
        ]);
      });

      channel.presence.enter({ userName, status: "online" });



      

      
      channel.presence.get((err, members) => {
        if (err) return console.warn(err);

        const someoneElse = members.some(m => m.clientId !== clientId);
        setPeerOnline(someoneElse);
      });

      
      channel.presence.subscribe(({ action, clientId: sender }) => {
        if (sender === clientId) return; 

        if (action === "enter" || action === "update") setPeerOnline(true);
        if (action === "leave" || action === "absent") {
          setPeerOnline(false);
          toast.warn("🚪 The other person has left the chat.", {
            position: "bottom-center",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: darkMode ? "dark" : "light",
          });
          setTimeout(() => {
            setToken(null);
          }, 5000);
        }

      });


    })();

    return () => {
      isMounted = false;
      ablyRef.current?.close?.();
    };
  }, [token, clientId, room, userName]);

  const onLeave = async () => {
    try {
      await channelRef.current?.presence.leave();
    } catch (e) {
      console.warn("Presence leave failed:", e);
    }

    toast.success("🚪 You left the chat.", {
      position: "bottom-center",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: darkMode ? "dark" : "light",
    });

    setTimeout(() => {
      setToken(null); 
    }, 5000);
  };
  
  const send = async () => {
    const text = input.trim();
    if (!text || !channelRef.current || !isConnected) return;

    const timestamp = Date.now();
    setMessages((prev) => [
      ...prev,
      { me: true, text, id: `${clientId}-${timestamp}`, timestamp },
    ]);
    setInput("");

    try {
      await channelRef.current.publish("chat", text);
    } catch (err) {
      console.error("Sending error:", err);
    }
  };

  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  
  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  
  return (
    
    <Suspense fallback={<div className="p-4 text-center">Loading UI…</div>}>
      <div
        className={`flex flex-col ${isFullscreen ? "fixed inset-0 z-50" : "h-screen max-w-4xl mx-auto"
          } ${darkMode ? "bg-gray-900" : "bg-blue-50"}`}
      >
        
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`p-4 flex items-center justify-between border-b ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
        >
          {/* avatar + status */}
          <div className="flex items-center space-x-3">
            {userPhoto ? (
              <img
                src={userPhoto}
                alt={userName}
                className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className={`font-semibold text-lg ${darkMode ? "text-white" : "text-gray-800"}`}>
                  {userName}
                </h2>
                <span className={`text-sm px-2 py-1 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  }`}>
                  {collegeName}
                </span>
              </div>
              <p
                className={`text-sm flex items-center gap-1 ${darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
              >
                <FaCircle
                  className={`w-2 h-2 ${peerOnline ? "text-green-400" : "text-red-500"
                    }`}
                />
                {peerOnline ? "Connected" : "Disconnected"}
              </p>

            </div>
          </div>

          {/* header buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-600"
                }`}
              title="Toggle theme"
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>

            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-full ${darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
                }`}
              title="Fullscreen"
            >
              {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
            </button>

            <button
              onClick={onLeave}
              className="p-2 rounded-full bg-red-500 text-white"
              title="Leave chat"
            >
              <FaSignOutAlt size={16} />
            </button>
          </div>
        </motion.div>

        {/* messages */}
        <div
          ref={logRef}
          className="flex-1 overflow-y-auto p-4 space-y-3"
        >
          <AnimatePresence>
            {messages.map((m, i) => (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: i * 0.02 }}
                className={`flex ${m.me ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-lg px-4 py-3 rounded-2xl ${m.me
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : darkMode
                      ? "bg-gray-700 text-gray-100"
                      : "bg-white text-gray-800"
                    }`}
                >
                  {m.text}
                  <p className="text-xs mt-1 opacity-70">
                    {new Date(m.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* composer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`border-t p-4 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
            }`}
        >
          <div className="flex items-end space-x-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())
              }
              rows={1}
              placeholder="Type your message..."
              className={`flex-1 resize-none p-3 rounded-2xl focus:outline-none ${darkMode
                ? "bg-gray-700 text-white placeholder-gray-400"
                : "bg-gray-100 text-gray-800 placeholder-gray-500"
                }`}
              style={{ minHeight: "56px", maxHeight: "150px" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || !isConnected}
              className={`p-3 rounded-full flex-shrink-0 ${input.trim() && isConnected
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
            >
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      </div>
      <ToastContainer />
    </Suspense>
  );
}
