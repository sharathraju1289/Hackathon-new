import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [schedules, setSchedules] = useState(() => {
    try {
      const stored = localStorage.getItem('schedules');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('schedules', JSON.stringify(schedules));
  }, [schedules]);

  const toggleWishlist = (propertyId) => {
    setWishlist(prev => 
      prev.includes(propertyId) 
        ? prev.filter(id => id !== propertyId) 
        : [...prev, propertyId]
    );
  };

  const addSchedule = (propertyId, datetime) => {
    setSchedules(prev => {
      // Remove any existing schedule for this property
      const filtered = prev.filter(s => s.propertyId !== propertyId);
      return [...filtered, { propertyId, datetime }];
    });
  };

  const removeSchedule = (propertyId) => {
    setSchedules(prev => prev.filter(s => s.propertyId !== propertyId));
  }

  return (
    <UserContext.Provider value={{ wishlist, toggleWishlist, schedules, addSchedule, removeSchedule }}>
      {children}
    </UserContext.Provider>
  );
};
