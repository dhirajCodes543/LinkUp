import React, { useEffect, useRef, useState } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import axios from "axios";
import { auth } from "../../../firebase";

function VideoCall({ roomId, userId, userName = "User", setRoomId, setUserId }) {
  const containerRef = useRef(null);
  const zcInstanceRef = useRef(null);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [callStarted, setCallStarted] = useState(false);

  // Responsive mobile detection
  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck =
        window.innerWidth <= 768 ||
        window.matchMedia("(pointer:coarse)").matches;
      setIsMobile(mobileCheck);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Prevent accidental leave
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (zcInstanceRef.current) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Initialize video call with mobile optimizations
  useEffect(() => {
    if (!roomId || !userId || !containerRef.current || zcInstanceRef.current) return;

    const initializeCall = async () => {
      try {
        setIsJoining(true);

        const user = auth.currentUser;

        if (!user) {
          toast.error("User not signed in");
          return;
        }

        if (!user.emailVerified) {
          toast.error("Please verify your email before continuing.");
          return;
        }
        const userName = user.displayName
        const tokenGeneration = async () => {
          try {
            const idToken = await user.getIdToken();

            const res = await axios.post(
              "/api/randomcall/token",
              { roomId, userId,userName },
              {
                headers: {
                  Authorization: `Bearer ${idToken}`,
                },
              }
            );

            return res.data.token;  // return the token here

          } catch (error) {
            console.error("Token generation error:", error);
            return null;  // return null on failure
          }
        };

        const kitToken = await tokenGeneration();

        if (!kitToken) {
            console.log("Token generation failed");
            return;
        }



        const zc = ZegoUIKitPrebuilt.create(kitToken);
        zcInstanceRef.current = zc;

        zc.joinRoom({
          container: containerRef.current,
          scenario: {
            mode: ZegoUIKitPrebuilt.OneONoneCall,
          },
          showPreJoinView: true,
          showRoomTimer: true,
          showTextChat: true,
          showScreenSharingButton: true,
          showAudioVideoSettingsButton: true,
          layout: isMobile ? "Grid" : "Auto", // Fixed mobile layout
          maxUsers: 2,
          turnOnMicrophoneWhenJoining: true,
          turnOnCameraWhenJoining: true,
          useFrontFacingCamera: isMobile,
          onJoinRoomFailed: (errorCode) => {
            setError(`Connection failed (Error: ${errorCode})`);
          },
          onJoinRoom: () => {
            setIsJoining(false);
            setCallStarted(true);
          },
          onLeaveRoom: () => {
            zcInstanceRef.current = null;
            setRoomId(null)
            setUserId(null)

            console.log("Room left");
            setCallStarted(false);
          },
          config: {
            autoReconnect: true,
            maxReconnectTimes: 5,
            reconnectInterval: 3000,
          },
          // Mobile-specific UI improvements
          showUserList: !isMobile,
          showLeavingView: false,
          showInviteButton: !isMobile,
          showTurnOffRemoteCameraButton: !isMobile,
          showTurnOffRemoteMicrophoneButton: !isMobile,
          showRemoveUserButton: !isMobile,
          videoResolutionList: isMobile
            ? [ZegoUIKitPrebuilt.VideoResolution_360P]
            : [
              ZegoUIKitPrebuilt.VideoResolution_180P,
              ZegoUIKitPrebuilt.VideoResolution_360P,
              ZegoUIKitPrebuilt.VideoResolution_720P
            ],
        });
      } catch (err) {
        setError(err.message || "Failed to initialize video call");
        setIsJoining(false);
      }
    };

    initializeCall();

    return () => {
      if (zcInstanceRef.current) {
        zcInstanceRef.current.destroy();
        zcInstanceRef.current = null;
      }
    };
  }, [roomId, userId, userName, isMobile]);

  // Error state
  if (error) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-red-900 to-black flex items-center justify-center text-white">
        <div className="text-center max-w-md p-4">
          <h3 className="text-xl font-semibold mb-2">Connection Failed</h3>
          <p className="text-red-300 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 rounded-lg text-white hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Mobile call status bar */}
      {isMobile && callStarted && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-70 text-white p-3 text-center">
          <p className="truncate">Connected to: {roomId}</p>
        </div>
      )}

      <div
        ref={containerRef}
        className={`flex-1 w-full h-full ${isMobile ? 'pt-10 pb-20' : ''}`}
      />

      {/* Mobile control bar overlay */}
      {isMobile && callStarted && (
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-black bg-opacity-80 flex items-center justify-center space-x-8">
          {/* Controls will be automatically injected here by Zego SDK */}
        </div>
      )}

      {/* {isJoining && (
        <div className="absolute inset-0 bg-black bg-opacity-90 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg font-medium">Joining room...</p>
            <p className="text-gray-400 mt-2">This may take a few seconds</p>
          </div>
        </div>
      )} */}
    </div>
  );
}

export default VideoCall;