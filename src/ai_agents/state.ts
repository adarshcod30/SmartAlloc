import { Annotation } from "@langchain/langgraph";

export const PipelineStateAnnotation = Annotation.Root({
  run_id: Annotation<string>(),
  scenario: Annotation<string>(),
  started_at: Annotation<string>(),
  sample_size: Annotation<number>(),
  window_minutes: Annotation<number>(),
  
  // Data
  resource_requests: Annotation<any[]>(),
  capacity_metrics: Annotation<any[]>(),
  
  // Model Findings
  allocation_anomalies: Annotation<any[]>(),
  bottleneck_risks: Annotation<any[]>(),
  
  // Analysis
  optimization_analysis: Annotation<any[]>(),
  analysis_summary: Annotation<string>(),
  
  // Reallocation Plan
  reallocation_plan: Annotation<any[]>(),
  
  // Results
  auto_rebalanced: Annotation<any[]>(),
  pending_manager_review: Annotation<any[]>(),
  
  errors: Annotation<string[]>(),
});

export type PipelineState = typeof PipelineStateAnnotation.State;
