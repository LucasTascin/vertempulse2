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

export interface ProjectData {
  id: string;
  name: string;
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
  alerts: string[];
  actionPlan: string;
}

export interface DashboardData {
  projects: ProjectData[];
  globalStatus: 'critical' | 'warning' | 'healthy';
  totalProjects: number;
  criticalEvents: number;
}
