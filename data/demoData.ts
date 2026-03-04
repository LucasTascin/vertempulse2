import { DashboardData } from '../types';

export const ENTERPRISE_DEMO_DATA: DashboardData = {
  projects: [
    {
      id: "p1",
      name: "MegaCorp B2B Loyalty",
      tier: "A",
      expirationDate: "12/2026",
      pointsBalance: 12500000,
      engagementRate: 88,
      pillars: {
        client: {
          score: 92,
          status: "healthy",
          summary: "Cliente satisfeito com ROI acima da meta.",
          metrics: [
            { label: "NPS", value: 75, trend: "up", history: [60,62,65,68,70,72,74,75,75,76,75,75], unit: "" },
            { label: "CSAT", value: 4.8, trend: "stable", history: [4.5,4.6,4.7,4.8,4.8,4.8,4.8,4.8,4.8,4.8], unit: "/5" }
          ]
        },
        team: {
          score: 85,
          status: "healthy",
          summary: "Equipe estável, entregas no prazo.",
          metrics: [
            { label: "Clima", value: 8.5, trend: "stable", history: [8,8,8.2,8.5,8.5,8.5,8.4,8.5], unit: "/10" }
          ]
        },
        participant: {
          score: 90,
          status: "healthy",
          summary: "Adesão recorde na campanha de Q1.",
          metrics: [
            { label: "MAU", value: 45000, trend: "up", history: [30000,32000,35000,38000,40000,42000,45000], unit: "users" }
          ]
        },
        ai: {
          score: 95,
          status: "healthy",
          summary: "Sem anomalias detectadas.",
          metrics: [
            { label: "Risco", value: 5, trend: "down", history: [20,15,10,8,6,5,5,5], unit: "%" }
          ]
        }
      },
      alerts: [],
      actionPlan: "Manter estratégia de expansão."
    },
    {
      id: "p2",
      name: "MegaCorp Agro Incentive",
      tier: "A",
      expirationDate: "06/2026",
      pointsBalance: 5400000,
      engagementRate: 42,
      pillars: {
        client: {
          score: 45,
          status: "critical",
          summary: "Cliente reportou insatisfação com plataforma.",
          metrics: [
            { label: "NPS", value: 15, trend: "down", history: [40,35,30,25,20,18,15,15], unit: "" }
          ]
        },
        team: {
          score: 60,
          status: "warning",
          summary: "Sobrecarga devido a chamados técnicos.",
          metrics: [
            { label: "SLA", value: 72, trend: "down", history: [95,90,85,80,75,72,70,72], unit: "%" }
          ]
        },
        participant: {
          score: 35,
          status: "critical",
          summary: "Queda brusca em resgates.",
          metrics: [
            { label: "Resgates", value: 1200, trend: "down", history: [5000,4500,4000,3000,2000,1500,1200], unit: "ops" }
          ]
        },
        ai: {
          score: 30,
          status: "critical",
          summary: "Alto risco de churn detectado.",
          metrics: [
            { label: "Churn Prob", value: 85, trend: "up", history: [10,20,35,50,65,75,80,85], unit: "%" }
          ]
        }
      },
      alerts: ["Risco iminente de cancelamento", "Falha técnica recorrente"],
      actionPlan: "Plano de contenção técnica imediato."
    },
    {
      id: "p3",
      name: "MegaCorp Retail B2C",
      tier: "B",
      expirationDate: "09/2027",
      pointsBalance: 890000,
      engagementRate: 65,
      pillars: {
        client: {
          score: 70,
          status: "warning",
          summary: "Cliente pede inovação.",
          metrics: [
            { label: "NPS", value: 50, trend: "stable", history: [50,50,50,50,50,50,50], unit: "" }
          ]
        },
        team: {
          score: 90,
          status: "healthy",
          summary: "Time criativo engajado.",
          metrics: [
            { label: "Entregas", value: 100, trend: "stable", history: [100,100,100,100,100], unit: "%" }
          ]
        },
        participant: {
          score: 60,
          status: "warning",
          summary: "Engajamento estagnado.",
          metrics: [
            { label: "Acessos", value: 15000, trend: "stable", history: [15000,14800,15100,14900,15000], unit: "users" }
          ]
        },
        ai: {
          score: 75,
          status: "warning",
          summary: "Oportunidade de gamificação detectada.",
          metrics: [
            { label: "Potencial", value: 80, trend: "up", history: [60,65,70,75,80], unit: "%" }
          ]
        }
      },
      alerts: ["Necessidade de refresh de campanha"],
      actionPlan: "Apresentar nova mecânica gamificada."
    },
    {
      id: "p4",
      name: "MegaCorp Tech Sales",
      tier: "B",
      expirationDate: "03/2026",
      pointsBalance: 2100000,
      engagementRate: 95,
      pillars: {
        client: { score: 98, status: "healthy", summary: "Case de sucesso.", metrics: [{ label: "NPS", value: 90, trend: "up", history: [80,85,88,90,90], unit: "" }] },
        team: { score: 95, status: "healthy", summary: "Alta performance.", metrics: [{ label: "SLA", value: 99, trend: "stable", history: [99,99,99,99], unit: "%" }] },
        participant: { score: 92, status: "healthy", summary: "Vendas acima da meta.", metrics: [{ label: "Vendas", value: 150, trend: "up", history: [100,110,120,135,150], unit: "% meta" }] },
        ai: { score: 99, status: "healthy", summary: "Modelo preditivo calibrado.", metrics: [{ label: "Acurácia", value: 98, trend: "stable", history: [95,96,97,98], unit: "%" }] }
      },
      alerts: [],
      actionPlan: "Preparar renovação antecipada."
    },
    {
      id: "p5",
      name: "MegaCorp Latam Exp.",
      tier: "A",
      expirationDate: "11/2028",
      pointsBalance: 500000,
      engagementRate: 20,
      pillars: {
        client: { score: 60, status: "warning", summary: "Dúvidas sobre adaptação cultural.", metrics: [{ label: "Confiança", value: 6, trend: "down", history: [8,7,6.5,6], unit: "/10" }] },
        team: { score: 50, status: "critical", summary: "Falta de fluência em espanhol.", metrics: [{ label: "Capacidade", value: 40, trend: "down", history: [60,50,45,40], unit: "%" }] },
        participant: { score: 30, status: "critical", summary: "Baixa adesão no México.", metrics: [{ label: "Cadastros", value: 500, trend: "stable", history: [500,500,500,500], unit: "users" }] },
        ai: { score: 40, status: "warning", summary: "Anomalia de dados regionais.", metrics: [{ label: "Erro", value: 15, trend: "up", history: [5,8,10,15], unit: "%" }] }
      },
      alerts: ["Gap de competência linguística", "Baixa tração inicial"],
      actionPlan: "Contratar suporte local Latam."
    },
    {
      id: "p6",
      name: "MegaCorp Internal HR",
      tier: "C",
      expirationDate: "Indefinido",
      pointsBalance: 0,
      engagementRate: 78,
      pillars: {
        client: { score: 85, status: "healthy", summary: "RH satisfeito.", metrics: [{ label: "eNPS", value: 40, trend: "up", history: [30,35,38,40], unit: "" }] },
        team: { score: 80, status: "healthy", summary: "Operação fluida.", metrics: [{ label: "Backlog", value: 5, trend: "down", history: [20,15,10,5], unit: "tasks" }] },
        participant: { score: 75, status: "healthy", summary: "Bons feedbacks.", metrics: [{ label: "Uso", value: 60, trend: "stable", history: [60,60,60,60], unit: "%" }] },
        ai: { score: 88, status: "healthy", summary: "Sentimento positivo.", metrics: [{ label: "Positivo", value: 85, trend: "up", history: [70,75,80,85], unit: "%" }] }
      },
      alerts: [],
      actionPlan: "Manter operação padrão."
    }
  ],
  globalStatus: "warning",
  totalProjects: 6,
  criticalEvents: 2
};
