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

// Set up auth listener once
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // User signed out
    useAuthStore.getState().clearUser();
    return;
  }

  await user.reload(); // 🔄 Refresh user data
  const freshUser = auth.currentUser;
  
  console.log("user",user)
  useAuthStore.getState().setUser(user);

  let token;
  try {
    token = await freshUser.getIdToken(true);;
    // console.log(useAuthStore.getState().backendData)
  } catch (tokenError) {
    console.error('Error getting Firebase token:', tokenError);
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
    console.log("nacho",useAuthStore.getState().backendData)
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
