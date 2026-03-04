import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, User, Activity, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus, LayoutDashboard, Users, Heart, ShoppingBag, Gift, Smile, DollarSign } from 'lucide-react';
import { ProjectData, PulsePillar, MetricDetail, TimeRange } from '../types';
import { Sparkline } from './Sparkline';
import { GoogleGenAI } from "@google/genai";
import { clsx } from 'clsx';
import { TimeRangeSelector } from './TimeRangeSelector';
import { getProjectDetail } from '../data/demoData';

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
  <div className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-xl p-4 flex flex-col gap-3 h-full">
    <div className="flex justify-between items-center">
      <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
        {label}
      </h4>
      <span className={clsx(
        "text-xs font-mono px-2 py-0.5 rounded border",
        pillar.status === 'critical' ? "bg-red-500/10 border-red-500/20 text-vertem-accent" :
        pillar.status === 'warning' ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" :
        "bg-vertem-primary/10 border-vertem-primary/20 text-vertem-primary"
      )}>
        {pillar.score}/100
      </span>
    </div>
    
    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed min-h-[40px]">{pillar.summary}</p>
    
    <div className="space-y-3 mt-auto">
      {pillar.metrics.map((metric, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <div className="flex justify-between text-[10px] uppercase text-gray-500 font-mono">
            <span>{metric.label}</span>
            <span className="flex items-center gap-1">
              {metric.value}{metric.unit}
              {metric.trend === 'up' && <TrendingUp size={10} className="text-vertem-primary" />}
              {metric.trend === 'down' && <TrendingDown size={10} className="text-vertem-accent" />}
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

const MetricCard: React.FC<{ label: string; metric: MetricDetail }> = ({ label, metric }) => (
  <div className="flex flex-col gap-2 p-4 bg-white dark:bg-[#1A1D21] rounded-xl border border-gray-200 dark:border-white/5 hover:border-vertem-primary/20 dark:hover:border-white/10 transition-colors shadow-sm dark:shadow-none">
    <div className="flex justify-between items-start">
      <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-mono tracking-wider">{label}</span>
      <span className="flex items-center gap-1">
        {metric.trend === 'up' && <TrendingUp size={12} className="text-vertem-primary" />}
        {metric.trend === 'down' && <TrendingDown size={12} className="text-vertem-accent" />}
        {metric.trend === 'stable' && <Minus size={12} className="text-gray-500" />}
      </span>
    </div>
    <div className="flex items-end justify-between gap-4">
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-gray-900 dark:text-white font-mono">
          {typeof metric.value === 'number' ? metric.value.toLocaleString('pt-BR') : metric.value}
        </span>
        <span className="text-xs text-gray-500">{metric.unit}</span>
      </div>
      <div className="w-20 h-8 opacity-60">
        {metric.history && <Sparkline data={metric.history} color={metric.trend === 'down' ? '#ff736a' : '#01d9b0'} height={32} />}
      </div>
    </div>
  </div>
);

type TabType = 'overview' | 'engagement' | 'retention' | 'behavior' | 'rewards' | 'experience' | 'financial';

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, onClose }) => {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [displayProject, setDisplayProject] = useState<ProjectData>(project);
  
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: `Olá. Estou analisando os dados do projeto ${project.name}. O que gostaria de saber sobre os indicadores?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDisplayProject(getProjectDetail(project, timeRange));
  }, [timeRange, project]);

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
        ${JSON.stringify(displayProject)}
        
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

  const tabs = [
    { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'engagement', label: 'Engajamento', icon: Users },
    { id: 'retention', label: 'Retenção', icon: Heart },
    { id: 'behavior', label: 'Comportamento', icon: ShoppingBag },
    { id: 'rewards', label: 'Recompensas', icon: Gift },
    { id: 'experience', label: 'Experiência', icon: Smile },
    { id: 'financial', label: 'Financeiro', icon: DollarSign },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-[#0f1115] w-full max-w-[1400px] h-[90vh] rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT PANEL: PROJECT DETAILS */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200 dark:border-white/5">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0f1115]">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{displayProject.name}</h2>
                  <span className="px-2 py-0.5 rounded bg-gray-200 dark:bg-white/10 text-xs font-mono text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-white/5">
                    TIER {displayProject.tier}
                  </span>
                  <span className={clsx(
                    "text-xs font-mono px-2 py-0.5 rounded border uppercase",
                    displayProject.programType === 'incentive' 
                      ? "bg-purple-500/10 text-purple-500 dark:text-purple-400 border-purple-500/20" 
                      : "bg-blue-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20"
                  )}>
                    {displayProject.programType}
                  </span>
                </div>
                <p className="text-sm text-gray-500 font-mono">Expira em: {displayProject.expirationDate}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <TimeRangeSelector 
                  selectedRange={timeRange} 
                  onRangeChange={setTimeRange} 
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={clsx(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
                      isActive 
                        ? "bg-vertem-primary text-white shadow-lg shadow-vertem-primary/20" 
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5"
                    )}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-gray-50/50 dark:bg-[#0f1115]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="min-h-full pb-10"
              >
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                        <p className="text-xs text-gray-500 font-mono uppercase mb-1">Saldo de Pontos</p>
                        <p className="text-2xl font-mono text-vertem-secondary">{displayProject.pointsBalance.toLocaleString()}</p>
                      </div>
                      <div className="bg-white dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm dark:shadow-none">
                        <p className="text-xs text-gray-500 font-mono uppercase mb-1">Engajamento</p>
                        <p className={clsx("text-2xl font-mono", displayProject.engagementRate > 80 ? "text-vertem-primary" : "text-yellow-500")}>
                          {displayProject.engagementRate}%
                        </p>
                      </div>
                    </div>

                    {/* Pillars Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <PillarDetail pillar={displayProject.pillars.client} label="Visão Cliente" color="#009dfe" />
                      <PillarDetail pillar={displayProject.pillars.team} label="Visão Equipe" color="#01d9b0" />
                      <PillarDetail pillar={displayProject.pillars.participant} label="Visão Usuário" color="#a78bfa" />
                      <PillarDetail pillar={displayProject.pillars.ai} label="Visão IA" color="#facc15" />
                    </div>

                    {/* Alerts & Action Plan */}
                    <div className="space-y-4">
                      {displayProject.alerts.length > 0 && (
                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                          <h4 className="text-sm font-bold text-vertem-accent uppercase tracking-wider mb-3 flex items-center gap-2">
                            <AlertTriangle size={16} /> Alertas Críticos
                          </h4>
                          <ul className="space-y-2">
                            {displayProject.alerts.map((alert, idx) => (
                              <li key={idx} className="text-sm text-red-400 flex items-start gap-2">
                                <span className="mt-1.5 w-1 h-1 rounded-full bg-red-400" />
                                {alert}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="bg-vertem-primary/5 border border-vertem-primary/20 rounded-xl p-4">
                        <h4 className="text-sm font-bold text-vertem-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                          <CheckCircle size={16} /> Plano de Ação Recomendado
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                          {displayProject.actionPlan}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'engagement' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard label="Taxa de Adesão" metric={displayProject.extendedMetrics.engagement.adoptionRate} />
                    <MetricCard label="Taxa de Ativação" metric={displayProject.extendedMetrics.engagement.activationRate} />
                    <MetricCard label="MAU (Monthly Active Users)" metric={displayProject.extendedMetrics.engagement.mau} />
                    <MetricCard label="DAU (Daily Active Users)" metric={displayProject.extendedMetrics.engagement.dau} />
                    <MetricCard label="Frequência de Uso" metric={displayProject.extendedMetrics.engagement.frequency} />
                    <MetricCard label="Participação em Campanhas" metric={displayProject.extendedMetrics.engagement.campaignParticipation} />
                  </div>
                )}

                {activeTab === 'retention' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard label="Taxa de Retenção" metric={displayProject.extendedMetrics.retention.retentionRate} />
                    <MetricCard label="Churn Rate" metric={displayProject.extendedMetrics.retention.churnRate} />
                    <MetricCard label="Tempo Médio (Meses)" metric={displayProject.extendedMetrics.retention.avgTimeInProgram} />
                    <MetricCard label="Taxa de Reativação" metric={displayProject.extendedMetrics.retention.reactivationRate} />
                  </div>
                )}

                {activeTab === 'behavior' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard label="Ticket Médio" metric={displayProject.extendedMetrics.behavior.avgTicket} />
                    <MetricCard label="Frequência de Compra" metric={displayProject.extendedMetrics.behavior.purchaseFrequency} />
                    <MetricCard label="Vendas Incrementais" metric={displayProject.extendedMetrics.behavior.incrementalSales} />
                    <MetricCard label="Share of Wallet" metric={displayProject.extendedMetrics.behavior.shareOfWallet} />
                    <MetricCard label="Cross-sell / Upsell" metric={displayProject.extendedMetrics.behavior.crossSellUpsell} />
                  </div>
                )}

                {activeTab === 'rewards' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard label="Earn Rate" metric={displayProject.extendedMetrics.rewards.earnRate} />
                    <MetricCard label="Burn Rate" metric={displayProject.extendedMetrics.rewards.burnRate} />
                    <MetricCard label="Breakage" metric={displayProject.extendedMetrics.rewards.breakage} />
                    <MetricCard label="Tempo até Resgate" metric={displayProject.extendedMetrics.rewards.avgRedemptionTime} />
                    <MetricCard label="Valor Percebido" metric={displayProject.extendedMetrics.rewards.perceivedValue} />
                  </div>
                )}

                {activeTab === 'experience' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard label="NPS" metric={displayProject.extendedMetrics.experience.nps} />
                    <MetricCard label="CSAT" metric={displayProject.extendedMetrics.experience.csat} />
                    <MetricCard label="CES (Customer Effort)" metric={displayProject.extendedMetrics.experience.ces} />
                  </div>
                )}

                {activeTab === 'financial' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <MetricCard label="ROI do Programa" metric={displayProject.extendedMetrics.financial.roi} />
                    <MetricCard label="Custo por Participante" metric={displayProject.extendedMetrics.financial.costPerParticipant} />
                    <MetricCard label="Custo por Engajamento" metric={displayProject.extendedMetrics.financial.costPerEngagement} />
                    <MetricCard label="LTV (Lifetime Value)" metric={displayProject.extendedMetrics.financial.ltv} />
                    <MetricCard label="CAC Payback" metric={displayProject.extendedMetrics.financial.cacPayback} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT PANEL: CONTEXTUAL CHAT */}
        <div className="w-full md:w-[350px] lg:w-[400px] bg-white dark:bg-[#0a0c10] flex flex-col border-l border-gray-200 dark:border-white/5">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 dark:border-white/5 flex justify-between items-center bg-gray-50 dark:bg-[#0a0c10]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-vertem-primary/20 flex items-center justify-center text-vertem-primary">
                <Bot size={18} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">Pulse AI</h3>
                <p className="text-[10px] text-gray-500">Contexto: {displayProject.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-white/10 rounded-full transition-colors hidden md:block">
              <X size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-white dark:bg-[#0a0c10]">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                  msg.role === 'user' ? 'bg-blue-500/20 text-blue-500 dark:text-blue-400' : 'bg-vertem-primary/20 text-vertem-primary'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                  msg.role === 'user' 
                    ? 'bg-blue-600/10 dark:bg-blue-600/20 text-blue-900 dark:text-blue-100 rounded-tr-none' 
                    : 'bg-gray-100 dark:bg-white/5 text-gray-800 dark:text-gray-300 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                 <div className="w-8 h-8 rounded-full bg-vertem-primary/20 flex items-center justify-center text-vertem-primary">
                  <Bot size={14} />
                </div>
                <div className="bg-gray-100 dark:bg-white/5 p-3 rounded-2xl rounded-tl-none">
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
          <div className="p-4 border-t border-gray-200 dark:border-white/5 bg-gray-50 dark:bg-[#0a0c10]">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`Pergunte sobre ${displayProject.name}...`}
                autoFocus
                className="flex-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:border-vertem-primary/50 placeholder-gray-500 dark:placeholder-gray-600"
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="p-3 bg-vertem-primary rounded-xl text-white hover:bg-vertem-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
