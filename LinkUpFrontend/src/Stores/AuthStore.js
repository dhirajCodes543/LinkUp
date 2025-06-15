import { create } from 'zustand';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';

const useAuthStore = create((set) => ({
  user: null,         
  backendData: null,  
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


onAuthStateChanged(auth, async (user) => {
  if (!user) {
    
    useAuthStore.getState().clearUser();
    return;
  }
  await user.reload(); 
  const freshUser = auth.currentUser;
 
  // console.log("user",user)
  useAuthStore.getState().setUser(user);
  
  
  if (!freshUser.emailVerified) {
    const checkInterval = setInterval(async () => {
      await refreshUserAndBackendData();
      const currentState = useAuthStore.getState();
      
      
      if (!currentState.user || currentState.user.emailVerified) {
        clearInterval(checkInterval);
      }
    }, 3000); 
  }
  
  let token;
  try {
    token = await freshUser.getIdToken(true);;
    // console.log(useAuthStore.getState().backendData
  } catch (tokenError) {
    // console.error('Error getting Firebase token:', tokenError);
    useAuthStore.getState().setBackendData(null);
    return;
  }
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/userdata`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  
    useAuthStore.getState().setBackendData(res.data);
    // console.log("Backend data",useAuthStore.getState().backendData)
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
});

export default useAuthStore;
