'use client';

import { useEffect, useMemo, useState } from 'react';
import { TOOL_DEFINITIONS, TOOL_KEYS } from '@/lib/pricing';
import type { AuditRecommendation, ToolInput, UseCase } from '@/lib/types';
import { runAudit } from '@/lib/audit';

const STORAGE_KEY = 'spend-audit-state-v1';

const DEFAULT_TOOLS: ToolInput[] = TOOL_KEYS.map((tool) => ({
  tool,
  enabled: false,
  plan: TOOL_DEFINITIONS[tool].plans[0]?.key ?? '',
  monthlySpend: 0,
  seats: 1
}));

const USE_CASES: UseCase[] = ['coding', 'writing', 'data', 'research', 'mixed'];

function numberDisplay(value: number) {
  return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

export default function AuditApp() {
  const [teamSize, setTeamSize] = useState(5);
  const [useCase, setUseCase] = useState<UseCase>('mixed');
  const [tools, setTools] = useState<ToolInput[]>(DEFAULT_TOOLS);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [summary, setSummary] = useState('');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [savingLead, setSavingLead] = useState(false);
  const [leadMessage, setLeadMessage] = useState('');

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setTeamSize(parsed.teamSize || 5);
        setUseCase(parsed.useCase || 'mixed');
        setTools(parsed.tools ?? DEFAULT_TOOLS);
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ teamSize, useCase, tools })
    );
  }, [teamSize, useCase, tools]);

  const audit = useMemo(() => runAudit(tools, teamSize, useCase), [tools, teamSize, useCase]);

  useEffect(() => {
    async function fetchSummary() {
      const enabledTools = tools.filter((tool) => tool.enabled && tool.monthlySpend > 0);
      if (enabledTools.length === 0) {
        setSummary('Add your tools and spend to get a personalized optimization summary.');
        return;
      }

      try {
        const response = await fetch('/api/summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recommendations: audit.recommendations,
            teamSize,
            useCase,
            totalMonthlySavings: audit.totalMonthlySavings
          })
        });

        const data = await response.json();
        setSummary(data.summary ?? fallbackSummary(audit));
      } catch (error) {
        setSummary(fallbackSummary(audit));
      }
    }

    fetchSummary();
  }, [audit, teamSize, useCase, tools]);

  function fallbackSummary(auditData: { totalMonthlySavings: number; totalAnnualSavings: number; recommendations: AuditRecommendation[] }) {
    if (auditData.totalMonthlySavings <= 0) {
      return `Your AI stack looks well-aligned for your team size and workload. Keep tracking spend, and revisit this audit once your usage changes.`;
    }
    return `This audit found approximately ${numberDisplay(auditData.totalMonthlySavings)} of monthly savings across your AI stack, with ${auditData.recommendations.filter((rec) => rec.savings > 0).length} opportunities to downgrade or switch plans.`;
  }

  function updateTool(toolKey: string, patch: Partial<ToolInput>) {
    setTools((current) =>
      current.map((tool) => (tool.tool === toolKey ? { ...tool, ...patch } : tool))
    );
  }

  async function handleSaveLead() {
    if (!email) {
      setLeadMessage('Please enter an email to save your report.');
      return;
    }

    setSavingLead(true);
    setLeadMessage('Saving your audit and generating a shareable link...');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company,
          role,
          teamSize,
          useCase,
          tools,
          summary,
          totalMonthlySavings: audit.totalMonthlySavings,
          totalAnnualSavings: audit.totalAnnualSavings
        })
      });

      const data = await response.json();
      setShareUrl(data.shareUrl);
      setLeadMessage('Your audit is saved. Share the public report using the link below.');
    } catch (error) {
      setLeadMessage('Unable to save the report right now. Please try again later.');
    } finally {
      setSavingLead(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="grid gap-8 xl:grid-cols-[1fr_440px]">
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-indigo-600">Spend audit</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Audit your AI tools, keep what works, and cut the rest.
              </h1>
              <p className="mt-4 text-slate-600">
                Enter the tools you pay for today, your plan, monthly spend, seats, and primary use case. The engine will recommend cheaper plans, better alternatives, and realistic savings.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Team size</span>
                <input
                  type="number"
                  min={1}
                  value={teamSize}
                  onChange={(event) => setTeamSize(Number(event.target.value))}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Primary use case</span>
                <select
                  value={useCase}
                  onChange={(event) => setUseCase(event.target.value as UseCase)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                >
                  {USE_CASES.map((caseOption) => (
                    <option key={caseOption} value={caseOption}>
                      {caseOption}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-5">
              {tools.map((tool) => (
                <div key={tool.tool} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{TOOL_DEFINITIONS[tool.tool].name}</h2>
                      <p className="text-sm text-slate-500">{TOOL_DEFINITIONS[tool.tool].useCaseNotes[useCase] ?? 'Choose your plan and spend.'}</p>
                    </div>
                    <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={tool.enabled}
                        onChange={(event) => updateTool(tool.tool, { enabled: event.target.checked })}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600"
                      />
                      Track this tool
                    </label>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-3">
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Plan</span>
                      <select
                        value={tool.plan}
                        disabled={!tool.enabled}
                        onChange={(event) => updateTool(tool.tool, { plan: event.target.value })}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                      >
                        {TOOL_DEFINITIONS[tool.tool].plans.map((plan) => (
                          <option key={plan.key} value={plan.key}>
                            {plan.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Monthly spend</span>
                      <input
                        type="number"
                        disabled={!tool.enabled}
                        min={0}
                        step={5}
                        value={tool.monthlySpend}
                        onChange={(event) => updateTool(tool.tool, { monthlySpend: Number(event.target.value) })}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-medium text-slate-700">Seats</span>
                      <input
                        type="number"
                        disabled={!tool.enabled}
                        min={1}
                        value={tool.seats}
                        onChange={(event) => updateTool(tool.tool, { seats: Number(event.target.value) })}
                        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-slate-900"
                      />
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-slate-900 p-6 text-white shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Total savings</p>
            <div className="mt-4 flex items-end gap-4">
              <div>
                <p className="text-4xl font-semibold">{numberDisplay(audit.totalMonthlySavings)} / mo</p>
                <p className="text-sm text-slate-400">{numberDisplay(audit.totalAnnualSavings)} / year</p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">
              {audit.totalMonthlySavings > 500
                ? 'High savings detected — this is a great opportunity to capture even more value with a Credex review.'
                : audit.totalMonthlySavings > 0
                ? 'This audit found a few practical savings steps for your current stack.'
                : 'Your stack looks well-aligned for your current usage. Keep monitoring spend.'}
            </p>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Personalized summary</p>
            <p className="mt-4 text-slate-700">{summary || 'Loading personalized findings...'}</p>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Save & share</p>
            <div className="mt-4 space-y-4">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Company (optional)</span>
                <input
                  type="text"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                />
              </label>
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Role (optional)</span>
                <input
                  type="text"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900"
                />
              </label>
              <button
                type="button"
                disabled={savingLead}
                onClick={handleSaveLead}
                className="inline-flex w-full justify-center rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {savingLead ? 'Saving report…' : 'Save audit & create public link'}
              </button>
              {leadMessage ? <p className="text-sm text-slate-500">{leadMessage}</p> : null}
              {shareUrl ? (
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  Public link: <a className="text-indigo-600 underline" href={shareUrl}>{shareUrl}</a>
                </div>
              ) : null}
            </div>
          </section>
        </aside>
      </div>

      <section className="mt-10 rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">
        <h2 className="text-xl font-semibold text-slate-900">Per-tool recommendations</h2>
        <div className="mt-6 space-y-4">
          {audit.recommendations.map((recommendation) => (
            <div key={recommendation.tool} className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-base font-semibold text-slate-900">{recommendation.toolName}</p>
                  <p className="mt-1 text-sm text-slate-500">Current spend: {numberDisplay(recommendation.currentSpend)}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700">
                  {recommendation.savings > 0 ? `Save ${numberDisplay(recommendation.savings)}/mo` : 'Optimized'}
                </p>
              </div>
              <div className="mt-4 space-y-2 text-slate-600">
                {recommendation.recommendedPlan ? (
                  <p>Recommended plan: <span className="font-semibold text-slate-900">{recommendation.recommendedPlan}</span></p>
                ) : null}
                {recommendation.alternative ? (
                  <p>Alternative: <span className="font-semibold text-slate-900">{recommendation.alternative}</span></p>
                ) : null}
                <p>{recommendation.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
