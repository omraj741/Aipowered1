import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, X, Minimize2, Maximize2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BoltMessage } from '../../types';
import { slideUp, typingAnimation } from '../../utils/animations';
import { getMockBoltConversation } from '../../utils/mockData';
import Button from '../ui/Button';

const CommandPanel: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<BoltMessage[]>(getMockBoltConversation());
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handlePanelInteraction = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!handlePanelInteraction()) return;
    
    if (!input.trim()) return;
    
    const newMessage: BoltMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: BoltMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I\'ve analyzed your test results and found that 3 tests are failing due to UI changes. Would you like me to attempt to automatically fix these tests?',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const togglePanel = () => {
    if (!handlePanelInteraction()) return;
    
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsMinimized(false);
    }
  };

  const toggleMinimize = () => {
    if (!handlePanelInteraction()) return;
    
    setIsMinimized(!isMinimized);
  };

  return (
    <div className="fixed bottom-4 right-4 z-20 interactive">
      {/* Floating button when closed */}
      {!isOpen && (
        <motion.button
          className="flex items-center justify-center w-14 h-14 rounded-full bg-primary-500 text-white shadow-lg hover:bg-primary-600 transition-colors duration-200"
          onClick={togglePanel}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Bot size={24} />
        </motion.button>
      )}
      
      {/* Chat panel when open */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden"
            style={{ 
              width: '380px', 
              height: isMinimized ? '60px' : '500px'
            }}
            initial={{ opacity: 0, y: 20, height: '60px' }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              height: isMinimized ? '60px' : '500px',
              transition: { duration: 0.3 }
            }}
            exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <Bot className="h-5 w-5 text-primary-500 mr-2" />
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white">Bolt AI Assistant</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMinimize} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  onClick={togglePanel} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            <AnimatePresence>
              {!isMinimized && (
                <motion.div
                  className="flex-1 flex flex-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-4">
                    {messages.map((msg) => (
                      <div 
                        key={msg.id} 
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`max-w-[85%] px-4 py-2 rounded-lg ${
                            msg.role === 'user'
                              ? 'bg-primary-500 text-white ml-4'
                              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white mr-4'
                          }`}
                        >
                          <p className="text-sm">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1 text-right">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </motion.div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <motion.div 
                          className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg max-w-[85%] mr-4"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex space-x-1 items-center">
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-150"></div>
                            <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse delay-300"></div>
                          </div>
                        </motion.div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                  
                  {/* Input area */}
                  <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center rounded-lg bg-gray-100 dark:bg-gray-700 px-3 py-2">
                      <input
                        type="text"
                        className="flex-1 bg-transparent border-0 focus:ring-0 text-gray-700 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                        placeholder="Ask Bolt AI..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onFocus={handlePanelInteraction}
                      />
                      <Button 
                        type="submit" 
                        variant="ghost" 
                        size="sm"
                        className="ml-2 text-primary-500 hover:text-primary-600"
                        disabled={!input.trim()}
                      >
                        <Send size={18} />
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CommandPanel;