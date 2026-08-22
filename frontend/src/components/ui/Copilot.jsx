import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Copilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', content: "Hi! I'm your DayFlow Copilot. How can I help you today?" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'bot', 
        content: `I'm a demo AI. In a production environment, I would analyze your request regarding "${userMessage.content}" using real HR data and provide actionable insights.`
      }]);
    }, 1000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 rounded-full bg-black text-[#D7FF00] shadow-lg flex items-center justify-center hover:scale-105 transition-transform z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Bot size={28} />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-white/90 backdrop-blur-xl border border-df-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 bg-black text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D7FF00] flex items-center justify-center text-black">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">DayFlow Copilot</h3>
                  <p className="text-[10px] text-gray-400">AI HR Assistant</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-6 h-6 rounded-full bg-black shrink-0 flex items-center justify-center text-[#D7FF00]">
                      <Bot size={14} />
                    </div>
                  )}
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.role === 'user' 
                        ? 'bg-black text-white rounded-br-none' 
                        : 'bg-[#F7F6F2] text-[#111111] border border-df-border rounded-bl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-df-border">
              <form onSubmit={handleSend} className="relative flex items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything..."
                  className="w-full bg-[#F7F6F2] border border-df-border rounded-full pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-black transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="absolute right-2 w-8 h-8 rounded-full bg-[#D7FF00] text-black flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Copilot;
