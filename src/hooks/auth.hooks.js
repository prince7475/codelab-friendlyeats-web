'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithGoogle, signOut } from '@/src/lib/firebase/auth';
import useAuthStore from '@/src/store/auth.store';

/**
 * Hook to handle authentication state and actions
 * @returns {Object} Authentication methods and state
 */
export function useAuth() {
  const router = useRouter();
  const { 
    setUser, 
    setLoading, 
    setError, 
    clearAuth,
    isLoading,
    error,
    user,
    isAuthenticated 
  } = useAuthStore();

  // Listen to authentication state changes
  useEffect(() => {
    let unsubscribed = false;
    
    const unsubscribe = onAuthStateChanged((user) => {
      if (unsubscribed) return;
      console.log("Auth state changed:", user);
      
      if (user) {
        // If we have a user, update the store with their data
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        // If no user, clear the auth state
        clearAuth();
      }
      setLoading(false);
    });

    return () => {
      unsubscribed = true;
      unsubscribe();
    };
  }, [setUser, setLoading, clearAuth]);

  /**
   * Handle Google sign in
   * @returns {Promise<void>}
   */
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await signInWithGoogle();
      setUser(userData);
      
      // Redirect to wardrobe page after successful login
      router.push('/wardrobe');
    } catch (error) {
      console.error('Sign in error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle sign out
   * @returns {Promise<void>}
   */
  const handleSignOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await signOut();
      clearAuth();
      
      // Redirect to home page after logout
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    // Authentication methods
    signIn: handleGoogleSignIn,
    signOut: handleSignOut,
    
    // Authentication state
    isLoading,
    error,
    user,
    isAuthenticated,
    
    // Helper methods
    clearError: () => setError(null)
  };
}

/**
 * Hook to protect routes that require authentication
 * @param {boolean} redirectTo - Path to redirect to if not authenticated
 */
export function useRequireAuth(redirectTo = '/') {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  return { isLoading, isAuthenticated };
}