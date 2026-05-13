import type { AuditSnapshot } from './types';

const store = new Map<string, AuditSnapshot>();

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export function persistAudit(snapshot: AuditSnapshot) {
  store.set(snapshot.id, snapshot);
  return snapshot.id;
}

export function getAudit(id: string) {
  return store.get(id) ?? null;
}

export function getPublicAudit(id: string) {
  const snapshot = getAudit(id);
  if (!snapshot) return null;
  const { email, company, role, ...publicSnapshot } = snapshot;
  return publicSnapshot;
}

export function createAuditSnapshot(payload: Omit<AuditSnapshot, 'id' | 'createdAt'>) {
  const id = generateId();
  const createdAt = new Date().toISOString();
  const snapshot: AuditSnapshot = { id, createdAt, ...payload };
  persistAudit(snapshot);
  return snapshot;
}
