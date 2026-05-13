import { NextResponse } from 'next/server';

const anthropicPrompt = ({ recommendations, teamSize, useCase, totalMonthlySavings }: any) => {
  const lines = recommendations
    .filter((rec: any) => rec.savings > 0)
    .map((rec: any) => `- ${rec.toolName}: ${rec.selectedPlan} -> ${rec.savings > 0 ? `${rec.savings} savings` : 'no change'}`)
    .join('\n');

  return `You are an AI auditor for a business tool review.

Write a 100-word summary for a team of ${teamSize} people using AI tools for ${useCase}. The audit found ${totalMonthlySavings} USD in monthly savings. Include the highest-value recommendation and signal whether the stack is already efficient.

Audit recommendations:
${lines}

Write the summary as a concise, helpful note to a founder or finance lead.`;
};

export async function POST(request: Request) {
  const body = await request.json();
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'AI API key not configured' }, { status: 503 });
  }

  const prompt = anthropicPrompt(body);

  try {
    const response = await fetch('https://api.anthropic.com/v1/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'claude-3.5-mini',
        prompt,
        max_tokens_to_sample: 220,
        temperature: 0.3
      })
    });

    const data = await response.json();
    const summary = data?.completion ?? null;
    if (!summary) {
      throw new Error('No completion returned');
    }

    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json({ error: 'AI summary generation failed' }, { status: 502 });
  }
}
