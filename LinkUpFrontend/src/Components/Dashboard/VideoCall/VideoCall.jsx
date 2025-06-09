import { ZegoExpressEngine } from 'zego-express-engine-webrtc';
import { useEffect, useRef, useState } from 'react';

const VideoCall = ({ token, roomID, userID }) => {
  if (!roomID || !token || !userID) return null;
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const zegoEngineRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamsRef = useRef(new Map());
  const [error, setError] = useState(null);
  const [connectionState, setConnectionState] = useState('connecting');
  const currentRoomRef = useRef(null);
  const isCleaningUpRef = useRef(false);
  
  // Replace with your actual App ID
  const appID = 2049494275;

  // Token validation helper
  const validateToken = (token) => {
    if (!token || typeof token !== 'string') {
      throw new Error('Invalid token format');
    }
    if (token.length < 10) {
      throw new Error('Token appears to be too short');
    }
    // Add more validation as needed
    return true;
  };

  // Initialize Zego Engine
  useEffect(() => {
    if (!appID || isNaN(appID)) {
      setError('Invalid Zego App ID');
      return;
    }

    try {
      if (!zegoEngineRef.current) {
        console.log('Initializing Zego Engine with App ID:', appID);
        // Add scenario config for better connection
        zegoEngineRef.current = new ZegoExpressEngine(appID, {
          scenario: {
            mode: 'General', // or 'Communication' for 1-on-1 calls
            codec: 'VP8'
          }
        });
      }
    } catch (err) {
      setError('Failed to initialize video engine');
      console.error('Engine initialization error:', err);
      return;
    }

    const engine = zegoEngineRef.current;
    
    // Room state change handler with better error mapping
    const handleRoomStateUpdate = (roomID, state, errorCode, extendedData) => {
      console.log('Room state update:', { roomID, state, errorCode, extendedData });
      
      if (errorCode !== 0) {
        console.error('Room connection error:', errorCode);
        
        let errorMessage = 'Connection failed';
        switch (errorCode) {
          case 1102016:
            errorMessage = 'Room service error. Please check your configuration and try again.';
            break;
          case 1102001:
            errorMessage = 'Invalid App ID or configuration.';
            break;
          case 1102003:
            errorMessage = 'Authentication failed. Invalid token.';
            break;
          case 1102014:
            errorMessage = 'Room capacity exceeded.';
            break;
          default:
            errorMessage = `Room connection failed (${errorCode}): ${extendedData || 'Unknown error'}`;
        }
        
        setError(errorMessage);
        setConnectionState('failed');
      } else {
        switch (state) {
          case 'CONNECTED':
            setConnectionState('connected');
            setError(null);
            break;
          case 'CONNECTING':
            setConnectionState('connecting');
            break;
          case 'DISCONNECTED':
            setConnectionState('disconnected');
            break;
        }
      }
    };
    
    const handleStreamUpdate = (updateRoomID, updateType, streamList) => {
      if (updateRoomID !== currentRoomRef.current || isCleaningUpRef.current) return;
      
      console.log('Stream update:', { updateRoomID, updateType, streamList });
      
      if (updateType === 'ADD') {
        streamList.forEach(stream => {
          if (remoteStreamsRef.current.has(stream.streamID)) return;

          console.log('Adding remote stream:', stream.streamID);
          
          const videoElement = document.createElement('video');
          videoElement.autoplay = true;
          videoElement.playsInline = true;
          videoElement.className = 'remote-video';
          videoElement.style.width = '100%';
          videoElement.style.height = '100%';
          videoElement.style.objectFit = 'cover';
          
          if (remoteVideoRef.current) {
            remoteVideoRef.current.appendChild(videoElement);
          }
          
          engine.playStream(stream.streamID, { video: videoElement })
            .then(() => {
              console.log('Successfully playing stream:', stream.streamID);
            })
            .catch(err => {
              console.error('Play stream error:', err);
              videoElement.remove();
            });
          
          remoteStreamsRef.current.set(stream.streamID, videoElement);
        });
      } else if (updateType === 'DELETE') {
        streamList.forEach(stream => {
          const videoElement = remoteStreamsRef.current.get(stream.streamID);
          if (videoElement) {
            console.log('Removing remote stream:', stream.streamID);
            engine.stopPlayingStream(stream.streamID);
            videoElement.remove();
            remoteStreamsRef.current.delete(stream.streamID);
          }
        });
      }
    };

    // Error handler
    const handleEngineError = (errorCode, errorMessage) => {
      console.error('Zego Engine Error:', { errorCode, errorMessage });
      setError(`Engine error: ${errorCode} - ${errorMessage}`);
    };

    engine.on('roomStateUpdate', handleRoomStateUpdate);
    engine.on('roomStreamUpdate', handleStreamUpdate);
    engine.on('error', handleEngineError);
    
    return () => {
      engine.off('roomStateUpdate', handleRoomStateUpdate);
      engine.off('roomStreamUpdate', handleStreamUpdate);
      engine.off('error', handleEngineError);
    };
  }, [appID]);

  // Start/Stop video call with retry logic
  useEffect(() => {
    if (!zegoEngineRef.current) return;
    
    const engine = zegoEngineRef.current;
    let activeCall = true;
    currentRoomRef.current = roomID;
    isCleaningUpRef.current = false;
    
    const startCall = async (retryCount = 0) => {
      const maxRetries = 2;
      
      try {
        console.log('Starting call with:', { roomID, userID, tokenLength: token.length });
        
        // Validate token first
        validateToken(token);
        
        // Generate unique stream ID
        const streamID = `${userID}_${Date.now()}`;
        
        // Get user media first
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 },
            facingMode: 'user'
          }, 
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        
        if (!activeCall) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        // Login to room with simplified configuration
        console.log('Logging into room:', roomID);
        await engine.loginRoom(
          roomID,
          token,
          { 
            userID: userID, 
            userName: userID || `User_${Date.now()}` 
          }
          // Removed problematic room config object
        );
        
        console.log('Successfully joined room, starting to publish stream:', streamID);
        
        // Wait a bit before publishing to ensure room connection is stable
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (!activeCall) return;
        
        // Start publishing stream with media constraints
        await engine.startPublishingStream(streamID, stream, {
          videoCodec: 'VP8',
          width: 640,
          height: 480,
          bitrate: 1000
        });
        console.log('Successfully started publishing stream');

        setConnectionState('connected');

      } catch (error) {
        if (!activeCall) return;
        
        console.error('Call setup error:', error);
        
        // Retry logic for specific errors
        if (retryCount < maxRetries && (
          error.code === 1102016 || // liveroom error
          error.code === 50119 ||   // server error
          error.message?.includes('network') ||
          error.message?.includes('timeout')
        )) {
          console.log(`Retrying connection (attempt ${retryCount + 1}/${maxRetries + 1})`);
          await new Promise(resolve => setTimeout(resolve, 2000 * (retryCount + 1)));
          return startCall(retryCount + 1);
        }
        
        // Handle specific Zego error codes
        let errorMessage = `Video call failed: ${error.message}`;
        
        if (error.code) {
          switch (error.code) {
            case 1102016:
              errorMessage = 'Room service temporarily unavailable. Please try again.';
              break;
            case 1102003:
            case 20014:
              errorMessage = 'Authentication failed. Please refresh and try again.';
              break;
            case 50119:
              errorMessage = 'Server temporarily unavailable. Please try again later.';
              break;
            case 1102001:
              errorMessage = 'Invalid configuration. Please contact support.';
              break;
            default:
              errorMessage = `Connection error (${error.code}): ${error.message}`;
          }
        }
        
        setError(errorMessage);
        setConnectionState('failed');
        
        // Cleanup on error
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach(track => track.stop());
          localStreamRef.current = null;
        }
      }
    };

    startCall();

    // Cleanup function
    return () => {
      console.log('Cleaning up video call');
      activeCall = false;
      isCleaningUpRef.current = true;
      
      // Clean remote streams
      remoteStreamsRef.current.forEach((element, streamID) => {
        try {
          engine.stopPlayingStream(streamID);
          element.remove();
        } catch (err) {
          console.warn('Error stopping remote stream:', err);
        }
      });
      remoteStreamsRef.current.clear();

      // Stop publishing and leave room
      if (engine && currentRoomRef.current) {
        try {
          engine.stopPublishingStream();
          engine.logoutRoom(currentRoomRef.current);
        } catch (err) {
          console.warn('Error during room logout:', err);
        }
      }

      // Stop local media
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }

      // Reset video elements
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      
      currentRoomRef.current = null;
    };
  }, [token, roomID, userID]);

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <h3 style={styles.errorHeading}>Connection Error</h3>
        <p style={styles.errorMessage}>{error}</p>
        <p style={styles.errorDetails}>
          Room: {roomID}<br/>
          User: {userID}<br/>
          State: {connectionState}
        </p>
        <button 
          style={styles.reloadButton}
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Connection status */}
      {connectionState !== 'connected' && (
        <div style={styles.statusOverlay}>
          <p style={styles.statusText}>
            {connectionState === 'connecting' ? 'Connecting...' : 
             connectionState === 'failed' ? 'Connection Failed' :
             'Disconnected'}
          </p>
        </div>
      )}
      
      {/* Remote video container */}
      <div ref={remoteVideoRef} style={styles.remoteContainer}>
        {remoteStreamsRef.current.size === 0 && connectionState === 'connected' && (
          <div style={styles.waitingMessage}>
            <p>Waiting for other participant...</p>
          </div>
        )}
      </div>
      
      {/* Local video preview */}
      <div style={styles.localPreview}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          style={styles.localVideo}
        />
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    backgroundColor: '#000',
    overflow: 'hidden'
  },
  remoteContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  localPreview: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: '25vw',
    height: '25vh',
    minWidth: 160,
    minHeight: 120,
    zIndex: 10,
    borderRadius: 8,
    overflow: 'hidden',
    boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    backgroundColor: '#333'
  },
  localVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transform: 'rotateY(180deg)',
    backgroundColor: '#333'
  },
  statusOverlay: {
    position: 'absolute',
    top: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
    padding: '10px 20px',
    borderRadius: 20,
    color: 'white'
  },
  statusText: {
    margin: 0,
    fontSize: 14,
    fontWeight: 'bold'
  },
  waitingMessage: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18
  },
  errorContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    flexDirection: 'column',
    padding: 20,
    textAlign: 'center',
    backgroundColor: '#000',
    color: 'white'
  },
  errorHeading: {
    color: '#e74c3c',
    marginBottom: 10
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 10,
    maxWidth: 400
  },
  errorDetails: {
    fontSize: 12,
    color: '#bbb',
    marginBottom: 20,
    fontFamily: 'monospace'
  },
  reloadButton: {
    marginTop: 20,
    padding: '12px 24px',
    background: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: 16,
    fontWeight: 'bold'
  }
};

export default VideoCall;