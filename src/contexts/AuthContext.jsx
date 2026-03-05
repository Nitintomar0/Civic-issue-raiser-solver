import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize guest user on app start
    initializeGuestUser();
  }, []);

  const initializeGuestUser = () => {
    try {
      // Check if guest user already exists in localStorage
      let guestUser = localStorage.getItem('guestUser');
      
      if (guestUser) {
        guestUser = JSON.parse(guestUser);
      } else {
        // Create new guest user
        guestUser = {
          uid: `guest_${uuidv4()}`,
          username: 'Guest User',
          role: 'citizen',
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
          points: 0,
          badges: [],
          reportsSubmitted: 0,
          reportsVerified: 0,
          createdAt: new Date().toISOString(),
        };
        
        // Save to localStorage
        localStorage.setItem('guestUser', JSON.stringify(guestUser));
      }
      
      setUser(guestUser);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing guest user:', error);
      setLoading(false);
    }
  };

  const updateUserProfile = (updates) => {
    try {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('guestUser', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  const addPoints = (points) => {
    const newPoints = (user.points || 0) + points;
    updateUserProfile({ points: newPoints });
    checkAndAwardBadges(newPoints);
  };

  const checkAndAwardBadges = (points) => {
    const badges = user.badges || [];
    const newBadges = [];

    if (points >= 100 && !badges.includes('bronze')) {
      newBadges.push('bronze');
    }
    if (points >= 500 && !badges.includes('silver')) {
      newBadges.push('silver');
    }
    if (points >= 1000 && !badges.includes('gold')) {
      newBadges.push('gold');
    }

    if (newBadges.length > 0) {
      updateUserProfile({ badges: [...badges, ...newBadges] });
    }
  };

  const incrementReports = () => {
    updateUserProfile({ 
      reportsSubmitted: (user.reportsSubmitted || 0) + 1 
    });
  };

  const incrementVerifications = () => {
    updateUserProfile({ 
      reportsVerified: (user.reportsVerified || 0) + 1 
    });
  };

  const resetGuestUser = () => {
    localStorage.removeItem('guestUser');
    initializeGuestUser();
  };

  const value = {
    user,
    loading,
    updateUserProfile,
    addPoints,
    incrementReports,
    incrementVerifications,
    resetGuestUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
