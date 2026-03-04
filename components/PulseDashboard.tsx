import React from 'react';
import { DashboardData, ProjectData, TimeRange } from '../types';
import { ProjectCard } from './ProjectCard';
import { Activity, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { TimeRangeSelector } from './TimeRangeSelector';

interface PulseDashboardProps {
  data: DashboardData;
  onProjectSelect: (project: ProjectData) => void;
  timeRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export const PulseDashboard: React.FC<PulseDashboardProps> = ({ data, onProjectSelect, timeRange, onRangeChange }) => {
  return (
    <div className="w-full animate-fade-in pb-20">
      
      {/* Dashboard Header Stats */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
          <div className="bg-white dark:bg-[#1A1D21] border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none transition-colors">
            <div className="p-3 rounded-lg bg-blue-500/10 text-vertem-secondary">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Total de Projetos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.totalProjects}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1D21] border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none transition-colors">
            <div className="p-3 rounded-lg bg-red-500/10 text-vertem-accent">
              <AlertOctagon size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Eventos Críticos</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.criticalEvents}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1A1D21] border border-gray-200 dark:border-white/10 rounded-xl p-4 flex items-center gap-4 shadow-sm dark:shadow-none transition-colors">
            <div className="p-3 rounded-lg bg-vertem-primary/10 text-vertem-primary">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono uppercase">Status Global</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white uppercase">{data.globalStatus}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-start justify-end">
          <TimeRangeSelector 
            selectedRange={timeRange} 
            onRangeChange={onRangeChange} 
          />
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.projects.map((project, index) => (
          <ProjectCard 
            key={project.id} 
            project={project} 
            index={index} 
            onClick={() => onProjectSelect(project)}
          />
        ))}
      </div>
    </div>
  );
};
