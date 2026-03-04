
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

const MESSAGES = [
  "Conectando aos 4 pilares...",
  "Processando sinais do Cliente...",
  "Analisando métricas da Equipe...",
  "Calculando engajamento do Participante...",
  "IA gerando previsões de risco..."
];

export const LoadingOverlay: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const duration = 4000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / duration);
      const easeOut = 1 - Math.pow(1 - t, 3);
      const currentProgress = Math.floor(easeOut * 100);
      
      setProgress(currentProgress);

      if (currentProgress > 20 && currentProgress < 40) setMessageIndex(1);
      if (currentProgress > 40 && currentProgress < 60) setMessageIndex(2);
      if (currentProgress > 60 && currentProgress < 80) setMessageIndex(3);
      if (currentProgress > 80) setMessageIndex(4);

      if (t >= 1) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center cursor-wait">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center">
        <div className="relative mb-12">
           <h1 className="text-9xl md:text-[10rem] font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 tracking-tighter leading-none font-sans">
             {progress}
           </h1>
           <span className="absolute top-4 right-[-2rem] text-2xl text-vertem-green font-mono">%</span>
        </div>

        <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-6">
           <div 
             className="absolute top-0 left-0 h-full bg-vertem-green transition-all duration-100 ease-out"
             style={{ width: `${progress}%` }}
           ></div>
        </div>

        <div className="flex flex-col items-center gap-2">
           <div className="flex items-center gap-3">
              <Loader2 className="w-3 h-3 text-vertem-green animate-spin" />
              <span className="text-xs font-mono text-vertem-green tracking-[0.2em] uppercase">
                {MESSAGES[messageIndex]}
              </span>
           </div>
           
           <div className="flex gap-8 mt-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
              <span>PULSE: ATIVO</span>
              <span>IA: CONECTADA</span>
              <span>LATÊNCIA: 12ms</span>
           </div>
        </div>
      </div>
    </div>
  );
};
