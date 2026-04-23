// src/aws/dynamo.ts — Local JSON Storage for SmartAlloc
// Local in-memory + file-based storage
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.smartalloc-data');
function ensureDir() { if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true }); }
function readStore(file: string): any[] { 
  ensureDir(); const p = path.join(DATA_DIR, file);
  return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf-8')) : [];
}
function writeStore(file: string, data: any[]) { ensureDir(); fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2)); }

// ── STREAM TABLE ─────────────────────────────────────────────────────────────
export async function putResourceRequest(request: Record<string, unknown>) {
  const items = readStore('stream.json');
  items.push({ pk: `REQUEST#${request.request_id}`, sk: request.created_at || new Date().toISOString(), entity_type: 'resource_request', ...request });
  writeStore('stream.json', items);
}

export async function putCapacityMetric(metric: Record<string, unknown>) {
  const items = readStore('stream.json');
  items.push({ pk: `METRIC#${metric.metric_id}`, sk: metric.created_at || new Date().toISOString(), entity_type: 'capacity_metric', ...metric });
  writeStore('stream.json', items);
}

export async function getRecentRequests(windowMinutes: number = 30) {
  const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  return readStore('stream.json').filter(i => i.entity_type === 'resource_request' && i.sk >= cutoff);
}

export async function getRecentMetrics(windowMinutes: number = 30) {
  const cutoff = new Date(Date.now() - windowMinutes * 60 * 1000).toISOString();
  return readStore('stream.json').filter(i => i.entity_type === 'capacity_metric' && i.sk >= cutoff);
}

export async function getStreamStats() {
  const recent = await getRecentRequests(30);
  return { recent_requests_30m: recent.length };
}

// ── AUDIT TABLE ───────────────────────────────────────────────────────────────
export async function logEvent(runId: string, agent: string, event: string, payload: Record<string, unknown>) {
  const items = readStore('audit.json');
  items.push({ pk: `RUN#${runId}`, sk: `${new Date().toISOString()}#${Math.random().toString(36).slice(2, 8)}`, run_id: runId, agent, event, timestamp: new Date().toISOString(), payload });
  writeStore('audit.json', items);
}

export async function getRunEvents(runId: string) {
  return readStore('audit.json').filter(i => i.pk === `RUN#${runId}`).sort((a, b) => a.sk.localeCompare(b.sk));
}

export async function getAllRuns() {
  return readStore('audit.json')
    .filter(i => i.event === 'run_started')
    .map(i => ({ run_id: i.run_id, timestamp: i.timestamp, scenario: i.payload?.scenario || 'normal' }))
    .sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
}

export async function getActionsForRun(runId: string) {
  return readStore('approvals.json').filter(i => i.run_id === runId);
}

// ── APPROVAL TABLE ────────────────────────────────────────────────────────────
export async function insertPendingActions(actions: Array<Record<string, unknown>>, runId: string) {
  const items = readStore('approvals.json');
  for (const action of actions) {
    items.push({ pk: `ACTION#${action.action_id}`, sk: runId, run_id: runId, status: action.status || 'pending', created_at: new Date().toISOString(), ...action });
  }
  writeStore('approvals.json', items);
}

export async function getPendingActions(runId?: string) {
  let items = readStore('approvals.json').filter(i => i.status === 'pending');
  if (runId) items = items.filter(i => i.run_id === runId);
  return items;
}

export async function updateActionStatus(actionId: string, runId: string, status: 'approved' | 'rejected', reviewedBy: string = 'dashboard_user') {
  const items = readStore('approvals.json');
  const idx = items.findIndex(i => i.pk === `ACTION#${actionId}` && i.sk === runId);
  if (idx >= 0) { items[idx].status = status; items[idx].reviewed_at = new Date().toISOString(); items[idx].reviewed_by = reviewedBy; }
  writeStore('approvals.json', items);
}
