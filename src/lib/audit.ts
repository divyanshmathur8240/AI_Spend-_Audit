import { TOOL_DEFINITIONS } from './pricing';
import type { AuditRecommendation, ToolInput, UseCase } from './types';

function getPlanPrice(toolKey: string, planKey: string) {
  const tool = TOOL_DEFINITIONS[toolKey];
  return tool?.plans.find((plan) => plan.key === planKey)?.monthlyPrice ?? 0;
}

function preferCheaperPlan(toolKey: string, input: ToolInput, teamSize: number) {
  const tool = TOOL_DEFINITIONS[toolKey];
  if (!tool) return null;

  const plan = tool.plans.find((option) => option.key === input.plan);
  if (!plan) return null;

  const tier = plan.key.toLowerCase();
  const isTeamPlan = tier.includes('team') || tier.includes('business') || tier.includes('enterprise');

  if (teamSize <= 2 && isTeamPlan) {
    const smaller = tool.plans.find((candidate) => candidate.monthlyPrice > 0 && candidate.monthlyPrice < plan.monthlyPrice && !candidate.key.toLowerCase().includes('team') && !candidate.key.toLowerCase().includes('enterprise'));
    if (smaller) {
      return smaller;
    }
  }

  if (input.monthlySpend < plan.monthlyPrice && plan.monthlyPrice > 0) {
    const candidate = tool.plans.reduce((best, candidatePlan) => {
      if (candidatePlan.monthlyPrice <= input.monthlySpend && candidatePlan.monthlyPrice < (best?.monthlyPrice ?? Infinity)) {
        return candidatePlan;
      }
      return best;
    }, null as (typeof plan) | null);
    return candidate;
  }

  return null;
}

function buildAlternativeRecommendation(toolKey: string, input: ToolInput, useCase: UseCase) {
  const tool = TOOL_DEFINITIONS[toolKey];
  if (!tool?.alternative) return null;

  if (useCase === 'coding' && ['chatgpt', 'openai', 'anthropic'].includes(toolKey)) {
    return tool.alternative;
  }

  if (useCase === 'writing' && ['copilot', 'gemini', 'windsurf'].includes(toolKey)) {
    return tool.alternative;
  }

  if (useCase === 'data' && ['copilot', 'chatgpt', 'openai', 'windsurf'].includes(toolKey)) {
    return tool.alternative;
  }

  return null;
}

export function evaluateTool(input: ToolInput, teamSize: number, useCase: UseCase): AuditRecommendation {
  const tool = TOOL_DEFINITIONS[input.tool];
  const currentSpend = input.monthlySpend;
  const recommendationSteps: string[] = [];
  let recommendedPlan: string | null = null;
  let alternative: string | null = null;
  let savings = 0;

  if (!input.enabled || currentSpend <= 0) {
    return {
      tool: input.tool,
      toolName: tool?.name ?? input.tool,
      selectedPlan: input.plan,
      currentSpend,
      recommendedPlan: null,
      alternative: null,
      savings: 0,
      reason: 'No active spend entered for this tool.'
    };
  }

  const cheaperPlan = preferCheaperPlan(input.tool, input, teamSize);
  if (cheaperPlan) {
    recommendedPlan = cheaperPlan.key;
    savings = Math.max(currentSpend - cheaperPlan.monthlyPrice, 0);
    recommendationSteps.push(`Your current ${input.plan} plan is likely too expensive for ${teamSize} users.`);
  }

  const alt = buildAlternativeRecommendation(input.tool, input, useCase);
  if (alt && currentSpend > 0) {
    alternative = alt;
    if (!recommendedPlan) {
      savings += Math.min(currentSpend * 0.15, 150);
      recommendationSteps.push(`A cheaper alternative for ${useCase} is ${alt}.`);
    }
  }

  if (!recommendedPlan && !alternative) {
    recommendationSteps.push('This plan appears aligned with your current usage and team size.');
  }

  const reason = recommendationSteps.join(' ');

  return {
    tool: input.tool,
    toolName: tool?.name ?? input.tool,
    selectedPlan: input.plan,
    currentSpend,
    recommendedPlan,
    alternative,
    savings,
    reason
  };
}

export function runAudit(inputs: ToolInput[], teamSize: number, useCase: UseCase) {
  const recommendations = inputs.map((input) => evaluateTool(input, teamSize, useCase));
  const totalMonthlySavings = recommendations.reduce((sum, rec) => sum + Math.max(rec.savings, 0), 0);
  return {
    recommendations,
    totalMonthlySavings,
    totalAnnualSavings: Math.round(totalMonthlySavings * 12)
  };
}
