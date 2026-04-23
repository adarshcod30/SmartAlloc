"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, AlertCircle, RefreshCw, Activity } from "lucide-react";

export default function AnomaliesPage() {
  const [anomalies, setAnomalies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs")
      .then((res) => res.json())
      .then((runData) => {
        if (runData.runs && runData.runs.length > 0) {
          const runId = runData.runs[0].run_id;
          return fetch(`/api/audit/${runId}`);
        }
      })
      .then((res) => res?.json())
      .then((data) => {
        if (data?.events) {
          const detEvent = data.events.find((log: any) => log.event === "anomalies_detected");
          if (detEvent?.payload?.anomalies) {
            setAnomalies(detEvent.payload.anomalies.map((a: any) => ({
              ...a,
              request_id: a.request_id || a.entity_id || 'N/A',
              anomaly_type: a.anomaly_type || 'over_allocated',
              project_name: a.project_name || 'Unknown Project',
              department: a.department || 'Engineering',
              resource_type: a.resource_type || 'CPU_Compute',
              utilization_pct: a.utilization_pct || 0,
              wasted_units: a.wasted_units || 0,
              z_score: a.z_score || 0,
            })));
          }
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-8 selection:bg-emerald-500/30">
      <main className="container mx-auto max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 text-red-500 mb-4">
               <AlertTriangle className="h-5 w-5 fill-current" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Real-Time Allocation Analysis</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6">
              Allocation <span className="text-white/60">Anomalies.</span>
            </h1>
            <p className="text-white/60 text-xl font-medium tracking-tight leading-relaxed">
              SmartAlloc&apos;s ML algorithms scan 100% of resource allocations for inefficiencies.
              Every over-provisioned pool, idle resource, and capacity bottleneck is flagged for optimization.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-3xl">
             <RefreshCw className={`h-3 w-3 text-emerald-400 ${loading ? 'animate-spin' : ''}`} />
             <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Live Feed Active</span>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900/50 border border-white/10 rounded-[2rem] p-8 backdrop-blur-3xl hover:border-emerald-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
               <Info className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">ML Detection Logic</h3>
            <p className="text-white/60 font-medium leading-relaxed italic">
              &quot;Z-Score statistical engine computes per-resource-type utilization baselines. Any allocation deviating &gt;1.8σ from its pool mean is flagged as anomalous.&quot;
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-zinc-900/50 border border-white/10 rounded-[2rem] p-8 backdrop-blur-3xl hover:border-red-500/30 transition-all"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
               <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tighter">Anomaly Thresholds</h3>
            <p className="text-white/60 font-medium leading-relaxed italic">
              &quot;Over-allocated resources (&gt;2× needed), under-utilized pools (&lt;20% usage), and capacity bottlenecks (&gt;95% usage) are escalated for rebalancing.&quot;
            </p>
          </motion.div>
        </div>

        {/* Anomaly Table */}
        <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
          <div className="px-10 py-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <h2 className="text-xl font-black flex items-center gap-3 uppercase tracking-tighter">
              <Activity className="h-5 w-5 text-red-500" /> 
              Active Anomaly Stream
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/[0.02] text-white/60 text-[10px] font-black uppercase tracking-[0.3em] border-b border-white/5">
                  <th className="px-10 py-6">Request / Project</th>
                  <th className="px-10 py-6">Anomaly Type</th>
                  <th className="px-10 py-6">Department</th>
                  <th className="px-10 py-6 text-right">Utilization / Waste</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center">
                      <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4 opacity-20" />
                      <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Scanning allocations...</span>
                    </td>
                  </tr>
                ) : anomalies.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-10 py-24 text-center font-bold text-white/60 uppercase tracking-widest italic">
                      No allocation anomalies detected. Run the pipeline first.
                    </td>
                  </tr>
                ) : anomalies.map((a, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-10 py-8">
                       <div className="font-mono text-[10px] text-white/50 uppercase tracking-widest mb-1">{a.request_id}</div>
                       <div className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase text-sm">{a.project_name}</div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-3 py-1 text-[9px] font-black rounded-full border uppercase tracking-widest ${
                        a.anomaly_type === 'over_allocated' ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                        a.anomaly_type === 'under_utilized' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        a.anomaly_type === 'bottleneck' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                        'bg-blue-500/10 text-blue-400 border-blue-500/20'
                      }`}>
                        {a.anomaly_type.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex flex-col gap-1 max-w-sm">
                        <span className="text-sm font-black text-white/80">{a.department}</span>
                        <span className="text-xs text-white/50 font-medium">{a.resource_type} · Z-Score: {a.z_score}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                       <div className="text-2xl font-black text-red-400 leading-none mb-1">
                         {a.utilization_pct}%
                       </div>
                       <div className="text-[10px] font-black text-white/60 uppercase tracking-widest">{a.wasted_units} units wasted</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
