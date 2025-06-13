// AblyChat.jsx  ───────────────────────────────────────────────────────────
//
// Same props & behaviour as before.
// 1. Icons are lazy‑loaded.
// 2. Ably SDK is imported dynamically inside useEffect.
// ────────────────────────────────────────────────────────────────────────
import React, {
  useState,
  useEffect,
  useRef,
  lazy,
  Suspense,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import useThemeStore from "../../../Stores/ThemeStore";

/* ── 1️⃣  lazy‑load ONLY the icons you use ────────────────────────────── */
const FaPaperPlane  = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaPaperPlane  })));
const FaCircle      = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaCircle      })));
const FaMoon        = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaMoon        })));
const FaSun         = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaSun         })));
const FaSignOutAlt  = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaSignOutAlt  })));
const FaExpand      = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaExpand      })));
const FaCompress    = lazy(() => import("react-icons/fa").then(m => ({ default: m.FaCompress    })));

export default function AblyChat({
  token,
  clientId,
  room,
  userPhoto = null,
  userName = "Test User",
  collegeName = "Demo College",
  isOnline = true,
  onLeave = () => {},
}) {
  /* ── state & refs (unchanged) ──────────────────────────────────────── */
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
const { darkMode, toggleDarkMode } = useThemeStore();
  const [isFullscreen, setIsFullscreen] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const ablyRef    = useRef(null);
  const channelRef = useRef(null);
  const logRef     = useRef(null);
  const inputRef   = useRef(null);

  /* ── 2️⃣  load Ably SDK only when component mounts ─────────────────── */
  useEffect(() => {
    if (!token || !clientId || !room) return;

    let isMounted = true;

    (async () => {
      const AblyMod = await import("ably");            // <─ dynamic import
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
      ably.connection.on("disconnected", () => setIsConnected(false));

      channel.subscribe("chat", ({ data, clientId: sender, timestamp }) => {
        if (sender === clientId) return;
        const id = `${sender}-${timestamp || Date.now()}`;
        setMessages((prev) => [
          ...prev,
          { me: false, text: data, id, senderId: sender, timestamp },
        ]);
      });

      channel.presence.enter({ userName, status: "online" });
    })();

    return () => {
      isMounted = false;
      ablyRef.current?.close?.();
    };
  }, [token, clientId, room, userName]);

  /* ── send message (unchanged) ──────────────────────────────────────── */
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

  /* ── auto‑resize textarea (unchanged) ──────────────────────────────── */
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
      inputRef.current.style.height = `${Math.min(
        inputRef.current.scrollHeight,
        150
      )}px`;
    }
  }, [input]);

  /* ── scroll to bottom when messages change ─────────────────────────── */
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages]);

  /* ── UI helpers (unchanged) ────────────────────────────────────────── */
  const toggleFullscreen = () => setIsFullscreen((f) => !f);

  /* ── rendering ------------------------------------------------------- */
  return (
    /* Wrap everything in <Suspense> so lazy icons render safely */
    <Suspense fallback={<div className="p-4 text-center">Loading UI…</div>}>
      <div
        className={`flex flex-col ${
          isFullscreen ? "fixed inset-0 z-50" : "h-screen max-w-4xl mx-auto"
        } ${darkMode ? "bg-gray-900" : "bg-blue-50"}`}
      >
        {/* header ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`p-4 flex items-center justify-between border-b ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
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
              <h2 className="font-semibold text-lg">
                {userName}
              </h2>
              <p className="text-sm flex items-center gap-1">
                <FaCircle
                  className={`w-2 h-2 ${
                    isConnected ? "text-green-500" : "text-red-500"
                  }`}
                />
                {isConnected ? "Connected" : "Disconnected"}
              </p>
            </div>
          </div>

          {/* header buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                darkMode ? "bg-yellow-500 text-white" : "bg-gray-200 text-gray-600"
              }`}
              title="Toggle theme"
            >
              {darkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
            </button>

            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-full ${
                darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"
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

        {/* messages ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */}
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
                  className={`max-w-lg px-4 py-3 rounded-2xl ${
                    m.me
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

        {/* composer ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`border-t p-4 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
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
              className={`flex-1 resize-none p-3 rounded-2xl focus:outline-none ${
                darkMode
                  ? "bg-gray-700 text-white placeholder-gray-400"
                  : "bg-gray-100 text-gray-800 placeholder-gray-500"
              }`}
              style={{ minHeight: "56px", maxHeight: "150px" }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || !isConnected}
              className={`p-3 rounded-full flex-shrink-0 ${
                input.trim() && isConnected
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <FaPaperPlane />
            </button>
          </div>
        </motion.div>
      </div>
    </Suspense>
  );
}
