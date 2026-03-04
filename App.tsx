import React, { useState } from 'react';
import { DashboardData } from './types';
import { PulseDashboard } from './components/PulseDashboard';
import { PulseChat } from './components/PulseChat';
import { Activity } from 'lucide-react';
import { ENTERPRISE_DEMO_DATA } from './data/demoData';

const App: React.FC = () => {
  const [data] = useState<DashboardData>(ENTERPRISE_DEMO_DATA);

  return (
    <div className="min-h-screen font-sans selection:bg-vertem-green selection:text-black pb-10 relative text-vertem-text bg-[#050505]">
      
      {/* --- Awwwards Noise & Grain --- */}
      <div className="bg-noise"></div>

      {/* Navbar Fixed with Blur */}
      <nav className="fixed top-0 w-full z-50 bg-[#050505]/80 backdrop-blur-md border-b border-white/5 px-6 py-4 md:px-12 transition-all">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3 md:gap-4 cursor-pointer group">
            {/* Logo Vertem Pulse */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter text-white">
                vertem
                <span className="text-vertem-green">PULSE</span>
              </span>
              <Activity className="text-vertem-green w-6 h-6" />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {/* Header actions removed as per request to remove input screen */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 w-full max-w-[1920px] mx-auto px-4 md:px-12 pt-24 md:pt-28">
        <PulseDashboard data={data} />
        <PulseChat dashboardData={data} />
      </main>
    </div>
  );
};

export default App;
