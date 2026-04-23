import { NextResponse } from 'next/server';
import { getRunEvents } from '@/services/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { runId: string } }
) {
  try {
    const events = await getRunEvents(params.runId);
    
    // Synthesize metrics from events
    const anomalies = events.find(e => e.event === 'anomalies_detected')?.payload || {};
    const bottlenecks = events.find(e => e.event === 'bottlenecks_predicted')?.payload || {};
    const audit = events.find(e => e.event === 'run_complete')?.payload || {};
    const actions = events.find(e => e.event === 'execution_complete')?.payload || {};

    const metrics = {
      run_id: params.runId,
      anomaly_count: anomalies.count || 0,
      total_wasted_units: anomalies.total_wasted_units || 0,
      bottleneck_count: bottlenecks.count || 0,
      critical_bottlenecks: bottlenecks.critical_count || 0,
      total_overflow: bottlenecks.total_overflow || 0,
      total_actions: (actions.auto_rebalanced_count || 0) + (actions.pending_review_count || 0),
      total_units_optimized: audit.total_units_optimized || 0,
      avg_utilization: audit.avg_utilization || 0,
    };

    return NextResponse.json({ metrics });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
