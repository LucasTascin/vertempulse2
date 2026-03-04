import React, { useState } from 'react';
import { DashboardData, ProjectData } from '../types';
import { ProjectCard } from './ProjectCard';
import { ProjectDetailModal } from './ProjectDetailModal';
import { Activity, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';

interface PulseDashboardProps {
  data: DashboardData;
}

export const PulseDashboard: React.FC<PulseDashboardProps> = ({ data }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* Dashboard Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1A1D21] border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-500/10 text-blue-400">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono uppercase">Total de Projetos</p>
            <p className="text-2xl font-bold text-white">{data.totalProjects}</p>
          </div>
        </div>

        <div className="bg-[#1A1D21] border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-red-500/10 text-red-400">
            <AlertOctagon size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono uppercase">Eventos Críticos</p>
            <p className="text-2xl font-bold text-white">{data.criticalEvents}</p>
          </div>
        </div>

        <div className="bg-[#1A1D21] border border-white/10 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-vertem-green/10 text-vertem-green">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-mono uppercase">Status Global</p>
            <p className="text-2xl font-bold text-white uppercase">{data.globalStatus}</p>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProject && (
          <ProjectDetailModal 
            project={selectedProject} 
            onClose={() => setSelectedProject(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};
