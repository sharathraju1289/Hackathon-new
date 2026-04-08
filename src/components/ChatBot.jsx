import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot } from 'lucide-react';
import { useUi } from '../context/UiContext';
import { useNavigate } from 'react-router-dom';
import { generateProperties } from '../utils/dummyData';
import styles from './ChatBot.module.css';

const ChatBot = () => {
  const { isChatOpen, toggleChat } = useUi();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messages.length === 0 && isChatOpen) {
      appendBotResponse({
        text: "Hello! Welcome to Luxe Real Estate. You can ask me to fetch specific properties like 'Show me houses in Mumbai' or 'Find me a premium PG'.",
        options: ["Buy a house", "Rentals", "Find a PG", "Properties in Mumbai"]
      });
    }
  }, [isChatOpen]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isChatOpen]);

  const appendBotResponse = (stepData) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'bot',
        text: stepData.text,
        options: stepData.options || null,
        properties: stepData.properties || null
      }]);
      setIsTyping(false);
    }, 1000 + Math.random() * 500); 
  };

  const getDynamicResponse = (text) => {
    const lowerText = text.toLowerCase();
    
    // Greetings
    if (lowerText.match(/\b(hi|hello|hey|namaste|morning|evening)\b/)) {
      return { text: "Hello there! Hope you are having a great day. Just let me know what kind of property you are looking for." };
    }
    
    // --- ADVANCED DATA FETCHING INTENT ENGINE ---
    const allProps = generateProperties(100);
    const cities = ["mumbai", "bangalore", "hyderabad", "delhi", "pune", "chennai"];
    const matchedCity = cities.find(city => lowerText.includes(city));
    
    let filteredProps = allProps;
    let typeMatched = false;
    let typeDesc = "Properties";

    if (lowerText.includes("pg") || lowerText.includes("hostel")) {
      filteredProps = filteredProps.filter(p => p.type === 'PG');
      typeMatched = true;
      typeDesc = "Premium PGs";
    } else if (lowerText.includes("buy") || lowerText.includes("sale") || lowerText.includes("buying")) {
      filteredProps = filteredProps.filter(p => p.type === 'Sale');
      typeMatched = true;
      typeDesc = "Luxury Homes for Sale";
    } else if (lowerText.includes("rent") || lowerText.includes("lease") || lowerText.includes("rentals")) {
      filteredProps = filteredProps.filter(p => p.type === 'Rent' || p.type === 'Lease');
      typeMatched = true;
      typeDesc = "Exclusive Rentals";
    }

    if (matchedCity) {
      filteredProps = filteredProps.filter(p => p.location.toLowerCase().includes(matchedCity));
      typeDesc += ` in ${matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1)}`;
    }

    if (matchedCity || typeMatched || lowerText.includes("properties") || lowerText.includes("houses") || lowerText.includes("options")) {
      const topProps = filteredProps.slice(0, 3);
      if (topProps.length > 0) {
        return { 
          text: `Absolutely! I've scanned our inventory for **${typeDesc}**. You can swipe through these highly rated options right here:`,
          properties: topProps
        };
      } else {
        return { text: `We appear to be updating our inventory for ${typeDesc}. Provide your phone number and an agent will manually send off-market options!` };
      }
    }
    // ---------------------------------------------

    // Pricing & Booking
    if (lowerText.includes("price") || lowerText.includes("cost") || lowerText.includes("budget") || lowerText.match(/\b(\d+)\b/)) {
      return { text: "We cater to luxurious high-end homes and affordable segments alike! You can use our Home filter to adjust precisely to your budget." };
    }
    if (lowerText.includes("book") || lowerText.includes("visit") || lowerText.includes("schedule")) {
      return { text: "Simply click any property card and then navigate to the bottom of its detail page to find the Interactive Calendar scheduler!" };
    }
    
    // Contact Routing
    if (lowerText === "yes" || lowerText.includes("sure")) {
      return { text: "Perfect! Please provide your 10-digit mobile number." };
    }
    if (lowerText.replace(/\D/g,'').length >= 10) {
      return { text: "Thank you! Registration complete. One of our Senior Partners will connect with you via WhatsApp seamlessly. Have a brilliant day!" };
    }

    // Fallback normal conversation
    return { 
      text: "I am a virtual Luxe Assistant. While I'm constantly learning, the fastest way to get complex questions answered is to give me your phone number so an agent can jump in!" 
    };
  };

  const handleUserSend = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'user',
      text: text.trim()
    }]);
    
    setInputVal('');

    const botReply = getDynamicResponse(text);
    appendBotResponse(botReply);
  };

  if (!isChatOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className={styles.chatbotContainer}
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50, scale: 0.95 }}
        transition={{ duration: 0.4, type: "spring", bounce: 0.3 }}
      >
        <div className={styles.chatHeader}>
          <div className={styles.botInfo}>
            <div className={styles.botAvatar}>
              <Bot size={20} color="#fff" />
            </div>
            <div>
              <h3 className={styles.botName}>Luxe Assistant</h3>
              <p className={styles.status}>Online</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={toggleChat} title="Close Chat">
            <X size={20} />
          </button>
        </div>

        <div className={styles.chatBody}>
          {messages.map((msg, idx) => (
            <motion.div 
              key={msg.id} 
              className={`${styles.messageWrapper} ${msg.sender === 'user' ? styles.msgRight : styles.msgLeft}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {msg.sender === 'bot' && <div className={styles.msgAvatar}><Bot size={14} /></div>}
              
              <div className={styles.contentGroup}>
                <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                  {msg.text}
                </div>

                {/* Horizontal Swiping Carousel inside Chat! */}
                {msg.properties && msg.sender === 'bot' && (
                  <div className={styles.propertyCarousel}>
                    {msg.properties.map(prop => (
                      <motion.div 
                        key={prop.id} 
                        className={styles.miniPropCard}
                        whileHover={{ y: -5 }}
                        onClick={() => {
                          toggleChat();
                          navigate(`/property/${prop.id}`);
                        }}
                      >
                        <img
                          src={prop.localImage || prop.image}
                          alt="Prop"
                          className={styles.miniPropImg}
                          loading="lazy"
                          decoding="async"
                          onError={(e) => {
                            if (prop.image && e.currentTarget.src !== prop.image) e.currentTarget.src = prop.image;
                          }}
                        />
                        <div className={styles.miniPropDetails}>
                          <span className={styles.propType}>{prop.type}</span>
                          <h4>{prop.title}</h4>
                          <p>{prop.price}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                {msg.options && msg.sender === 'bot' && idx === messages.length - 1 && (
                  <div className={styles.optionsContainer}>
                    {msg.options.map((opt, i) => (
                      <button key={i} className={styles.optionBtn} onClick={() => handleUserSend(opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <div className={`${styles.messageWrapper} ${styles.msgLeft}`}>
              <div className={styles.msgAvatar}><Bot size={14} /></div>
              <div className={`${styles.messageBubble} ${styles.bubbleBot} ${styles.typingIndicator}`}>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
                <span className={styles.dot}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className={styles.chatFooter}>
          <input 
            type="text" 
            placeholder="Type your message..." 
            className={styles.chatInput}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleUserSend(inputVal)}
          />
          <button className={styles.sendBtn} onClick={() => handleUserSend(inputVal)}>
            <Send size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ChatBot;
