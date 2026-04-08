import React, { createContext, useContext, useState } from 'react';

const UiContext = createContext();

export const useUi = () => useContext(UiContext);

export const UiProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(prev => !prev);

  return (
    <UiContext.Provider value={{ isChatOpen, setIsChatOpen, toggleChat }}>
      {children}
    </UiContext.Provider>
  );
};
