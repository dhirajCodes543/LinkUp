import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Send, Smile, Sun, Moon, RotateCw, X } from 'lucide-react';

const ChatInterface = () => {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [callStatus, setCallStatus] = useState(null);
  const [messages, setMessages] = useState([]);
  const [typing, setTyping] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulate connection
  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  // Call handlers
  const handleCall = () => {
    setCallStatus('ringing');
    setTimeout(() => {
      setCallStatus(Math.random() > 0.5 ? 'accepted' : 'denied');
    }, 3000);
  };

  // Message handling
  const sendMessage = () => {
    if (message.trim()) {
      setMessages([...messages, { text: message, sent: true }]);
      setMessage('');
      // Simulate response
      setTimeout(() => {
        setMessages(prev => [...prev, { text: 'Sample response', sent: false }]);
      }, 1000);
    }
  };

  if (!isLoggedIn) return null;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark:bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Dark Mode Toggle */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="fixed top-4 right-4 p-2 rounded-full bg-opacity-20 backdrop-blur-sm"
      >
        {darkMode ? (
          <Sun className="w-6 h-6 text-yellow-400" />
        ) : (
          <Moon className="w-6 h-6 text-gray-600" />
        )}
      </button>

      <AnimatePresence>
        {!connected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center min-h-screen"
          >
            <button
              onClick={handleConnect}
              disabled={connecting}
              className={`flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-lg transition-all ${
                darkMode
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${connecting && 'opacity-75 cursor-not-allowed'}`}
            >
              {connecting ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Go Random'
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {connected && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col h-screen"
        >
          {/* Header */}
          <div className={`flex items-center justify-between p-4 border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-500" />
              <div>
                <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Random User
                </h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  University of Tech
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleCall}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? 'hover:bg-gray-700/50 text-white'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <Phone className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-2xl ${
                    msg.sent
                      ? darkMode
                        ? 'bg-purple-600 text-white'
                        : 'bg-blue-600 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.text}
                </div>
              </motion.div>
            ))}
            {typing && (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                </div>
                Typing...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-lg ${
                darkMode ? 'text-gray-400 hover:bg-gray-700/50' : 'text-gray-600 hover:bg-gray-100'
              }`}>
                <Smile className="w-6 h-6" />
              </button>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className={`flex-1 p-2 rounded-lg focus:outline-none transition-colors ${
                  darkMode
                    ? 'bg-gray-800 text-white focus:bg-gray-700'
                    : 'bg-gray-100 text-gray-900 focus:bg-white'
                }`}
              />
              <button
                onClick={sendMessage}
                className={`p-2 rounded-lg ${
                  darkMode
                    ? 'text-purple-400 hover:bg-gray-700/50'
                    : 'text-blue-600 hover:bg-gray-100'
                }`}
              >
                <Send className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Call Modals */}
          <AnimatePresence>
            {callStatus === 'ringing' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center"
              >
                <div className={`p-8 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : ''}`}>
                    Incoming Call
                  </h2>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setCallStatus('accepted')}
                      className="px-6 py-2 bg-green-500 text-white rounded-lg"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => setCallStatus('denied')}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {callStatus === 'denied' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`fixed bottom-4 right-4 p-4 rounded-lg ${
                  darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                } shadow-lg`}
              >
                <div className="flex items-center gap-2">
                  <X className="w-5 h-5 text-red-500" />
                  Call denied
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default ChatInterface;