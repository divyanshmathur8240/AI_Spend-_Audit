import { NextResponse } from 'next/server';
import { createAuditSnapshot } from '@/lib/lead-store';
import type { AuditSnapshot, ToolInput } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tools: ToolInput[] = body.tools ?? [];
    const snapshot = createAuditSnapshot({
      teamSize: body.teamSize ?? 1,
      useCase: body.useCase ?? 'mixed',
      tools,
      summary: body.summary ?? '',
      totalMonthlySavings: body.totalMonthlySavings ?? 0,
      totalAnnualSavings: body.totalAnnualSavings ?? 0,
      email: body.email ?? '',
      company: body.company ?? '',
      role: body.role ?? ''
    } as AuditSnapshot);

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/results/${snapshot.id}`;
    return NextResponse.json({ id: snapshot.id, shareUrl });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
