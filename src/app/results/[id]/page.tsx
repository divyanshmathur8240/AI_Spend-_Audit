import { Metadata } from 'next';
import { getPublicAudit } from '@/lib/lead-store';
import type { AuditSnapshot } from '@/lib/types';

interface ResultPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const audit = getPublicAudit(params.id);
  if (!audit) {
    return {
      title: 'Audit not found',
      description: 'The requested AI spend audit was not found.'
    };
  }
  return {
    title: `AI spend audit — $${audit.totalMonthlySavings}/mo savings`,
    description: `See the AI spend report and recommendations for ${audit.teamSize}-person teams.`,
    openGraph: {
      title: `AI spend audit — ${audit.totalMonthlySavings}/mo savings`,
      description: `Review the AI audit and recommended savings opportunities for this stack.`
    },
    twitter: {
      card: 'summary_large_image'
    }
  };
}

export default function ResultPage({ params }: ResultPageProps) {
  const audit = getPublicAudit(params.id);

  if (!audit) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-soft">
          <h1 className="text-3xl font-semibold">Audit not found</h1>
          <p className="mt-4 text-slate-600">This report may have expired or it does not exist.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-indigo-600">AI audit report</p>
              <h1 className="mt-3 text-4xl font-semibold">Shared AI spend audit</h1>
            </div>
            <div className="rounded-3xl bg-slate-900 px-6 py-4 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-300">Savings</p>
              <p className="mt-2 text-3xl font-semibold">${audit.totalMonthlySavings}/mo</p>
            </div>
          </div>
          <p className="mt-4 text-slate-600">This public report shows tool recommendations and estimated savings without revealing the original email or company name.</p>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft">
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Team size</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{audit.teamSize}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 bg-slate-50 p-6">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Primary use case</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{audit.useCase}</p>
            </div>
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-soft">
          <h2 className="text-2xl font-semibold text-slate-900">Audit recommendations</h2>
          <div className="mt-6 space-y-4">
            {audit.recommendations.map((recommendation) => (
              <div key={recommendation.tool} className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{recommendation.toolName}</p>
                    <p className="mt-1 text-sm text-slate-500">Current plan: {recommendation.selectedPlan}</p>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">
                    {recommendation.savings > 0 ? `Save $${recommendation.savings}/mo` : 'Optimized'}
                  </p>
                </div>
                <div className="mt-4 text-slate-700">
                  {recommendation.recommendedPlan ? <p>Recommended plan: {recommendation.recommendedPlan}</p> : null}
                  {recommendation.alternative ? <p>Alternative: {recommendation.alternative}</p> : null}
                  <p className="mt-2">{recommendation.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
