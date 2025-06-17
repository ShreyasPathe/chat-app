import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signIn, 
  signUp, 
  logOut, 
  onAuthChange,
  createUserProfile,
  getUserProfile,
  resetPassword
} from '../services/firebase';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    console.log('AuthProvider mounted');
    const unsubscribe = onAuthChange(async (user) => {
      console.log('Auth state changed:', user);
      setUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          console.log('User profile loaded:', profile);
          setUserProfile(profile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider unmounting');
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    console.log('Attempting login for:', email);
    try {
      const result = await signIn(email, password);
      console.log('Login successful:', result);
      return result;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (email, password, userData) => {
    console.log('Attempting registration for:', email);
    try {
      const result = await signUp(email, password);
      console.log('Registration successful:', result);
      await createUserProfile(result.user.uid, {
        email,
        ...userData,
        createdAt: new Date().toISOString()
      });
      return result;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    console.log('Attempting logout');
    try {
      await logOut();
      setUser(null);
      setUserProfile(null);
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    resetPassword
  };

  console.log('AuthProvider rendering, loading:', loading);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 