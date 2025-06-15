import { motion, AnimatePresence } from "framer-motion"
import { Video, Users, Loader2, Wifi, WifiOff, X } from "lucide-react"
import useAuthStore from "../../../Stores/AuthStore"
import React, { lazy, Suspense, useState, useEffect, useRef } from "react";
import useThemeStore from "../../../Stores/ThemeStore"
const AblyChat = React.lazy(() => import('./VideoCall'));
const RandomConnector = () => {
    const [roomId, setRoomId] = useState("")
    const [userId, setUserId] = useState("")
    const [enable, setEnable] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("");
    const [college, setCollege] = useState("");
    const [isConnecting, setIsConnecting] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState("disconnected") // disconnected, connecting, connected, error
    const [error, setError] = useState("")
    const backendData = useAuthStore((state) => state.backendData)
    const darkMode = useThemeStore((state) => state.darkMode)
    const socketRef = useRef(null)

    useEffect(() => {
        // Initialize WebSocket connection
        const initSocket = () => {
            try {
                socketRef.current = new WebSocket("wss://linkup-backend-j59j.onrender.com");

                socketRef.current.onopen = () => {
                    setConnectionStatus("connected")
                    setError("")
                }

                socketRef.current.onclose = () => {
                    setConnectionStatus("disconnected")
                    setIsConnecting(false)
                }

                socketRef.current.onerror = (error) => {
                    setConnectionStatus("error")
                    setError("Connection failed. Please try again.")
                    setIsConnecting(false)
                    console.log(error);
                }

                socketRef.current.onmessage = (event) => {
                    try {
                        const data = JSON.parse(event.data)
                        console.log("Received data:", data)

                        // Handle successful room assignment
                        if (data.type === 'match_found') {
                            console.log(data);
                            setEnable(!enable)
                            setRoomId(data.room)
                            setIsConnecting(false)
                            setToken(data.token)
                            setName(data.matchedUser.name);
                            setAvatar(data.matchedUser.avatar);
                            setCollege(data.matchedUser.college);
                            // console.log(data.token);

                            setError("")
                        }
                        // Handle queued status


                        else if (data.type === "queued") {
                            // Keep connecting state, user is in queue
                            // console.log("User queued:", data.message)
                        }
                        // Handle timeout (no match found)
                        else if (data.type === "timeout") {
                            setError(data.message || "No match found. Please try again.")
                            setIsConnecting(false)
                        }
                        // Handle matching stopped (user cancelled)
                        else if (data.type === "matching_stopped") {
                            setError("Matching cancelled")
                            setIsConnecting(false)
                        }
                        // Handle any error responses
                        else if (data.type === "error") {
                            setError(data.message || "An error occurred")
                            setIsConnecting(false)
                        }
                        // Handle any other rejection or unknown response
                        else if (!data.roomId && !data.type) {
                            setError("Unexpected response from server")
                            setIsConnecting(false)
                        }
                    } catch (error) {
                        console.error("Invalid JSON:", event.data)
                        setError("Invalid response from server")
                        setIsConnecting(false)
                    }
                }
            } catch (error) {
                setConnectionStatus("error")
                setError("Unable to connect to server")
            }
        }

        initSocket()

        // Cleanup on unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.close()
            }
        }
    }, [])

    const requestRandomMatch = () => {
        if (!backendData?.firebaseUid) {
            setError("Complete your profile")
            return
        }

        if (socketRef.current?.readyState === WebSocket.OPEN) {
            setIsConnecting(true)
            setError("")
            setUserId(backendData.firebaseUid)

            // console.log(backendData.firebaseUid);

            socketRef.current.send(JSON.stringify({
                type: "join",
                interests: backendData.interests || [],
                id: backendData.firebaseUid,
                avatar: backendData.avatar,
                college: backendData.college,
                name: backendData.fullName
            }))
        } else {
            setError("Connection not available. Please refresh and try again.")
        }
    }

    const cancelSearch = () => {
        setIsConnecting(false)
        setError("")
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "cancel"
            }))
        }
    }

    const clearErrorAndRetry = () => {
        setError("")
        setRoomId("")
        setUserId("")
    }

    const getStatusIcon = () => {
        switch (connectionStatus) {
            case "connected":
                return <Wifi className="w-4 h-4 text-green-500" />
            case "connecting":
                return <Loader2 className="w-4 h-4 text-yellow-500 animate-spin" />
            case "error":
                return <WifiOff className="w-4 h-4 text-red-500" />
            default:
                return <WifiOff className="w-4 h-4 text-gray-500" />
        }
    }

    const themeClasses = {
        bg: darkMode ? 'bg-gray-900' : 'bg-gray-50',
        cardBg: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200',
        text: darkMode ? 'text-white' : 'text-gray-900',
        textSecondary: darkMode ? 'text-gray-300' : 'text-gray-600',
        button: darkMode
            ? 'bg-violet-600 hover:bg-violet-700 focus:ring-violet-500'
            : 'bg-violet-600 hover:bg-violet-700 focus:ring-violet-500',
        buttonSecondary: darkMode
            ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200'
            : 'bg-gray-100 hover:bg-gray-200 border-gray-300 text-gray-700'
    }

    // Show video call when both roomId and userId are available
    const showVideoCall = roomId && userId && token

    return (
        <>
            <div className={`min-h-screen w-full transition-colors duration-300 ${themeClasses.bg}`}>
                <AnimatePresence mode="wait">
                    {!showVideoCall ? (
                        <motion.div
                            key="connector"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-col items-center justify-center min-h-screen p-4"
                        >
                            <div className={`w-full max-w-md mx-auto rounded-2xl border shadow-xl p-8 ${themeClasses.cardBg}`}>
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="mx-auto w-16 h-16 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center mb-4"
                                    >
                                        <Video className="w-8 h-8 text-white" />
                                    </motion.div>
                                    <h1 className={`text-2xl font-bold mb-2 ${themeClasses.text}`}>
                                        Random Chat
                                    </h1>
                                    <h3 className={`${themeClasses.textSecondary}`}>
                                        Connect with random people based on your interests
                                    </h3>
                                </div>

                                {/* Connection Status */}
                                <div className="flex items-center justify-center gap-2 mb-6">
                                    {getStatusIcon()}
                                    <span className={`text-sm ${themeClasses.textSecondary}`}>
                                        {connectionStatus === "connected" && "Connected"}
                                        {connectionStatus === "connecting" && "Connecting..."}
                                        {connectionStatus === "disconnected" && "Disconnected"}
                                        {connectionStatus === "error" && "Connection Error"}
                                    </span>
                                </div>

                                {/* Error Message */}
                                <AnimatePresence>
                                    {error && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6"
                                        >
                                            <div className="flex items-center justify-between">
                                                <p className="text-red-600 dark:text-red-400 text-sm">
                                                    {error}
                                                </p>
                                                <button
                                                    onClick={clearErrorAndRetry}
                                                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* User Interests */}
                                {backendData?.interests?.length > 0 && (
                                    <div className="mb-6">
                                        <p className={`text-sm font-medium mb-2 ${themeClasses.text}`}>
                                            Your interests:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {backendData.interests.map((interest, index) => (
                                                <span
                                                    key={index}
                                                    className="px-2 py-1 text-xs rounded-full bg-violet-100 text-violet-800 dark:bg-violet-900/60 dark:text-violet-200 shadow-sm transition-colors duration-200"
                                                >
                                                    {interest}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    {!isConnecting ? (
                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={requestRandomMatch}
                                            disabled={connectionStatus !== "connected"}
                                            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${themeClasses.button}`}
                                        >
                                            <Users className="w-5 h-5" />
                                            Start Random Chat
                                        </motion.button>
                                    ) : (
                                        <div className="space-y-3">
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="text-center"
                                            >
                                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-violet-600" />
                                                <p className={`text-sm ${themeClasses.textSecondary}`}>
                                                    Searching for a match...
                                                </p>
                                            </motion.div>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={cancelSearch}
                                                className={`w-full py-2 px-4 rounded-xl border font-medium transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-gray-300 focus:ring-opacity-50 ${themeClasses.buttonSecondary}`}
                                            >
                                                Cancel Search
                                            </motion.button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="videocall"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="relative h-screen w-full"
                        >
                            {/* Video Call Component */}
                            <Suspense fallback={<div className="p-8 text-center text-gray-400">Loading chat…</div>}>
                                {token && (
                                    <AblyChat
                                        token={token}
                                        setToken={setToken}
                                        clientId={userId}
                                        room={roomId}
                                        userPhoto={avatar}
                                        userName={name}
                                        collegeName={college}
                                    />
                                )}

                            </Suspense>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    )
}

export default RandomConnector