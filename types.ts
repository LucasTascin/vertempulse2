export enum AppStep {
  INPUT = 'INPUT',
  LOADING = 'LOADING',
  DASHBOARD = 'DASHBOARD'
}

export interface PulseMetric {
  label: string;
  value: number; // 0-100 or absolute value
  trend: 'up' | 'down' | 'stable';
  history: number[]; // Array of 10-15 numbers for sparkline
  unit?: string;
}

export interface PulsePillar {
  score: number; // 0-100
  status: 'critical' | 'warning' | 'healthy';
  metrics: PulseMetric[];
  summary: string;
}

export type ProgramType = 'incentive' | 'loyalty';
export type TimeRange = '7d' | '15d' | '30d' | '90d' | '180d';

export interface MetricDetail {
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  history?: number[];
}

export interface EngagementMetrics {
  adoptionRate: MetricDetail; // Taxa de adesão
  activationRate: MetricDetail; // Taxa de ativação
  mau: MetricDetail; // Monthly Active Users
  dau: MetricDetail; // Daily Active Users
  frequency: MetricDetail; // Frequência de uso
  campaignParticipation: MetricDetail; // Taxa de participação em campanhas
}

export interface RetentionMetrics {
  retentionRate: MetricDetail; // Taxa de retenção
  churnRate: MetricDetail; // Churn rate
  avgTimeInProgram: MetricDetail; // Tempo médio de permanência
  reactivationRate: MetricDetail; // Reativação
}

export interface PurchaseBehaviorMetrics {
  avgTicket: MetricDetail; // Ticket médio
  purchaseFrequency: MetricDetail; // Frequência de compra
  incrementalSales: MetricDetail; // Incremental de vendas
  shareOfWallet: MetricDetail; // Share of wallet
  crossSellUpsell: MetricDetail; // Cross-sell / Upsell
}

export interface RewardMetrics {
  earnRate: MetricDetail; // Earn rate
  burnRate: MetricDetail; // Burn rate
  breakage: MetricDetail; // Breakage
  avgRedemptionTime: MetricDetail; // Tempo médio até resgate
  perceivedValue: MetricDetail; // Valor percebido da recompensa
}

export interface ExperienceMetrics {
  nps: MetricDetail; // Net Promoter Score
  csat: MetricDetail; // Customer Satisfaction Score
  ces: MetricDetail; // Customer Effort Score
}

export interface FinancialMetrics {
  roi: MetricDetail; // ROI do programa
  costPerParticipant: MetricDetail; // Custo por participante
  costPerEngagement: MetricDetail; // Custo por engajamento
  ltv: MetricDetail; // Lifetime Value
  cacPayback: MetricDetail; // CAC payback
}

export interface ExtendedProjectMetrics {
  engagement: EngagementMetrics;
  retention: RetentionMetrics;
  behavior: PurchaseBehaviorMetrics;
  rewards: RewardMetrics;
  experience: ExperienceMetrics;
  financial: FinancialMetrics;
}

export interface ProjectData {
  id: string;
  name: string;
  programType: ProgramType;
  tier: 'A' | 'B' | 'C';
  expirationDate: string;
  pointsBalance: number;
  engagementRate: number;
  pillars: {
    client: PulsePillar;
    team: PulsePillar;
    participant: PulsePillar;
    ai: PulsePillar;
  };
  extendedMetrics: ExtendedProjectMetrics;
  alerts: string[];
  actionPlan: string;
}

export interface DashboardData {
  projects: ProjectData[];
  globalStatus: 'critical' | 'warning' | 'healthy';
  totalProjects: number;
  criticalEvents: number;
}
