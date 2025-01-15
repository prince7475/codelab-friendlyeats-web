import { create } from 'zustand';

/**
 * Auth store to manage user authentication state
 * Handles user profile data, loading states, and error messages
 */
const useAuthStore = create((set) => ({
  // User profile data
  user: null,
  isAuthenticated: false,
  
  // Loading states
  isLoading: false,
  
  // Error state
  error: null,

  // Action to set user data and update authentication status
  setUser: (userData) => set({
    user: userData,
    isAuthenticated: !!userData,
    error: null,
  }),

  // Action to start loading state
  setLoading: (isLoading) => set({
    isLoading,
    error: null,
  }),

  // Action to set error state
  setError: (error) => set({
    error,
    isLoading: false,
  }),

  // Action to clear all auth state (logout)
  clearAuth: () => set({
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  }),
}));

export default useAuthStore;