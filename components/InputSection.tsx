
import React, { useState, useMemo } from 'react';
import { FileSearch, CornerDownRight, UploadCloud, FileText, X, AlertCircle, Cpu, Database, PlayCircle } from 'lucide-react';
// @ts-ignore
import * as pdfjsLibProxy from 'pdfjs-dist';
// @ts-ignore
import * as mammothProxy from 'mammoth';
// @ts-ignore
import * as XLSX from 'xlsx';

const pdfjsLib = (pdfjsLibProxy as any).default || pdfjsLibProxy;
const mammoth = (mammothProxy as any).default || mammothProxy;

if (typeof window !== 'undefined' && pdfjsLib.GlobalWorkerOptions) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
}

interface InputSectionProps {
  onSubmitManual: (text: string) => void;
  onSubmitFile: (text: string) => void;
  onDemoClick?: () => void;
}

// Limite de segurança: ~3.5 milhões de caracteres (aprox 1M tokens com margem de segurança)
const MAX_CHARS = 3500000;
const TOTAL_BLOCKS = 50; // Quantidade de blocos visuais na barra

interface StagedFile {
  id: string;
  name: string;
  content: string;
  size: number;
}

export const InputSection: React.FC<InputSectionProps> = ({ onSubmitFile, onDemoClick }) => {
  const [dragActive, setDragActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stagedFiles, setStagedFiles] = useState<StagedFile[]>([]);

  // --- Derived State ---
  const currentUsage = useMemo(() => {
    return stagedFiles.reduce((acc, file) => acc + file.size, 0);
  }, [stagedFiles]);

  const usagePercentage = Math.min(100, (currentUsage / MAX_CHARS) * 100);
  const isOverLimit = currentUsage > MAX_CHARS;
  
  // Calcula quantos blocos devem estar preenchidos
  const filledBlocks = Math.ceil((usagePercentage / 100) * TOTAL_BLOCKS);

  // --- Logic Helpers ---

  const handleDragDropFile = (files: FileList) => {
      processFiles(files);
  };
  
  const handleFileClick = () => {
      document.getElementById('file-upload')?.click();
  };

  const removeFile = (id: string) => {
    setStagedFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleFinalSubmit = () => {
    if (stagedFiles.length === 0) return;
    const combinedText = stagedFiles.map(f => f.content).join('');
    onSubmitFile(combinedText);
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return fullText;
  };

  const extractTextFromExcel = async (file: File): Promise<string> => {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    let text = "";
    workbook.SheetNames.forEach((sheetName: string) => {
        const worksheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(worksheet);
        text += `\n--- Planilha: ${sheetName} ---\n${csv}`;
    });
    return text;
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    const lowerName = file.name.toLowerCase();
    
    if (file.type === 'application/pdf' || lowerName.endsWith('.pdf')) {
        return await extractTextFromPDF(file);
    } else if (lowerName.endsWith('.docx')) {
        const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        return result.value;
    } else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls')) {
        return await extractTextFromExcel(file);
    } else {
        return await file.text();
    }
  };

  const processFiles = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);
    
    const newFiles: StagedFile[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        try {
          const text = await extractTextFromFile(file);
          const header = `\n\n--- ARQUIVO: ${file.name} ---\n`;
          const content = header + text;
          
          newFiles.push({
            id: Math.random().toString(36).substring(7),
            name: file.name,
            content: content,
            size: content.length
          });
          
        } catch (err) { 
          console.error(`Erro ao ler ${file.name}`, err);
          alert(`Erro ao ler arquivo: ${file.name}`);
        }
      }
      
      setStagedFiles(prev => {
        const updated = [...prev, ...newFiles];
        return updated;
      });

    } catch (error) { 
      alert("Erro ao processar arquivos."); 
    } finally { 
      setIsProcessing(false); 
    }
  };

  // --- RENDER ---
  return (
    <div className="w-full max-w-4xl mx-auto">
      
      {/* UPLOAD AREA */}
      <div className="w-full bg-white/5 border border-white/5 p-1 mb-6 rounded-xl shadow-2xl">
        <div
          onClick={handleFileClick}
          onDragEnter={(e) => {e.preventDefault(); setDragActive(true)}} 
          onDragLeave={(e) => {e.preventDefault(); setDragActive(false)}} 
          onDragOver={(e) => {e.preventDefault(); setDragActive(true)}} 
          onDrop={(e) => {e.preventDefault(); setDragActive(false); if(e.dataTransfer.files.length) handleDragDropFile(e.dataTransfer.files)}}
          className={`
            w-full relative min-h-[220px] bg-[#0f1115] hover:bg-[#14161b] 
            transition-all duration-300 cursor-pointer overflow-hidden rounded-lg
            flex flex-col items-center justify-center text-center gap-4
            border
            ${dragActive ? 'border-vertem-green bg-vertem-green/5' : 'border-white/5 hover:border-white/10'}
          `}
        >
          <input 
            id="file-upload" 
            type="file" 
            className="hidden" 
            onChange={(e) => e.target.files && processFiles(e.target.files)} 
            accept=".pdf,.docx,.xlsx,.xls,.txt,.csv" 
            multiple 
          />
          
          <div className={`p-4 rounded-full bg-white/5 border border-white/5 ${isProcessing ? 'animate-pulse' : ''} group-hover:scale-110 transition-transform`}>
             <UploadCloud className={`w-8 h-8 ${dragActive ? 'text-vertem-green' : 'text-gray-400'}`} />
          </div>

          <div>
             <h3 className="text-xl font-light text-white mb-1 tracking-tight">
                Upload de Insumos
             </h3>
             <p className="text-xs text-gray-500 font-mono">
                Arraste relatórios, planilhas ou PDFs dos projetos
             </p>
          </div>

          {isProcessing && (
            <div className="absolute inset-0 bg-[#0f1115]/90 flex items-center justify-center z-10 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                    <FileSearch className="w-8 h-8 text-vertem-green animate-bounce" />
                    <span className="text-xs font-mono tracking-widest text-white">Processando Dados...</span>
                </div>
            </div>
          )}
        </div>
      </div>

      {/* NEW CAPACITY BAR - SEGMENTED BLOCK STYLE */}
      <div className="mb-10 px-2 animate-fade-in">
         <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2 text-gray-500">
                <Database className="w-3 h-3" />
                <span className="text-[10px] font-mono uppercase tracking-widest">LIMITE DE PROCESSAMENTO</span>
             </div>
             <span className={`text-[10px] font-mono font-bold ${isOverLimit ? 'text-red-500' : 'text-gray-600'}`}>
                {usagePercentage < 1 ? '0%' : `${usagePercentage.toFixed(1)}%`}
             </span>
         </div>

         {/* Segmented Bar Container */}
         <div className="flex gap-[2px] w-full h-2">
            {Array.from({ length: TOTAL_BLOCKS }).map((_, index) => {
               const isActive = index < filledBlocks;
               // Determina cor baseada no estágio
               let activeColor = 'bg-gray-600'; 
               let glowClass = '';
               
               if (isActive) {
                 if (isOverLimit) {
                    activeColor = 'bg-red-500';
                    glowClass = 'shadow-[0_0_8px_rgba(239,68,68,0.8)]';
                 } else if (usagePercentage > 80) {
                    activeColor = 'bg-orange-500';
                 } else {
                    activeColor = 'bg-vertem-green';
                    glowClass = 'shadow-[0_0_4px_rgba(0,230,118,0.5)]';
                 }
               }

               return (
                  <div 
                    key={index} 
                    className={`flex-1 rounded-[1px] transition-all duration-300 ${isActive ? `${activeColor} ${glowClass}` : 'bg-white/5'}`}
                  ></div>
               );
            })}
         </div>
         
         {isOverLimit && (
            <div className="mt-2 text-center">
                <span className="text-[10px] font-mono text-red-500 uppercase tracking-widest animate-pulse">
                   ⚠ Capacidade excedida. Remova arquivos para prosseguir.
                </span>
            </div>
         )}
      </div>

      {/* STAGED FILES LIST */}
      {stagedFiles.length > 0 && (
        <div className="mb-8 animate-slide-up">
           <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FileText className="w-3 h-3" /> Fila de Processamento ({stagedFiles.length})
           </h4>
           <div className="grid grid-cols-1 gap-2">
              {stagedFiles.map(file => (
                 <div key={file.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-lg group hover:border-white/10 transition-all hover:bg-white/[0.07]">
                    <div className="flex items-center gap-3 overflow-hidden">
                       <div className="w-8 h-8 rounded bg-black/20 flex items-center justify-center text-vertem-green shrink-0">
                          <FileText className="w-4 h-4" />
                       </div>
                       <div className="flex flex-col min-w-0">
                          <span className="text-sm text-gray-200 truncate pr-2">{file.name}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{(file.size / 1024).toFixed(1)} KB</span>
                       </div>
                    </div>
                    <button 
                      onClick={() => removeFile(file.id)}
                      className="p-2 hover:bg-red-500/10 hover:text-red-500 text-gray-500 rounded-full transition-colors"
                      title="Remover arquivo"
                    >
                       <X className="w-4 h-4" />
                    </button>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* ACTION BUTTONS */}
      <div className="flex flex-col items-center gap-4 animate-slide-up pb-8">
         {stagedFiles.length > 0 ? (
             <button
               onClick={handleFinalSubmit}
               disabled={isOverLimit}
               className={`
                 group relative px-10 py-5 bg-white text-black font-mono font-bold uppercase tracking-widest text-sm
                 hover:bg-vertem-green hover:text-black transition-all duration-300 rounded-sm
                 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black
                 flex items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(0,230,118,0.4)]
               `}
             >
                Gerar Dashboard Pulse <CornerDownRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
             </button>
         ) : (
            onDemoClick && (
              <button
                 onClick={onDemoClick}
                 className="group px-8 py-4 bg-white/5 border border-white/10 text-gray-400 font-mono text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all rounded-sm flex items-center gap-3"
               >
                  <PlayCircle className="w-4 h-4 text-vertem-blue group-hover:scale-110 transition-transform" />
                  Visualizar Demo Enterprise (Big Data)
               </button>
            )
         )}
      </div>

      {/* FOOTER INFO - Centered */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-white/5 pt-8 opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex flex-col gap-2 items-center">
             <div className="flex items-center justify-center gap-2 text-vertem-green mb-1">
                <Cpu className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">MULTI ARQUIVOS</span>
             </div>
             <p className="text-sm md:text-base text-gray-400 font-mono mt-2 leading-relaxed">Analise múltiplos projetos simultaneamente.</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
             <div className="flex items-center justify-center gap-2 text-vertem-green mb-1">
                <CornerDownRight className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">4 Pilares</span>
             </div>
             <p className="text-sm md:text-base text-gray-400 font-mono mt-2 leading-relaxed">Cliente, Equipe, Participante e IA.</p>
          </div>
          <div className="flex flex-col gap-2 items-center">
             <div className="flex items-center justify-center gap-2 text-vertem-green mb-1">
                <UploadCloud className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Seguro</span>
             </div>
             <p className="text-sm md:text-base text-gray-400 font-mono mt-2 leading-relaxed">Processamento volátil e seguro.</p>
          </div>
      </div>

    </div>
  );
};
