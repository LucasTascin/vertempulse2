import { GoogleGenAI, Schema, Type } from "@google/genai";
import { DashboardData } from '../types';

export const analyzeProjectData = async (input: string): Promise<DashboardData> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY não configurada.");
    }

    // Initialize Gemini AI lazily
    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
      Você é o Vertem Pulse AI, um sistema de inteligência estratégica que monitora a saúde de projetos através de 4 pilares:
      1. Visão do Cliente (CSAT, NPS, Contratos)
      2. Visão da Equipe (Clima, SLAs, Reuniões)
      3. Visão do Participante (Engajamento, Funil)
      4. Visão da IA (Sentimento, Riscos)

      Analise o input e gere um JSON estruturado para um Dashboard Executivo.
      Se o input for genérico, crie 3-6 projetos fictícios realistas (ex: "Acessa Agro", "Conecta.ag", "Programa Fidelidade X") para demonstrar o painel.
      
      Regras de Negócio:
      - Tier A são projetos grandes.
      - Status "critical" se score < 50, "warning" se < 75, "healthy" se >= 75.
      - Crie variedade nos dados para o dashboard ficar visualmente rico.
      - Gere arrays de histórico (history) com 10-15 números para os sparklines.
    `;

    const prompt = `ANALISE OS DADOS: ${input}`;

    // Schema definitions
    const pulseMetricSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        label: { type: Type.STRING },
        value: { type: Type.NUMBER },
        trend: { type: Type.STRING, enum: ["up", "down", "stable"] },
        history: { type: Type.ARRAY, items: { type: Type.NUMBER } },
        unit: { type: Type.STRING }
      },
      required: ["label", "value", "trend", "history"]
    };

    const pulsePillarSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.NUMBER },
        status: { type: Type.STRING, enum: ["critical", "warning", "healthy"] },
        metrics: { type: Type.ARRAY, items: pulseMetricSchema },
        summary: { type: Type.STRING }
      },
      required: ["score", "status", "metrics", "summary"]
    };

    const projectDataSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        tier: { type: Type.STRING, enum: ["A", "B", "C"] },
        expirationDate: { type: Type.STRING },
        pointsBalance: { type: Type.NUMBER },
        engagementRate: { type: Type.NUMBER },
        pillars: {
          type: Type.OBJECT,
          properties: {
            client: pulsePillarSchema,
            team: pulsePillarSchema,
            participant: pulsePillarSchema,
            ai: pulsePillarSchema
          },
          required: ["client", "team", "participant", "ai"]
        },
        alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
        actionPlan: { type: Type.STRING }
      },
      required: ["id", "name", "tier", "expirationDate", "pointsBalance", "engagementRate", "pillars", "alerts", "actionPlan"]
    };

    const dashboardDataSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        projects: { type: Type.ARRAY, items: projectDataSchema },
        globalStatus: { type: Type.STRING, enum: ["critical", "warning", "healthy"] },
        totalProjects: { type: Type.NUMBER },
        criticalEvents: { type: Type.NUMBER }
      },
      required: ["projects", "globalStatus", "totalProjects", "criticalEvents"]
    };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: dashboardDataSchema,
        temperature: 0.4
      }
    });

    const responseText = response.text;
    if (!responseText) throw new Error("Falha ao gerar dados do dashboard.");
    
    return JSON.parse(responseText) as DashboardData;

  } catch (error) {
    console.error("Erro ao analisar dados com Gemini:", error);
    throw new Error("Falha ao processar inteligência do projeto.");
  }
};
