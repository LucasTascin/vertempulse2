import React, { useState, useEffect } from 'react';
import { DashboardData, ProjectData, TimeRange } from './types';
import { PulseDashboard } from './components/PulseDashboard';
import { PulseChat } from './components/PulseChat';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { Activity } from 'lucide-react';
import { getDashboardData } from './data/demoData';
import { AnimatePresence } from 'motion/react';
import { ThemeToggle } from './components/ThemeToggle';

const App: React.FC = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>('30d');
  const [data, setData] = useState<DashboardData>(getDashboardData('30d'));
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

  useEffect(() => {
    setData(getDashboardData(timeRange));
  }, [timeRange]);

  return (
    <div className="min-h-screen font-sans selection:bg-vertem-primary selection:text-black pb-10 relative text-gray-900 dark:text-vertem-text bg-vertem-light dark:bg-[#050505] transition-colors duration-300">
      
      {/* --- Awwwards Noise & Grain --- */}
      <div className="bg-noise"></div>

      {/* Navbar Fixed with Blur */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-md border-b border-gray-200 dark:border-white/5 px-6 py-4 md:px-12 transition-all">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer group">
            {/* Logo Vertem Pulse */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter text-gray-900 dark:text-white">
                vertem
                <span className="text-vertem-primary">PULSE</span>
              </span>
              <Activity className="text-vertem-primary w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 pt-24 md:pt-28">
        <PulseDashboard 
          data={data} 
          onProjectSelect={setSelectedProject} 
          timeRange={timeRange}
          onRangeChange={setTimeRange}
        />
        <PulseChat dashboardData={data} />
      </main>

      {/* Modal rendered outside main to avoid z-index trapping */}
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

export default App;
