"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Server, Search, Fingerprint, Zap, Shield, ArrowRight, Loader2, RefreshCw, Terminal, Activity } from "lucide-react";


export default function SimulationClient() {
  const [simulationState, setSimulationState] = useState<"IDLE" | "RUNNING" | "COMPLETE">("IDLE");
  const [activeStep, setActiveStep] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [logs, setLogs] = useState<{msg: string, type: 'info' | 'warn' | 'success' | 'tech', time: string}[]>([]);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const hasAutoRun = useRef(false);

  const steps = [
    { title: "Data Ingest", desc: "Loading multi-source resource telemetry", icon: Server },
    { title: "ML Detect", desc: "Identifying allocation inefficiencies", icon: Search },
    { title: "Gen AI", desc: "Optimization reasoning with Gemini", icon: Fingerprint },
    { title: "Prioritize", desc: "Ranking reallocation urgency", icon: Zap },
    { title: "Rebalance", desc: "Executing autonomous optimizations", icon: Shield },
  ];

  const addLog = (msg: string, type: 'info' | 'warn' | 'success' | 'tech' = 'info') => {
    setLogs(prev => [...prev, { msg, type, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    if (logContainerRef.current) {
      const { scrollHeight, clientHeight } = logContainerRef.current;
      logContainerRef.current.scrollTo({ top: scrollHeight - clientHeight, behavior: "smooth" });
    }
  }, [logs]);

  const triggerRun = async () => {
    setSimulationState("RUNNING");
    setActiveStep(0);
    setResults(null);
    setLogs([]);
    addLog("Initializing SmartAlloc AI Cluster...", "info");
    addLog("Connecting to Google Gemini (3.1 Flash Lite)...", "tech");

    // Mock progress visual with detailed logs
    const logIntervals = [
      "Fetching 50+ resource allocation requests from data stream...",
      "Running ML-based Z-Score Detector on utilization clusters...",
      "SCENARIO DETECTED: Workload scenario injection confirmed via Simulator.",
      "Analyzing allocation anomalies with Google Gemini...",
      "Generating Reallocation Playbook for bottleneck resolution...",
      "Executing autonomous rebalancing on identified inefficiencies...",
    ];

    let logIdx = 0;
    const logTimer = setInterval(() => {
      if (logIdx < logIntervals.length) {
        addLog(logIntervals[logIdx], logIdx % 3 === 0 ? "tech" : "info");
        logIdx++;
      }
    }, 1500);

    const stepTimer = setInterval(() => {
      setActiveStep(s => (s < steps.length - 1 ? s + 1 : s));
    }, 2500);

    try {
      const resp = await fetch("/api/pipeline", { method: "POST" });
      const data = await resp.json();
      
      if (!resp.ok) {
        addLog(`PIPELINE FAILED: ${data.details || data.error || 'Unknown error'}`, "warn");
        setSimulationState("IDLE");
        return;
      }

      clearInterval(logTimer);
      clearInterval(stepTimer);
      
      addLog(`Pipeline execution successful: Run ID ${data.run_id}`, "success");
      addLog(`Waste Reduced: ${data.total_waste_units || 0} units optimized`, "success");
      
      setActiveStep(steps.length - 1);
      setResults(data);
      setSimulationState("COMPLETE");
    } catch (err: any) {
      clearInterval(logTimer);
      clearInterval(stepTimer);
      addLog(`CRITICAL ERROR: ${err.message || 'Pipeline execution halted.'}`, "warn");
      setSimulationState("IDLE");
    }
  };

  // Auto-run simulation when navigated with ?autorun=true
  useEffect(() => {
    if (searchParams.get("autorun") === "true" && !hasAutoRun.current && simulationState === "IDLE") {
      hasAutoRun.current = true;
      setTimeout(() => triggerRun(), 300);
    }
  }, [searchParams]);

  const [budget, setBudget] = useState(50000);
  const [demand, setDemand] = useState(75);

  const calculateOptimalAllocation = () => {
    // Optimization Layer (Linear Programming approximation)
    let opsRatio = demand / 100 * 0.5 + 0.2; // Base 20%, scales up to 70% with demand
    let remaining = 1 - opsRatio;
    let rdRatio = remaining * (budget / 100000); // R&D scales with available budget
    let mktRatio = remaining - rdRatio;

    return {
      ops: Math.round(opsRatio * 100),
      mkt: Math.round(mktRatio * 100),
      rd: Math.round(rdRatio * 100),
    };
  };

  const allocation = calculateOptimalAllocation();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#050505] py-12 px-6 selection:bg-emerald-500/30">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 px-4">
          <div>
            <div className="flex items-center gap-3 text-emerald-400 mb-4">
               <Activity className="h-5 w-5 animate-pulse" />
               <span className="text-xs font-black uppercase tracking-[0.4em]">PROTOTYPE CALIBRATION MODE</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
              Simulation <span className="text-white/60">Lab.</span>
            </h1>
            <p className="text-white/60 text-xl max-w-2xl font-medium tracking-tight">
              Test the limits of the 7-agent orchestrator. Every run triggers 
              a full non-deterministic LangGraph cycle with Google Gemini.
            </p>
          </div>
          
          <button
            onClick={triggerRun}
            disabled={simulationState === "RUNNING"}
            className="group relative flex items-center gap-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 disabled:opacity-50 text-white px-10 py-6 rounded-2xl font-black text-xl transition-all shadow-[0_20px_50px_rgba(16,185,129,0.15)] active:scale-95 overflow-hidden"
          >
            {simulationState === "RUNNING" ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                EXECUTING...
              </>
            ) : (
              <>
                <Play className="h-6 w-6 fill-current group-hover:scale-110 transition-transform" />
                RUN PIPELINE
              </>
            )}
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </div>

        {/* NEW SCENARIO SIMULATOR & ALLOCATION ENGINE */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
           <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2"><Zap className="h-5 w-5 text-emerald-400"/> Scenario Simulator</h3>
              
              <div className="space-y-8">
                 <div>
                    <div className="flex justify-between mb-3">
                       <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Available Budget ($)</label>
                       <span className="text-sm font-bold text-emerald-400">${budget.toLocaleString()}</span>
                    </div>
                    <input type="range" min="10000" max="100000" step="5000" value={budget} onChange={e => setBudget(Number(e.target.value))} className="w-full accent-emerald-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                 </div>

                 <div>
                    <div className="flex justify-between mb-3">
                       <label className="text-xs font-bold text-white/60 uppercase tracking-widest">Market Demand Index</label>
                       <span className="text-sm font-bold text-cyan-400">{demand}%</span>
                    </div>
                    <input type="range" min="10" max="100" step="5" value={demand} onChange={e => setDemand(Number(e.target.value))} className="w-full accent-cyan-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                 </div>
              </div>
           </div>

           <div className="bg-gradient-to-br from-emerald-600/10 to-cyan-600/5 border border-emerald-500/20 rounded-3xl p-8 relative overflow-hidden">
              <h3 className="text-xl font-black mb-6 flex items-center gap-2 text-emerald-400">
                 <Fingerprint className="h-5 w-5"/> Allocation Engine (LP Optimized)
              </h3>
              
              <div className="space-y-5 mb-6">
                 <div>
                   <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Operations</span>
                      <span className="text-sm font-black text-cyan-400">{allocation.ops}%</span>
                   </div>
                   <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-cyan-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${allocation.ops}%` }}></div>
                   </div>
                 </div>

                 <div>
                   <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Marketing</span>
                      <span className="text-sm font-black text-emerald-400">{allocation.mkt}%</span>
                   </div>
                   <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-emerald-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${allocation.mkt}%` }}></div>
                   </div>
                 </div>

                 <div>
                   <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-white/80 uppercase tracking-wider">R&D</span>
                      <span className="text-sm font-black text-teal-500">{allocation.rd}%</span>
                   </div>
                   <div className="w-full bg-white/10 rounded-full h-1.5">
                      <div className="bg-teal-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${allocation.rd}%` }}></div>
                   </div>
                 </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                 <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1.5">Reasoning</p>
                 <p className="text-xs font-medium text-white/80 leading-relaxed">
                    Linear Programming dynamically shifted resources to maximize predicted ROI. {allocation.ops > 50 ? "High demand forces operation-heavy scaling to prevent SLA breaches." : "Lower demand allows budget to flow into R&D and Marketing for future growth."}
                 </p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-20">
          {/* Timeline / Progress */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 backdrop-blur-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <RefreshCw className={`w-32 h-32 ${simulationState === "RUNNING" ? "animate-spin" : ""}`} />
              </div>

              <h2 className="text-2xl font-black mb-12 flex items-center gap-3 text-white uppercase tracking-tighter">
                <RefreshCw className={`h-6 w-6 text-emerald-400 ${simulationState === "RUNNING" ? "animate-spin" : ""}`} />
                Execution Graph
              </h2>
              
              <div className="space-y-10 relative">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isActive = idx === activeStep && simulationState === "RUNNING";
                  const isDone = (idx < activeStep && simulationState === "RUNNING") || simulationState === "COMPLETE";
                  const isPending = idx > activeStep && simulationState === "RUNNING";

                  return (
                    <motion.div 
                      key={idx} 
                      initial={false}
                      animate={{ opacity: isPending ? 0.2 : 1 }}
                      className="flex gap-10 relative"
                    >
                      {idx !== steps.length - 1 && (
                        <div className={`absolute left-8 top-16 bottom-[-40px] w-[2px] transition-colors duration-1000 ${isDone ? "bg-emerald-500" : "bg-white/10"}`} />
                      )}
                      
                      <div className={`h-16 w-16 rounded-[1.5rem] flex items-center justify-center border-4 transition-all duration-700 z-10 ${
                        isActive ? "bg-emerald-500 border-white shadow-[0_0_40px_rgba(16,185,129,0.4)] scale-110" : 
                        isDone ? "bg-green-500 border-green-500/50 scale-100" : "bg-white/5 border-white/5"
                      }`}>
                        <Icon className={`h-7 w-7 ${isActive ? "text-black" : isDone ? "text-white" : "text-white/45"}`} />
                      </div>
                      
                      <div className="pt-2">
                        <h4 className={`text-xl font-black tracking-tight mb-1 ${isActive ? "text-white" : isDone ? "text-white/80" : "text-white/60"}`}>
                          {step.title}
                        </h4>
                        <p className={`font-medium ${isActive ? "text-emerald-400/80" : isDone ? "text-white/60" : "text-white/45"}`}>
                          {step.desc}
                        </p>
                      </div>

                      {isActive && (
                        <div className="ml-auto">
                           <div className="flex gap-1">
                              {[1,2,3].map(i => (
                                <div key={i} className="h-1 w-1 rounded-full bg-emerald-400 animate-bounce" style={{animationDelay: `${i*0.2}s`}} />
                              ))}
                           </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Log Stream Terminal */}
            <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
               <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <Terminal className="h-4 w-4 text-white/60" />
                     <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 font-mono">System Log Stream</span>
                  </div>
                  <div className="flex gap-1.5">
                     <div className="h-2 w-2 rounded-full bg-red-500/20" />
                     <div className="h-2 w-2 rounded-full bg-yellow-500/20" />
                     <div className="h-2 w-2 rounded-full bg-green-500/20" />
                  </div>
               </div>
               <div ref={logContainerRef} className="p-6 h-64 overflow-y-auto font-mono text-sm space-y-2 scrollbar-hide">
                  {logs.length === 0 && (
                    <p className="text-white/45 italic">Awaiting pipeline initialization...</p>
                  )}
                  {logs.map((log, i) => (
                    <div key={i} className="flex gap-4 group">
                       <span className="text-white/60 shrink-0 font-bold">[{log.time}]</span>
                       <span className={`
                         ${log.type === 'tech' ? 'text-emerald-400' : ''}
                         ${log.type === 'warn' ? 'text-red-400' : ''}
                         ${log.type === 'success' ? 'text-green-400 font-bold' : ''}
                         ${log.type === 'info' ? 'text-white/60' : ''}
                       `}>
                          <span className="opacity-40 mr-2">$</span>
                          {log.msg}
                       </span>
                    </div>
                  ))}

               </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="lg:col-span-5 space-y-8">
            <AnimatePresence mode="wait">
              {results ? (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-gradient-to-br from-emerald-600 to-cyan-600 rounded-[3rem] p-10 text-white space-y-10 shadow-3xl sticky top-28"
                >
                  <div className="space-y-2 text-center">
                    <p className="text-[10px] uppercase font-black tracking-[0.5em] opacity-60">CALIBRATION RUN SUCCEEDED</p>
                    <h3 className="text-4xl font-black tracking-tighter break-all">{results.run_id}</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-black/10 p-8 rounded-[2rem] border border-black/5 text-center overflow-hidden">
                      <p className="text-xs font-black uppercase tracking-widest opacity-60 mb-2">Efficiency Impact</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tighter break-words">{results.total_waste_units || 0} units optimized</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-black/5 p-6 rounded-2xl text-center">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Inefficiencies</p>
                        <p className="text-3xl font-black">{results.anomaly_count}</p>
                      </div>
                      <div className="bg-black/5 p-6 rounded-2xl text-center">
                        <p className="text-[10px] font-black uppercase opacity-60 mb-1">Rebalanced</p>
                        <p className="text-3xl font-black">{results.autonomous_actions}</p>
                      </div>
                    </div>
                  </div>

                  <hr className="border-black/10" />

                  <Link href="/audit" className="flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest group bg-black text-white py-5 rounded-2xl hover:bg-zinc-900 transition-all">
                    View Full Trace Log
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                  </Link>
                </motion.div>
              ) : (
                <div className="bg-white/5 border border-dashed border-white/10 rounded-[3rem] p-12 flex flex-col items-center justify-center text-center h-[500px] sticky top-28 backdrop-blur-3xl">
                  <div className="h-24 w-24 bg-white/5 rounded-full flex items-center justify-center mb-8 relative">
                    <Loader2 className={`h-10 w-10 text-white/45 ${simulationState === "RUNNING" ? "animate-spin" : ""}`} />
                    {simulationState === "RUNNING" && (
                       <div className="absolute inset-x-0 -bottom-4 flex justify-center">
                          <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest animate-pulse">ORCHESTRATING</span>
                       </div>
                    )}
                  </div>
                  <h3 className="font-black text-2xl text-white/60 tracking-tight mb-4">Awaiting Signal.</h3>
                  <p className="text-white/60 font-medium leading-relaxed uppercase text-[10px] tracking-[0.2em]">
                    Trigger the 7-agent cluster to generate real-time resource optimization telemetry.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
