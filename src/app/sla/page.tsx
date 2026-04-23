"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gauge, TrendingUp, AlertTriangle, ArrowDownRight, Activity, BarChart3 } from "lucide-react";

export default function EfficiencyPage() {
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    fetch("/api/runs")
      .then(res => res.json())
      .then(runData => {
        if (runData.runs && runData.runs.length > 0) {
          fetch(`/api/metrics/${runData.runs[0].run_id}`)
            .then(res => res.json())
            .then(data => setMetrics(data?.metrics));
        }
      });
  }, []);

  const wastedUnits = metrics?.total_wasted_units || 0;
  const optimized = metrics?.total_units_optimized || 0;
  const bottlenecks = metrics?.bottleneck_count || 0;
  const criticalBottlenecks = metrics?.critical_bottlenecks || 0;

  return (
    <div className="min-h-screen bg-[#050505] text-white py-12 px-8 selection:bg-emerald-500/30 font-medium">
      <main className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-[0.4em] uppercase mb-8"
          >
            <Gauge className="h-3 w-3" />
            Efficiency Impact Engine
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-6">
            Resource Efficiency <span className="text-white/60 italic">Dashboard.</span>
          </h1>
          <p className="text-white/60 max-w-2xl mx-auto text-xl font-medium tracking-tight leading-relaxed">
            By predicting capacity bottlenecks and autonomously rebalancing idle resources,
            the AI pipeline actively eliminates resource waste in real-time.
          </p>
        </div>

        {/* Hero Impact Metric */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-950 border border-white/10 rounded-[3rem] p-16 text-center mb-12 relative overflow-hidden shadow-2xl group"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
          
          <p className="text-emerald-400 font-black uppercase tracking-[0.5em] text-xs mb-6 opacity-80">Total Resource Units Optimized</p>
          <div className="text-7xl md:text-9xl font-black text-white tracking-tighter mb-8 group-hover:scale-105 transition-transform duration-700">
            {optimized} <span className="text-white/60 text-4xl">units</span>
          </div>
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 font-black text-sm uppercase tracking-widest">
            <TrendingUp className="h-4 w-4" /> 
            Utilization Improvement via AI Rebalancing
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Waste Reduction */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-emerald-500/30 transition-all backdrop-blur-3xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full" />
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
              <BarChart3 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Idle Capacity <span className="text-white/60">Reclaimed</span></h3>
            <p className="text-white/60 mb-8 font-medium leading-relaxed italic pr-8">
              "Resources optimized by detecting over-provisioned pools, rebalancing idle compute/personnel, and preventing waste autonomously."
            </p>
            <div className="flex items-end gap-3 text-5xl font-black text-white">
              {wastedUnits} <span className="text-emerald-400/80 text-lg font-black mb-2">units reclaimed</span>
            </div>
          </motion.div>

          {/* Bottleneck Prevention */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-10 relative overflow-hidden group hover:border-amber-500/30 transition-all backdrop-blur-3xl"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
              <AlertTriangle className="h-8 w-8 text-amber-500" />
            </div>
            <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">Bottlenecks <span className="text-white/60">Prevented</span></h3>
            <p className="text-white/60 mb-8 font-medium leading-relaxed italic pr-8">
              "Capacity shortfalls predicted 24-72h in advance. Resources proactively shifted before services degrade."
            </p>
            <div className="flex items-end gap-3 text-5xl font-black text-white">
              {bottlenecks}
              <span className="text-amber-400/80 text-lg font-black mb-2">pools protected</span>
            </div>
            <div className="mt-4 text-xs font-black text-red-400/80 uppercase tracking-widest">
              {criticalBottlenecks} critical risk pools mitigated
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
