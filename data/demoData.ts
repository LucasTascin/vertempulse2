import { DashboardData, ProjectData, ExtendedProjectMetrics, ProgramType, TimeRange } from '../types';

// Helper to generate consistent random data based on seed
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Helper to generate sparkline data
const generateSparkline = (seed: number, length: number = 10, trend: 'up' | 'down' | 'stable' = 'stable') => {
  let current = 50;
  return Array.from({ length }, (_, i) => {
    const noise = (seededRandom(seed + i) - 0.5) * 20;
    current += noise + (trend === 'up' ? 2 : trend === 'down' ? -2 : 0);
    return Math.max(0, Math.min(100, current));
  });
};

const formatCurrency = (value: number) => {
  if (value >= 1000000) return `R$ ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `R$ ${(value / 1000).toFixed(1)}K`;
  return `R$ ${value.toFixed(0)}`;
};

const formatNumber = (value: number) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toFixed(0);
};

// Helper to generate extended metrics based on program type and time range
const generateExtendedMetrics = (type: ProgramType, status: string, seed: number, range: TimeRange): ExtendedProjectMetrics => {
  const isHealthy = status === 'healthy';
  const isIncentive = type === 'incentive';
  
  // Range multipliers
  const rangeMultipliers: Record<TimeRange, number> = {
    '7d': 0.25,
    '15d': 0.5,
    '30d': 1,
    '90d': 3,
    '180d': 6
  };
  const multiplier = rangeMultipliers[range];

  // Base values (approximate for 30d)
  const baseIncrementalSales = isIncentive ? 1200000 : 4500000;
  const baseBurnRate = isIncentive ? 85 : 65;
  
  // Apply multiplier and some randomness
  const incrementalSales = baseIncrementalSales * multiplier * (0.9 + seededRandom(seed) * 0.2);
  
  // Rates shouldn't scale linearly with time, but might fluctuate
  const fluctuation = (seededRandom(seed + 1) - 0.5) * 5; // +/- 2.5%

  return {
    engagement: {
      adoptionRate: { 
        value: Math.min(100, Math.floor((isIncentive ? 92 : 45) + fluctuation)), 
        unit: '%', 
        trend: isHealthy ? 'up' : 'stable', 
        history: generateSparkline(seed + 1) 
      },
      activationRate: { 
        value: Math.min(100, Math.floor((isIncentive ? 88 : 32) + fluctuation)), 
        unit: '%', 
        trend: isHealthy ? 'up' : 'down', 
        history: generateSparkline(seed + 2) 
      },
      mau: { 
        value: formatNumber(Math.floor((isIncentive ? 1500 : 50000) * (1 + fluctuation/100))), 
        unit: '', 
        trend: 'stable', 
        history: generateSparkline(seed + 3) 
      },
      dau: { 
        value: formatNumber(Math.floor((isIncentive ? 800 : 12000) * (1 + fluctuation/100))), 
        unit: '', 
        trend: 'up', 
        history: generateSparkline(seed + 4) 
      },
      frequency: { 
        value: (isIncentive ? 4.5 : 1.2 * multiplier).toFixed(1), // Frequency might scale if it's "times per period"
        unit: 'x', 
        trend: 'stable', 
        history: generateSparkline(seed + 5) 
      },
      campaignParticipation: { 
        value: Math.min(100, Math.floor((isIncentive ? 75 : 25) + fluctuation)), 
        unit: '%', 
        trend: isHealthy ? 'up' : 'down', 
        history: generateSparkline(seed + 6) 
      }
    },
    retention: {
      retentionRate: { 
        value: Math.min(100, Math.floor((isIncentive ? 95 : 60) + fluctuation)), 
        unit: '%', 
        trend: 'stable', 
        history: generateSparkline(seed + 7) 
      },
      churnRate: { 
        value: Math.max(0, Math.floor((isIncentive ? 2 : 15) - fluctuation)), 
        unit: '%', 
        trend: isHealthy ? 'down' : 'up', 
        history: generateSparkline(seed + 8, 10, 'down') 
      },
      avgTimeInProgram: { 
        value: (isIncentive ? 14 : 24).toFixed(0), 
        unit: 'm', 
        trend: 'up', 
        history: generateSparkline(seed + 9) 
      },
      reactivationRate: { 
        value: Math.floor(12 + fluctuation), 
        unit: '%', 
        trend: 'up', 
        history: generateSparkline(seed + 10) 
      }
    },
    behavior: {
      avgTicket: { 
        value: isIncentive ? 'R$ 4.5K' : 'R$ 250', 
        unit: '', 
        trend: 'up', 
        history: generateSparkline(seed + 11) 
      },
      purchaseFrequency: { 
        value: (isIncentive ? 2.1 : 3.5 * multiplier).toFixed(1), 
        unit: 'x', 
        trend: 'stable', 
        history: generateSparkline(seed + 12) 
      },
      incrementalSales: { 
        value: formatCurrency(incrementalSales), 
        unit: '', 
        trend: 'up', 
        history: generateSparkline(seed + 13, 10, 'up') 
      },
      shareOfWallet: { 
        value: Math.min(100, Math.floor((isIncentive ? 60 : 30) + fluctuation)), 
        unit: '%', 
        trend: 'up', 
        history: generateSparkline(seed + 14) 
      },
      crossSellUpsell: { 
        value: Math.min(100, Math.floor(18 + fluctuation)), 
        unit: '%', 
        trend: 'stable', 
        history: generateSparkline(seed + 15) 
      }
    },
    rewards: {
      earnRate: { 
        value: Math.min(100, Math.floor((isIncentive ? 90 : 70) + fluctuation)), 
        unit: '%', 
        trend: 'up', 
        history: generateSparkline(seed + 16) 
      },
      burnRate: { 
        value: Math.min(100, Math.floor(baseBurnRate + fluctuation)), 
        unit: '%', 
        trend: 'stable', 
        history: generateSparkline(seed + 17) 
      },
      breakage: { 
        value: Math.max(0, Math.floor((isIncentive ? 5 : 15) - fluctuation)), 
        unit: '%', 
        trend: 'down', 
        history: generateSparkline(seed + 18, 10, 'down') 
      },
      avgRedemptionTime: { 
        value: (isIncentive ? 45 : 120).toFixed(0), 
        unit: 'd', 
        trend: 'stable', 
        history: generateSparkline(seed + 19) 
      },
      perceivedValue: { 
        value: isIncentive ? 'R$ 850' : 'R$ 120', 
        unit: '', 
        trend: 'up', 
        history: generateSparkline(seed + 20) 
      }
    },
    experience: {
      nps: { 
        value: Math.min(100, Math.floor((isIncentive ? 75 : 60) + fluctuation)), 
        unit: '', 
        trend: isHealthy ? 'up' : 'stable', 
        history: generateSparkline(seed + 21) 
      },
      csat: { 
        value: (isIncentive ? 4.8 : 4.2).toFixed(1), 
        unit: '/5', 
        trend: 'stable', 
        history: generateSparkline(seed + 22) 
      },
      ces: { 
        value: (isIncentive ? 2.1 : 3.5).toFixed(1), 
        unit: '/7', 
        trend: 'down', 
        history: generateSparkline(seed + 23, 10, 'down') 
      }
    },
    financial: {
      roi: { 
        value: Math.floor((isIncentive ? 350 : 150) + fluctuation) + '%', 
        unit: '', 
        trend: 'up', 
        history: generateSparkline(seed + 24, 10, 'up') 
      },
      costPerParticipant: { 
        value: isIncentive ? 'R$ 150' : 'R$ 15', 
        unit: '', 
        trend: 'stable', 
        history: generateSparkline(seed + 25) 
      },
      costPerEngagement: { 
        value: isIncentive ? 'R$ 45' : 'R$ 2.50', 
        unit: '', 
        trend: 'down', 
        history: generateSparkline(seed + 26) 
      },
      ltv: { 
        value: isIncentive ? 'R$ 15K' : 'R$ 2.5K', 
        unit: '', 
        trend: 'up', 
        history: generateSparkline(seed + 27) 
      },
      cacPayback: { 
        value: isIncentive ? '3m' : '6m', 
        unit: '', 
        trend: 'stable', 
        history: generateSparkline(seed + 28) 
      }
    }
  };
};

const BASE_PROJECTS: Omit<ProjectData, 'extendedMetrics'>[] = [
  {
    id: '1',
    name: 'Programa Elite Rewards',
    tier: 'Enterprise',
    programType: 'incentive',
    status: 'healthy',
    score: 94,
    pointsBalance: 12500000,
    engagementRate: 88,
    roi: 320,
    expirationDate: '31/12/2026',
    pillars: {
      client: { score: 96, status: 'healthy', summary: 'Alta satisfação do cliente com NPS de 82. Feedback positivo sobre catálogo de prêmios.', metrics: [{ label: 'NPS', value: 82, unit: '', trend: 'up', history: [78, 79, 80, 81, 82, 82, 82, 83, 82, 82] }, { label: 'CSAT', value: 4.8, unit: '/5', trend: 'stable', history: [4.7, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8, 4.8] }] },
      team: { score: 92, status: 'healthy', summary: 'Equipe comercial engajada, com 95% de ativação na plataforma.', metrics: [{ label: 'Ativação', value: 95, unit: '%', trend: 'up', history: [90, 91, 92, 93, 94, 95, 95, 95, 95, 95] }, { label: 'Treinamentos', value: 12, unit: 'h', trend: 'up', history: [8, 9, 10, 10, 11, 11, 12, 12, 12, 12] }] },
      participant: { score: 88, status: 'warning', summary: 'Leve queda na frequência de acessos na última semana.', metrics: [{ label: 'Frequência', value: 3.2, unit: 'x/sem', trend: 'down', history: [3.8, 3.7, 3.6, 3.5, 3.4, 3.3, 3.2, 3.2, 3.1, 3.2] }, { label: 'Resgates', value: 450, unit: '', trend: 'stable', history: [440, 450, 460, 450, 445, 450, 455, 450, 450, 450] }] },
      ai: { score: 98, status: 'healthy', summary: 'Algoritmo de recomendação performando acima do esperado.', metrics: [{ label: 'Precisão', value: 94, unit: '%', trend: 'up', history: [90, 91, 92, 93, 93, 94, 94, 94, 94, 94] }, { label: 'Conversão', value: 18, unit: '%', trend: 'up', history: [15, 16, 16, 17, 17, 18, 18, 18, 18, 18] }] }
    },
    alerts: [],
    actionPlan: 'Manter estratégia atual de gamificação. Avaliar expansão do catálogo de experiências.'
  },
  {
    id: '2',
    name: 'Clube de Vantagens VIP',
    tier: 'Mid-Market',
    programType: 'loyalty',
    status: 'warning',
    score: 72,
    pointsBalance: 450000,
    engagementRate: 45,
    roi: 110,
    expirationDate: '15/10/2026',
    pillars: {
      client: { score: 65, status: 'warning', summary: 'Cliente reportou dificuldade na aprovação de verbas adicionais.', metrics: [{ label: 'Budget', value: 85, unit: '%', trend: 'stable', history: [85, 85, 85, 85, 85, 85, 85, 85, 85, 85] }] },
      team: { score: 70, status: 'warning', summary: 'Baixa adesão da equipe de suporte às novas funcionalidades.', metrics: [{ label: 'Adesão', value: 40, unit: '%', trend: 'down', history: [50, 48, 46, 44, 42, 40, 40, 38, 40, 40] }] },
      participant: { score: 68, status: 'critical', summary: 'Churn rate aumentou 5% no último mês.', metrics: [{ label: 'Churn', value: 12, unit: '%', trend: 'up', history: [7, 8, 8, 9, 10, 11, 11, 12, 12, 12] }] },
      ai: { score: 85, status: 'healthy', summary: 'IA identificou padrão de churn e sugeriu campanha de retenção.', metrics: [{ label: 'Insights', value: 15, unit: '', trend: 'up', history: [10, 11, 12, 13, 14, 14, 15, 15, 15, 15] }] }
    },
    alerts: ['Aumento de Churn detectado', 'Baixa utilização do budget'],
    actionPlan: 'Ativar campanha de "Win-back" sugerida pela IA. Agendar reunião de alinhamento com stakeholders.'
  },
  {
    id: '3',
    name: 'Incentivo Force Sales',
    tier: 'Enterprise',
    programType: 'incentive',
    status: 'critical',
    score: 58,
    pointsBalance: 2100000,
    engagementRate: 32,
    roi: -15,
    expirationDate: '01/06/2026',
    pillars: {
      client: { score: 50, status: 'critical', summary: 'Cliente insatisfeito com ROI negativo nos últimos 2 meses.', metrics: [{ label: 'ROI', value: -15, unit: '%', trend: 'down', history: [5, 0, -5, -10, -12, -15, -15, -15, -16, -15] }] },
      team: { score: 60, status: 'warning', summary: 'Equipe desmotivada devido a metas inatingíveis.', metrics: [{ label: 'Metas', value: 30, unit: '%', trend: 'down', history: [50, 45, 40, 35, 30, 30, 30, 28, 30, 30] }] },
      participant: { score: 55, status: 'critical', summary: 'Apenas 30% da base ativa.', metrics: [{ label: 'Ativos', value: 30, unit: '%', trend: 'down', history: [40, 38, 36, 34, 32, 30, 30, 30, 29, 30] }] },
      ai: { score: 70, status: 'warning', summary: 'IA detectou anomalia na configuração das metas.', metrics: [{ label: 'Anomalias', value: 3, unit: '', trend: 'up', history: [0, 0, 1, 1, 2, 2, 3, 3, 3, 3] }] }
    },
    alerts: ['ROI Negativo', 'Metas descalibradas', 'Risco de cancelamento'],
    actionPlan: 'Revisão urgente das metas (SQUAD de emergência). Rodar simulação de novos cenários na IA.'
  },
  {
    id: '4',
    name: 'Fidelidade Premium Blue',
    tier: 'SMB',
    programType: 'loyalty',
    status: 'healthy',
    score: 89,
    pointsBalance: 120000,
    engagementRate: 75,
    roi: 210,
    expirationDate: '20/11/2026',
    pillars: {
      client: { score: 90, status: 'healthy', summary: 'Cliente expandiu o contrato após resultados do Q1.', metrics: [{ label: 'Expansão', value: 15, unit: '%', trend: 'up', history: [0, 0, 5, 10, 15, 15, 15, 15, 15, 15] }] },
      team: { score: 88, status: 'healthy', summary: 'Operação fluida, sem chamados críticos.', metrics: [{ label: 'SLA', value: 100, unit: '%', trend: 'stable', history: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100] }] },
      participant: { score: 85, status: 'healthy', summary: 'Crescimento orgânico da base de cadastros.', metrics: [{ label: 'Cadastros', value: 1500, unit: '', trend: 'up', history: [1200, 1250, 1300, 1350, 1400, 1450, 1500, 1500, 1500, 1500] }] },
      ai: { score: 92, status: 'healthy', summary: 'Sugestões de cross-sell com alta conversão.', metrics: [{ label: 'Conv. Cross', value: 22, unit: '%', trend: 'up', history: [18, 19, 20, 21, 22, 22, 22, 22, 22, 22] }] }
    },
    alerts: [],
    actionPlan: 'Explorar novos canais de aquisição. Testar campanhas de Member-get-Member.'
  },
  {
    id: '5',
    name: 'Tech Partners Program',
    tier: 'Enterprise',
    programType: 'incentive',
    status: 'healthy',
    score: 91,
    pointsBalance: 8500000,
    engagementRate: 82,
    roi: 280,
    expirationDate: '10/08/2026',
    pillars: {
      client: { score: 92, status: 'healthy', summary: 'Parceiros estratégicos atingindo 110% da meta.', metrics: [{ label: 'Meta', value: 110, unit: '%', trend: 'up', history: [100, 102, 105, 108, 110, 110, 110, 110, 110, 110] }] },
      team: { score: 89, status: 'healthy', summary: 'Suporte técnico com tempo de resposta recorde.', metrics: [{ label: 'TMA', value: 2.5, unit: 'h', trend: 'down', history: [4, 3.5, 3, 2.8, 2.5, 2.5, 2.5, 2.5, 2.5, 2.5] }] },
      participant: { score: 90, status: 'healthy', summary: 'Alto índice de resgate de prêmios de alto valor.', metrics: [{ label: 'Ticket Pr.', value: 2500, unit: 'R$', trend: 'up', history: [2000, 2100, 2200, 2300, 2400, 2500, 2500, 2500, 2500, 2500] }] },
      ai: { score: 94, status: 'healthy', summary: 'IA otimizou a distribuição de leads para parceiros.', metrics: [{ label: 'Otimização', value: 12, unit: '%', trend: 'up', history: [5, 6, 8, 10, 12, 12, 12, 12, 12, 12] }] }
    },
    alerts: [],
    actionPlan: 'Implementar nível "Diamond" para parceiros top performers.'
  }
];

export const getDashboardData = (range: TimeRange = '30d'): DashboardData => {
  // Generate projects with metrics scaled by range
  const projects = BASE_PROJECTS.map((project, index) => {
    // Scale points balance slightly based on range to simulate accumulation/spending
    // (Just a visual effect, not strict math)
    const balanceMultiplier = range === '7d' ? 0.95 : range === '15d' ? 0.98 : range === '30d' ? 1 : range === '90d' ? 1.05 : 1.1;
    
    // Add some fluctuation to engagement rate based on range
    const engagementFluctuation = range === '7d' ? -2 : range === '15d' ? -1 : range === '30d' ? 0 : range === '90d' ? 1 : 2;
    const newEngagementRate = Math.min(100, Math.max(0, project.engagementRate + engagementFluctuation));

    return {
      ...project,
      pointsBalance: Math.floor(project.pointsBalance * balanceMultiplier),
      engagementRate: newEngagementRate,
      extendedMetrics: generateExtendedMetrics(project.programType, project.status, index, range)
    };
  });

  return {
    totalProjects: projects.length,
    criticalEvents: projects.filter(p => p.status === 'critical').length,
    globalStatus: 'Estável',
    projects
  };
};

export const getProjectDetail = (project: ProjectData, range: TimeRange): ProjectData => {
  // Find base project to avoid re-accumulating changes if we passed a modified project
  const baseProject = BASE_PROJECTS.find(p => p.id === project.id);
  if (!baseProject) return project;

  const balanceMultiplier = range === '7d' ? 0.95 : range === '15d' ? 0.98 : range === '30d' ? 1 : range === '90d' ? 1.05 : 1.1;
  
  // Add some fluctuation to engagement rate based on range
  const engagementFluctuation = range === '7d' ? -2 : range === '15d' ? -1 : range === '30d' ? 0 : range === '90d' ? 1 : 2;
  const newEngagementRate = Math.min(100, Math.max(0, baseProject.engagementRate + engagementFluctuation));

  // Use index from ID (p1 -> 0, p2 -> 1, etc) or random seed
  const seed = parseInt(project.id.replace(/\D/g, '')) || 0;

  return {
    ...baseProject,
    pointsBalance: Math.floor(baseProject.pointsBalance * balanceMultiplier),
    engagementRate: newEngagementRate,
    extendedMetrics: generateExtendedMetrics(baseProject.programType, baseProject.status, seed, range)
  };
};

// Initial load data (default 30d)
export const ENTERPRISE_DEMO_DATA: DashboardData = getDashboardData('30d');
