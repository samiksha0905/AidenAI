import React, { createContext, useContext, useState, useEffect } from 'react';

const ChatContext = createContext();

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 👋 I'm your personal service assistant. I can help you find the right service or navigate to specific sections. Just ask me something like 'I need a plumber' or 'help with math tutoring'!",
      from: 'bot',
      timestamp: new Date()
    }
  ]);

  const toggleChat = () => {
    const newIsOpen = !isChatOpen;
    setIsChatOpen(newIsOpen);
    
    // Prevent background scrolling when chatbot is open
    if (newIsOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  };

  const addMessage = (message) => {
    setMessages(prev => [...prev, message]);
  };

  const addMessages = (newMessages) => {
    setMessages(prev => [...prev, ...newMessages]);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const value = {
    isChatOpen,
    setIsChatOpen,
    messages,
    setMessages,
    toggleChat,
    addMessage,
    addMessages
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
