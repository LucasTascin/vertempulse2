import React, { useState } from 'react';
import { Lock, ArrowRight, Building2, Mail, User } from 'lucide-react';
import { LeadData } from '../types';

interface LeadCaptureModalProps {
  onSuccess: (data: LeadData) => void;
  onCancel: () => void;
}

export const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ onSuccess, onCancel }) => {
  const [form, setForm] = useState<LeadData>({
    name: '',
    workEmail: '',
    company: ''
  });
  const [error, setError] = useState('');

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isWorkEmail = (email: string) => {
    // Validação simples para desencorajar e-mails gratuitos, embora não bloqueie totalmente
    const freeProviders = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com', 'bol.com.br', 'uol.com.br'];
    const domain = email.split('@')[1];
    return domain && !freeProviders.includes(domain.toLowerCase());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.company.trim() || !form.workEmail.trim()) {
      setError('Todos os campos são obrigatórios.');
      return;
    }
    if (!isValidEmail(form.workEmail)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }
    // Opcional: Ativar bloqueio de e-mail grátis
    // if (!isWorkEmail(form.workEmail)) {
    //   setError('Por favor, utilize um e-mail corporativo.');
    //   return;
    // }

    onSuccess(form);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop com Blur forte */}
      <div className="absolute inset-0 bg-[#0f1115]/80 backdrop-blur-lg" onClick={onCancel}></div>

      <div className="relative w-full max-w-md bg-[#14161b] border border-white/10 p-8 md:p-10 shadow-2xl animate-scale-in">
        
        <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-brand-red/10 border border-brand-red/20 flex items-center justify-center text-brand-red mb-6">
                <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-light text-white mb-2">Acesso Restrito</h2>
            <p className="text-xs font-mono text-gray-500 leading-relaxed max-w-[280px]">
                Para liberar as ferramentas de geração de personas, identifique-se profissionalmente.
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider pl-1">Nome Completo</label>
                <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 h-12 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-gray-700"
                        placeholder="Seu nome"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider pl-1">E-mail Corporativo</label>
                <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                    <input 
                        type="email" 
                        value={form.workEmail}
                        onChange={e => setForm({...form, workEmail: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 h-12 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-gray-700"
                        placeholder="nome@empresa.com"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase tracking-wider pl-1">Empresa</label>
                <div className="relative group">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-white transition-colors" />
                    <input 
                        type="text" 
                        value={form.company}
                        onChange={e => setForm({...form, company: e.target.value})}
                        className="w-full bg-[#0f1115] border border-white/10 h-12 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-brand-red/50 transition-colors placeholder:text-gray-700"
                        placeholder="Nome da organização"
                    />
                </div>
            </div>

            {error && (
                <div className="p-3 border border-red-500/20 bg-red-500/5 text-red-400 text-xs font-mono text-center">
                    {error}
                </div>
            )}

            <button 
                type="submit"
                className="w-full bg-white text-black h-12 font-mono text-xs font-bold uppercase tracking-widest hover:bg-brand-red hover:text-white transition-all duration-300 mt-4 flex items-center justify-center gap-2"
            >
                Liberar Acesso <ArrowRight className="w-4 h-4" />
            </button>
        </form>

        <div className="mt-6 text-center">
            <button onClick={onCancel} className="text-[10px] text-gray-600 hover:text-white underline underline-offset-4 transition-colors">
                Apenas visualizar biblioteca
            </button>
        </div>

      </div>
    </div>
  );
};