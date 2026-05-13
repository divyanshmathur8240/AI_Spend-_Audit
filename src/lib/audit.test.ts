import { describe, expect, it } from 'vitest';
import { evaluateTool, runAudit } from './audit';
import type { ToolInput } from './types';

const defaultTool: ToolInput = {
  tool: 'copilot',
  enabled: true,
  plan: 'Business',
  monthlySpend: 30,
  seats: 2
};

describe('audit engine', () => {
  it('returns zero savings for a disabled tool', () => {
    const recommendation = evaluateTool({ ...defaultTool, enabled: false }, 3, 'coding');
    expect(recommendation.savings).toBe(0);
    expect(recommendation.reason).toContain('No active spend');
  });

  it('recommends a cheaper plan for a small team on a business subscription', () => {
    const recommendation = evaluateTool(defaultTool, 2, 'coding');
    expect(recommendation.recommendedPlan).toBe('Individual');
    expect(recommendation.savings).toBeGreaterThan(0);
  });

  it('suggests an alternative for a data use case on Copilot', () => {
    const recommendation = evaluateTool({ ...defaultTool, tool: 'openai', plan: 'API direct', monthlySpend: 200, seats: 1 }, 2, 'data');
    expect(recommendation.alternative).toBe('Anthropic API direct');
  });

  it('correctly totals savings across multiple tools', () => {
    const tools: ToolInput[] = [
      defaultTool,
      { tool: 'claude', enabled: true, plan: 'Team', monthlySpend: 60, seats: 2 }
    ];

    const result = runAudit(tools, 2, 'writing');
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(0);
    expect(result.recommendations.length).toBe(2);
  });

  it('produces no false savings when the current plan is already appropriate', () => {
    const recommendation = evaluateTool({ ...defaultTool, plan: 'Individual', monthlySpend: 10 }, 1, 'coding');
    expect(recommendation.savings).toBe(0);
    expect(recommendation.recommendedPlan).toBeNull();
  });
});
