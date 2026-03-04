import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { ProjectData, PulsePillar } from '../types';
import { Sparkline } from './Sparkline';
import { GoogleGenAI } from "@google/genai";
import { clsx } from 'clsx';

interface ProjectDetailModalProps {
  project: ProjectData;
  onClose: () => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const PillarDetail: React.FC<{ pillar: PulsePillar; label: string; color: string }> = ({ pillar, label, color }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col gap-3">
    <div className="flex justify-between items-center">
      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </h4>
      <span className={clsx(
        "text-xs font-mono px-2 py-0.5 rounded border",
        pillar.status === 'critical' ? "bg-red-500/10 border-red-500/20 text-red-400" :
        pillar.status === 'warning' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
        "bg-vertem-green/10 border-vertem-green/20 text-vertem-green"
      )}>
        {pillar.score}/100
      </span>
    </div>
    
    <p className="text-xs text-gray-400 leading-relaxed">{pillar.summary}</p>
    
    <div className="space-y-3 mt-2">
      {pillar.metrics.map((metric, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] uppercase text-gray-500 font-mono">
            <span>{metric.label}</span>
            <span className="flex items-center gap-1">
              {metric.value}{metric.unit}
              {metric.trend === 'up' && <TrendingUp size={10} className="text-vertem-green" />}
              {metric.trend === 'down' && <TrendingDown size={10} className="text-red-400" />}
              {metric.trend === 'stable' && <Minus size={10} className="text-gray-500" />}
            </span>
          </div>
          <div className="h-6 w-full opacity-70">
            <Sparkline data={metric.history} color={color} height={24} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: `Olá. Estou analisando os dados do projeto ${project.name}. O que gostaria de saber sobre os 4 pilares?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        CONTEXTO DO PROJETO ESPECÍFICO:
        ${JSON.stringify(project)}
        
        USUÁRIO PERGUNTOU: "${input}"
        
        Responda como um estrategista focado neste projeto. Seja breve e direto.
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
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', text: "Erro ao processar resposta." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-[#0f1115] w-full max-w-6xl h-[85vh] mt-10 rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
      >
        {/* LEFT PANEL: PROJECT DETAILS */}
        <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar border-r border-white/5">
          
          {/* Header */}
          <div className="p-6 border-b border-white/5 sticky top-0 bg-[#0f1115]/95 backdrop-blur z-10 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-white">{project.name}</h2>
                <span className="px-2 py-0.5 rounded bg-white/10 text-xs font-mono text-gray-400 border border-white/5">
                  TIER {project.tier}
                </span>
              </div>
              <p className="text-sm text-gray-500 font-mono">Expira em: {project.expirationDate}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* KPI Cards */}
          <div className="p-6 grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 font-mono uppercase mb-1">Saldo de Pontos</p>
              <p className="text-2xl font-mono text-vertem-blue">{project.pointsBalance.toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <p className="text-xs text-gray-500 font-mono uppercase mb-1">Engajamento</p>
              <p className={clsx("text-2xl font-mono", project.engagementRate > 80 ? "text-vertem-green" : "text-yellow-500")}>
                {project.engagementRate}%
              </p>
            </div>
          </div>

          {/* Pillars Grid */}
          <div className="px-6 pb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <PillarDetail pillar={project.pillars.client} label="Visão Cliente" color="#22d3ee" />
            <PillarDetail pillar={project.pillars.team} label="Visão Equipe" color="#34d399" />
            <PillarDetail pillar={project.pillars.participant} label="Visão Usuário" color="#a78bfa" />
            <PillarDetail pillar={project.pillars.ai} label="Visão IA" color="#facc15" />
          </div>

          {/* Alerts & Action Plan */}
          <div className="px-6 pb-8 space-y-6">
            {project.alerts.length > 0 && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                <h4 className="text-sm font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <AlertTriangle size={16} /> Alertas Críticos
                </h4>
                <ul className="space-y-2">
                  {project.alerts.map((alert, idx) => (
                    <li key={idx} className="text-sm text-red-300 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-vertem-green/5 border border-vertem-green/20 rounded-xl p-4">
              <h4 className="text-sm font-bold text-vertem-green uppercase tracking-wider mb-2 flex items-center gap-2">
                <CheckCircle size={16} /> Plano de Ação Recomendado
              </h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                {project.actionPlan}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: CONTEXTUAL CHAT */}
        <div className="w-full md:w-[400px] bg-[#0a0c10] flex flex-col border-l border-white/5">
          {/* Chat Header */}
          <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0a0c10]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-vertem-green/20 flex items-center justify-center text-vertem-green">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Pulse AI</h3>
                <p className="text-[10px] text-gray-500">Contexto: {project.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors hidden md:block">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[#0a0c10]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-blue-500/20 text-blue-400' : 'bg-vertem-green/20 text-vertem-green'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
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

          {/* Input Area */}
          <div className="p-4 border-t border-white/5 bg-[#0a0c10]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Pergunte sobre ${project.name}...`}
                autoFocus
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-vertem-green/50 placeholder-gray-600"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-vertem-green rounded-xl text-black hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
