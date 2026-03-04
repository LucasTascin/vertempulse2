import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { DashboardData } from '../types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface PulseChatProps {
  dashboardData: DashboardData;
}

export const PulseChat: React.FC<PulseChatProps> = ({ dashboardData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: 'Olá. Sou o Pulse AI. Analisei os dados dos projetos. Como posso ajudar com insights estratégicos?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key não configurada");

      const ai = new GoogleGenAI({ apiKey });
      
      const context = `
        CONTEXTO DO DASHBOARD:
        ${JSON.stringify(dashboardData)}
        
        USUÁRIO PERGUNTOU: "${input}"
        
        Responda como um analista sênior da Vertem Pulse. Seja direto, estratégico e use os dados fornecidos.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: context,
      });
      const responseText = response.text || "Sem resposta.";

      const botMsg: Message = { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "Desculpe, tive um erro ao processar sua pergunta." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 w-14 h-14 bg-vertem-green rounded-full shadow-lg flex items-center justify-center text-black hover:bg-white transition-colors z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Bot size={24} />}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[350px] md:w-[400px] h-[500px] bg-[#1A1D21] border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 bg-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-vertem-green/20 flex items-center justify-center text-vertem-green">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Pulse AI</h3>
                <p className="text-[10px] text-vertem-green flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-vertem-green animate-pulse" />
                  Online
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-vertem-green/20 text-vertem-green'
                  }`}>
                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm max-w-[80%] ${
                    msg.role === 'user' 
                      ? 'bg-blue-600/20 text-blue-100 rounded-tr-none' 
                      : 'bg-white/5 text-gray-300 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-vertem-green/20 flex items-center justify-center text-vertem-green">
                    <Bot size={14} />
                  </div>
                  <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5 bg-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pergunte sobre os dados..."
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-vertem-green/50 placeholder-gray-600"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim()}
                  className="p-2 bg-vertem-green rounded-xl text-black hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
