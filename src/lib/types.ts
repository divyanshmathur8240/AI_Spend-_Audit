export type ToolKey =
  | 'cursor'
  | 'copilot'
  | 'claude'
  | 'chatgpt'
  | 'anthropic'
  | 'openai'
  | 'gemini'
  | 'windsurf';

export type UseCase = 'coding' | 'writing' | 'data' | 'research' | 'mixed';

export interface PlanOption {
  key: string;
  label: string;
  monthlyPrice: number;
  minSeats?: number;
}

export interface ToolDefinition {
  key: ToolKey;
  name: string;
  plans: PlanOption[];
  useCaseNotes: Partial<Record<UseCase, string>>;
  alternative?: string;
}

export interface ToolInput {
  tool: ToolKey;
  enabled: boolean;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditRecommendation {
  tool: ToolKey;
  toolName: string;
  selectedPlan: string;
  currentSpend: number;
  recommendedPlan: string | null;
  alternative: string | null;
  savings: number;
  reason: string;
}

export interface AuditSnapshot {
  id: string;
  createdAt: string;
  teamSize: number;
  useCase: UseCase;
  tools: ToolInput[];
  summary: string;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  recommendations: AuditRecommendation[];
  email?: string;
  company?: string;
  role?: string;
}
