import { StateGraph, END, START } from "@langchain/langgraph";
import { v4 as uuidv4 } from 'uuid';
import { PipelineStateAnnotation, PipelineState } from './state';
import { 
  ingestionNode, 
  anomalyNode, 
  slaNode, 
  analysisNode, 
  actionNode, 
  auditNode 
} from './nodes';
import { logEvent } from '../aws/dynamo';

const createGraph = () => {
  const workflow = new StateGraph(PipelineStateAnnotation)
    .addNode('ingest', ingestionNode)
    .addNode('detect', anomalyNode)
    .addNode('forecast', slaNode)
    .addNode('analyze', analysisNode)
    .addNode('act', actionNode)
    .addNode('audit', auditNode);

  workflow.addEdge(START, 'ingest');
  workflow.addEdge('ingest', 'detect');
  workflow.addEdge('detect', 'forecast');
  workflow.addEdge('forecast', 'analyze');
  workflow.addEdge('analyze', 'act');
  workflow.addEdge('act', 'audit');
  workflow.addEdge('audit', END);

  return workflow.compile();
};

export const runPipeline = async (windowMinutes: number = 30, externalRunId?: string, scenario: string = 'normal') => {
  const runId = externalRunId || uuidv4().substring(0, 8).toUpperCase();
  const startedAt = new Date().toISOString();

  console.log(`\n${'='.repeat(60)}`);
  console.log(`  🧠 SmartAlloc AI Pipeline — Run ${runId} (Scenario: ${scenario})`);
  console.log(`${'='.repeat(60)}`);

  await logEvent(runId, 'orchestrator', 'run_started', {
    window_minutes: windowMinutes,
    environment: 'production',
    scenario,
  });

  const initialState: Partial<PipelineState> = {
    run_id: runId,
    scenario,
    started_at: startedAt,
    window_minutes: windowMinutes,
    sample_size: 50,
    resource_requests: [],
    capacity_metrics: [],
    allocation_anomalies: [],
    bottleneck_risks: [],
    optimization_analysis: [],
    analysis_summary: '',
    reallocation_plan: [],
    auto_rebalanced: [],
    pending_manager_review: [],
    errors: [],
  };

  const app = createGraph();
  const result = await app.invoke(initialState as PipelineState);

  console.log(`\n  ✅ Pipeline complete — Run ${runId}`);
  return result;
};

if (require.main === module) {
  runPipeline(30).catch(console.error);
}
