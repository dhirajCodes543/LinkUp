import { create } from 'zustand';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,         // Firebase user or combined info
  backendData: null,  // Data fetched from backend
  isLoggedIn: false,
  loading: true,
  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
      loading: false,
    }),
  setBackendData: (data) => set({ backendData: data }),
  clearUser: () =>
    set({
      user: null,
      backendData: null,
      isLoggedIn: false,
      loading: false,
    }),
}));

// 🆕 Function to refresh user data when needed
const refreshUserAndBackendData = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) return;
  
  try {
    await currentUser.reload();
    const freshUser = auth.currentUser;
    
    useAuthStore.getState().setUser(freshUser);
    
    const token = await freshUser.getIdToken(true);
    
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/userdata`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      useAuthStore.getState().setBackendData(res.data);
    } catch (error) {
      if (error.response) {
        console.log('Backend response error:', error.response.data);
      } else if (error.request) {
        console.log('No response from backend:', error.request);
      } else {
        console.log('Error setting up request:', error.message);
      }
      useAuthStore.getState().setBackendData(null);
    }
  } catch (error) {
    console.error('Error refreshing user data:', error);
  }
};

// Set up auth listener once
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // User signed out
    useAuthStore.getState().clearUser();
    return;
  }
  await user.reload(); // 🔄 Refresh user data
  const freshUser = auth.currentUser;
 
  // console.log("user",user)
  useAuthStore.getState().setUser(user);
  
  // 🆕 Auto-refresh for unverified users
  if (!freshUser.emailVerified) {
    const checkInterval = setInterval(async () => {
      await refreshUserAndBackendData();
      const currentState = useAuthStore.getState();
      
      // Stop checking if email is verified or user logged out
      if (!currentState.user || currentState.user.emailVerified) {
        clearInterval(checkInterval);
      }
    }, 3000); // Check every 3 seconds
  }
  
  let token;
  try {
    token = await freshUser.getIdToken(true);;
    // console.log(useAuthStore.getState().backendData)
  } catch (tokenError) {
    // console.error('Error getting Firebase token:', tokenError);
    // Even if token fails, update user without backend data
    useAuthStore.getState().setBackendData(null);
    return;
  }
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/userdata`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // If successful, update store with backend data
    useAuthStore.getState().setBackendData(res.data);
    // console.log("nacho",useAuthStore.getState().backendData)
  } catch (error) {
    if (error.response) {
      // Backend responded with an error status
      console.log('Backend response error:', error.response.data);
    } else if (error.request) {
      // No response received
      console.log('No response from backend:', error.request);
    } else {
      // Other errors
      console.log('Error setting up request:', error.message);
    }
   
    // Update store with user but no backend data
    useAuthStore.getState().setBackendData(null);
  }
});

export default useAuthStore;