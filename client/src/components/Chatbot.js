import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Loader, Bot, User } from 'lucide-react';
import { useChatContext } from '../contexts/ChatContext';
import { apiService } from '../utils/api';
import './Chatbot.css';

const Chatbot = () => {
  const {
    isChatOpen: isOpen,
    messages,
    setMessages,
    toggleChat
  } = useChatContext();
  
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Only clear form data when user interacts with chatbot again
  // Remove automatic clearing on navigation to preserve form data across pages

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: input.trim(),
      from: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = input.trim();
    setInput('');
    setIsLoading(true);
    setIsTyping(true);
    
    // Clear any existing form data when user types a new query
    console.log('🧹 Chatbot: User typed new query, clearing any existing form data');
    window.dispatchEvent(new CustomEvent('clearForm', {
      detail: { reason: 'new_query', query: userQuery }
    }));

    try {
      // Call the new /api/match endpoint
      const response = await fetch('http://localhost:5001/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userQuery })
      });

      const data = await response.json();
      
      setTimeout(() => {
        // Handle form filling requests
        if (data.specialAction === 'fill_form') {
          const botMessage = {
            id: Date.now() + 1,
            text: `Perfect! I've extracted your form data. Let me find a contact form and fill it out for you! 📝`,
            from: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          setIsLoading(false);
          
          // Broadcast form data to all components
          window.dispatchEvent(new CustomEvent('fillForm', {
            detail: data.formData
          }));
          
          // Add confirmation message
          setTimeout(() => {
            const confirmMessage = {
              id: Date.now() + 2,
              text: `Form data ready! I'll scroll to the contact form and fill it out for you. 🎉`,
              from: 'bot',
              timestamp: new Date()
            };
            setMessages(prev => [...prev, confirmMessage]);
          }, 1500);
          
          return;
        }
        
        // Handle internal service match (auto-navigation)
        if (data.internal?.match && data.internal?.route) {
          const isHomePage = data.internal.route === '/';
          const botMessage = {
            id: Date.now() + 1,
            text: isHomePage 
              ? `Taking you back to the home page! 🏠`
              : `Perfect! I found ${data.internal.match} for you. Navigating there now... ✨`,
            from: 'bot',
            timestamp: new Date(),
            service: data.internal.match
          };
          
          setMessages(prev => [...prev, botMessage]);
          setIsTyping(false);
          setIsLoading(false);
          
          // Auto-navigate to the matched service
          setTimeout(() => {
            navigate(data.internal.route);
            
            // If it's a service page and askForm is true, ask about form
            if (!isHomePage && data.askForm) {
              setTimeout(() => {
                const formMessage = {
                  id: Date.now() + 2,
                  text: `Would you like to fill out a contact form for ${data.internal.match}? I can take you to the contact section! 📋`,
                  from: 'bot',
                  timestamp: new Date(),
                  showFormButtons: true,
                  servicePage: data.internal.route
                };
                setMessages(prev => [...prev, formMessage]);
                // Keep chatbot open for form question
              }, 3000);
            }
            // Keep chatbot open after all navigations
          }, 1500);
        } else {
          // No internal match - show external references
          const botMessage = {
            id: Date.now() + 1,
            text: "I couldn't find a specific service for that, but here are some external references that might help:",
            from: 'bot',
            timestamp: new Date()
          };
          
          setMessages(prev => [...prev, botMessage]);
          
          // Add external links as separate messages
          if (data.external && data.external.length > 0) {
            data.external.forEach((link, index) => {
              setTimeout(() => {
                const linkMessage = {
                  id: Date.now() + index + 2,
                  text: link,
                  from: 'bot',
                  timestamp: new Date(),
                  isLink: true
                };
                setMessages(prev => [...prev, linkMessage]);
              }, (index + 1) * 500);
            });
          }
          
          setIsTyping(false);
          setIsLoading(false);
        }
      }, 1000 + Math.random() * 1000);

    } catch (error) {
      console.error('Chat error:', error);
      
      setTimeout(() => {
        const errorMessage = {
          id: Date.now() + 1,
          text: "Sorry, I'm having trouble connecting right now. Please try again in a moment! 🔄",
          from: 'bot',
          timestamp: new Date(),
          isError: true
        };
        
        setMessages(prev => [...prev, errorMessage]);
        setIsTyping(false);
        setIsLoading(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };


  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleFormNavigation = (servicePage, shouldNavigate) => {
    if (shouldNavigate) {
      // Scroll to contact section
      setTimeout(() => {
        const contactSection = document.querySelector('.contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
      
      const confirmMessage = {
        id: Date.now(),
        text: "Great! I've scrolled you to the contact form section. Feel free to fill it out! 😊 Is there anything else I can help you with?",
        from: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, confirmMessage]);
    } else {
      const declineMessage = {
        id: Date.now(),
        text: "No problem! Is there anything else I can help you with? 😄",
        from: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, declineMessage]);
    }
    
    // Keep chatbot open for further assistance
  };

  const getMessageIcon = (message) => {
    if (message.from === 'user') {
      return <User size={16} />;
    }
    return <Bot size={16} />;
  };

  return (
    <>
      <button
        className={`chat-button ${isOpen ? 'open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
        <span className="chat-button-pulse"></span>
      </button>

      {isOpen && (
        <div className="chatbot-window scale-in">
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              <Bot size={20} />
            </div>
            <div className="chatbot-info">
              <h3>Service Assistant</h3>
              <p className="status">Online • Ready to help</p>
            </div>
            <button 
              className="close-button"
              onClick={toggleChat}
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.from} ${message.isError ? 'error' : ''} slide-up`}
              >
                <div className="message-avatar">
                  {getMessageIcon(message)}
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    {message.isLink ? (
                      <a 
                        href={message.text} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="external-link"
                      >
                        {message.text}
                      </a>
                    ) : (
                      message.text
                    )}
                    {message.service && (
                      <div className="message-meta">
                        <span className="service-tag">
                          {message.service}{message.section && ` → ${message.section}`}
                        </span>
                      </div>
                    )}
                    {message.showFormButtons && (
                      <div className="form-buttons">
                        <button 
                          className="form-btn yes-btn"
                          onClick={() => handleFormNavigation(message.servicePage, true)}
                        >
                          Yes, take me to the form! 📋
                        </button>
                        <button 
                          className="form-btn no-btn"
                          onClick={() => handleFormNavigation(message.servicePage, false)}
                        >
                          No, thanks 😊
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="message-time">
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="message bot typing-indicator slide-up">
                <div className="message-avatar">
                  <Bot size={16} />
                </div>
                <div className="message-content">
                  <div className="message-bubble">
                    <div className="typing-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            <div className="input-container">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about our services..."
                rows={1}
                disabled={isLoading}
                className="message-input"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="send-button"
                aria-label="Send message"
              >
                {isLoading ? (
                  <Loader size={16} className="loading-spinner" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </div>
            <div className="input-footer">
              <p>Press Enter to send • Shift + Enter for new line</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
