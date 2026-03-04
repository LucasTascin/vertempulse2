import React from 'react';
import { ProjectData, PulsePillar } from '../types';
import { Sparkline } from './Sparkline';
import { motion } from 'motion/react';
import { AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import { clsx } from 'clsx';

interface ProjectCardProps {
  project: ProjectData;
  index: number;
  onClick: () => void;
}

const PillarMetric: React.FC<{ 
  pillar: PulsePillar; 
  label: string; 
  color: string; 
}> = ({ pillar, label, color }) => {
  // Get the main metric history for sparkline (assuming first metric has history)
  const history = pillar.metrics[0]?.history || [0,0,0,0,0];
  
  return (
    <div className="flex flex-col gap-1 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
      <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-gray-400 font-mono">
        <span>{label}</span>
        <span className={clsx(
          "w-2 h-2 rounded-full",
          pillar.status === 'critical' ? 'bg-red-500 animate-pulse' :
          pillar.status === 'warning' ? 'bg-yellow-500' : 'bg-vertem-green'
        )} />
      </div>
      <div className="h-8">
        <Sparkline data={history} color={color} height={32} />
      </div>
    </div>
  );
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, onClick }) => {
  const isCritical = project.pillars.client.status === 'critical' || project.pillars.ai.status === 'critical';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={onClick}
      className={clsx(
        "relative bg-[#1A1D21] rounded-xl border p-5 flex flex-col gap-4 overflow-hidden group cursor-pointer transition-all hover:scale-[1.02]",
        isCritical ? "border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-white/10 hover:border-vertem-green/30"
      )}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg font-bold text-white">
            {project.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-medium text-lg leading-tight">{project.name}</h3>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-gray-400 border border-white/5 whitespace-nowrap flex-shrink-0">
                TIER {project.tier}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500 font-mono">Expira em {project.expirationDate}</p>
              {isCritical && (
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-mono uppercase animate-pulse whitespace-nowrap">
                  <AlertTriangle size={10} />
                  Crítico
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-2 gap-4 py-2 border-y border-white/5">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono mb-1">Saldo de Pontos</p>
          <p className="text-xl font-mono text-vertem-blue">{project.pointsBalance.toLocaleString()}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono mb-1">Engajamento</p>
          <p className={clsx("text-xl font-mono", project.engagementRate > 80 ? "text-vertem-green" : "text-yellow-500")}>
            {project.engagementRate}%
          </p>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-4 gap-2">
        <PillarMetric pillar={project.pillars.client} label="Cliente" color="#22d3ee" /> {/* Cyan */}
        <PillarMetric pillar={project.pillars.team} label="Equipe" color="#34d399" />   {/* Emerald */}
        <PillarMetric pillar={project.pillars.participant} label="Usuário" color="#a78bfa" /> {/* Purple */}
        <PillarMetric pillar={project.pillars.ai} label="IA" color="#facc15" />       {/* Yellow */}
      </div>

      {/* Action Plan / Footer */}
      <div className="mt-auto pt-2">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="font-mono uppercase text-[10px]">Último Status</span>
          <span className="flex items-center gap-1.5 text-vertem-green">
            <CheckCircle size={12} />
            {project.actionPlan || "Plano de ação concluído."}
          </span>
        </div>
      </div>
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-vertem-green/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};
