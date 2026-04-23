// src/synthetic_data_engine/simulator.ts
// Smart Resource Allocation — Synthetic Workload Generator

export const SCENARIOS = {
  normal:          { overAllocRate: 0.04, spikeFactor: [1.3, 2.0], bottleneckRate: 0.15, teamUtilization: 0.65, requestVolume: 12 },
  peak_sprint:     { overAllocRate: 0.12, spikeFactor: [2.0, 4.0], bottleneckRate: 0.45, teamUtilization: 0.92, requestVolume: 35 },
  team_scaling:    { overAllocRate: 0.08, spikeFactor: [1.5, 3.0], bottleneckRate: 0.30, teamUtilization: 0.55, requestVolume: 20 },
  cloud_migration: { overAllocRate: 0.15, spikeFactor: [3.0, 8.0], bottleneckRate: 0.40, teamUtilization: 0.78, requestVolume: 28 },
  product_launch:  { overAllocRate: 0.10, spikeFactor: [2.5, 6.0], bottleneckRate: 0.50, teamUtilization: 0.88, requestVolume: 40 },
  quarter_end:     { overAllocRate: 0.07, spikeFactor: [1.8, 4.5], bottleneckRate: 0.35, teamUtilization: 0.72, requestVolume: 22 },
} as const

type ScenarioKey = keyof typeof SCENARIOS

export function getRandomScenario(): ScenarioKey {
  const keys = Object.keys(SCENARIOS) as ScenarioKey[]
  return keys[Math.floor(Math.random() * keys.length)]
}

// --- Resource Pools ---
const RESOURCE_TYPES = ['GPU_Compute', 'CPU_Compute', 'Memory', 'Storage', 'Personnel', 'Budget'] as const
const DEPARTMENTS = ['Engineering', 'Data Science', 'DevOps', 'Product', 'QA', 'Infrastructure', 'ML Platform'] as const
const PROJECTS = [
  'Project Atlas', 'Project Nova', 'Project Titan', 'Project Echo', 'Project Zenith',
  'Project Apex', 'Project Helix', 'Project Quantum', 'Project Nexus', 'Project Falcon',
  'Project Iris', 'Project Cortex', 'Project Vortex', 'Project Nebula', 'Project Pinnacle',
]

function generateResourcePools(size = 40) {
  return Array.from({ length: size }, (_, i) => ({
    id:         `POOL-${String(i).padStart(3, '0')}`,
    name:       `${DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)]} Pool ${i + 1}`,
    baseCapacity: Math.floor(50 + Math.random() * 200),
    type:       RESOURCE_TYPES[Math.floor(Math.random() * RESOURCE_TYPES.length)],
    department: DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)],
  }))
}

// --- Types ---
export interface ResourceRequest {
  request_id:       string
  project_name:     string
  department:       string
  resource_type:    typeof RESOURCE_TYPES[number]
  requested_units:  number
  allocated_units:  number
  utilization_pct:  number
  priority:         string
  requester:        string
  anomaly_type:     'normal' | 'over_allocated' | 'under_utilized' | 'bottleneck'
  is_anomaly:       number
  created_at:       string
}

export interface CapacityMetric {
  metric_id:             string
  resource_pool:         string
  resource_type:         typeof RESOURCE_TYPES[number]
  department:            string
  total_capacity:        number
  current_usage:         number
  predicted_demand_24h:  number
  bottleneck_probability: number
  team_size:             number
  sprint_day:            number
  is_bottleneck:         number
  waste_units:           number
  created_at:            string
}

export interface SimulatorOutput {
  requests:         ResourceRequest[]
  metrics:          CapacityMetric[]
  scenario:         ScenarioKey
  total_waste:      number
  anomaly_count:    number
  bottleneck_count: number
  timestamp:        string
}

function randomBetween(lo: number, hi: number): number {
  return lo + Math.random() * (hi - lo)
}

function lognormal(mean: number, sigma: number): number {
  const u1 = Math.random(), u2 = Math.random()
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2)
  return Math.exp(mean + sigma * z)
}

function generateResourceRequest(
  pool: ReturnType<typeof generateResourcePools>[0],
  scenario: typeof SCENARIOS[ScenarioKey]
): ResourceRequest {
  const baseUnits = pool.baseCapacity
  let requested = Math.round(baseUnits * lognormal(0, 0.2))
  let allocated = requested
  let atype: ResourceRequest['anomaly_type'] = 'normal'
  let isAnom = 0
  let utilization = 0.5 + Math.random() * 0.4 // 50-90% normal

  const roll = Math.random()

  if (roll < 0.03) {
    // Over-allocated: allocated >> actual need
    allocated = Math.round(requested * randomBetween(2.0, 4.0))
    utilization = 0.1 + Math.random() * 0.25 // 10-35% utilization = waste
    atype = 'over_allocated'
    isAnom = 1
  } else if (roll < 0.06) {
    // Under-utilized: normal allocation but barely used
    utilization = 0.05 + Math.random() * 0.15 // 5-20% utilization
    atype = 'under_utilized'
    isAnom = 1
  } else if (roll < scenario.overAllocRate) {
    // Bottleneck: demand > allocation
    requested = Math.round(baseUnits * randomBetween(scenario.spikeFactor[0], scenario.spikeFactor[1]))
    allocated = Math.round(requested * (0.3 + Math.random() * 0.3)) // only 30-60% fulfilled
    utilization = 0.95 + Math.random() * 0.05 // 95-100% — maxed out
    atype = 'bottleneck'
    isAnom = 1
  }

  const firstNames = ['Aarav', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Kavya', 'Arjun', 'Divya', 'Rohan', 'Ananya']
  const lastNames  = ['Sharma', 'Patel', 'Kumar', 'Singh', 'Mehta', 'Joshi', 'Gupta', 'Rao', 'Verma', 'Nair']
  const requester  = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`

  return {
    request_id:      `REQ-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    project_name:    PROJECTS[Math.floor(Math.random() * PROJECTS.length)],
    department:      pool.department,
    resource_type:   pool.type,
    requested_units: requested,
    allocated_units: allocated,
    utilization_pct: Math.round(utilization * 1000) / 10,
    priority:        Math.random() < 0.05 ? 'P1' : Math.random() < 0.20 ? 'P2' : Math.random() < 0.70 ? 'P3' : 'P4',
    requester,
    anomaly_type:    atype,
    is_anomaly:      isAnom,
    created_at:      new Date().toISOString(),
  }
}

function generateCapacityMetric(
  scenario: typeof SCENARIOS[ScenarioKey]
): CapacityMetric {
  const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)]
  const resourceType = RESOURCE_TYPES[Math.floor(Math.random() * RESOURCE_TYPES.length)]
  const totalCap = Math.floor(100 + Math.random() * 500)
  const usage = Math.round(totalCap * (scenario.teamUtilization + (Math.random() - 0.5) * 0.3))
  const predicted = Math.round(usage * (1 + (Math.random() * 0.4 - 0.1))) // -10% to +30% growth
  const isBottleneck = Math.random() < scenario.bottleneckRate ? 1 : 0
  const bottleneckProb = isBottleneck
    ? parseFloat((0.7 + Math.random() * 0.29).toFixed(2))
    : parseFloat((Math.random() * 0.3).toFixed(2))

  const wasteUnits = Math.max(0, Math.round(totalCap - usage) * (usage / totalCap < 0.4 ? 1 : 0))

  return {
    metric_id:              `CAP-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
    resource_pool:          `${department} ${resourceType} Pool`,
    resource_type:          resourceType,
    department,
    total_capacity:         totalCap,
    current_usage:          Math.min(usage, totalCap),
    predicted_demand_24h:   predicted,
    bottleneck_probability: bottleneckProb,
    team_size:              Math.floor(3 + Math.random() * 25),
    sprint_day:             Math.floor(1 + Math.random() * 14),
    is_bottleneck:          isBottleneck,
    waste_units:            wasteUnits,
    created_at:             new Date().toISOString(),
  }
}

export function runSimulation(
  nRequests: number = 50,
  nMetrics:  number = 15,
  forceScenario?: ScenarioKey,
): SimulatorOutput {
  const scenarioKey = forceScenario || getRandomScenario()
  const scenario    = SCENARIOS[scenarioKey]
  const pools       = generateResourcePools(40)

  // Inject a demand burst 1 in every 5 runs (20% chance)
  const burst = Math.random() < 0.20
  if (burst) {
    nRequests += Math.floor(randomBetween(5, 12))
    console.log('[Simulator] DEMAND BURST EVENT — injecting extra requests this run')
  }

  const requests = Array.from({ length: nRequests }, () =>
    generateResourceRequest(pools[Math.floor(Math.random() * pools.length)], scenario)
  )

  const metrics = Array.from({ length: nMetrics }, () =>
    generateCapacityMetric(scenario)
  )

  const anomalies = requests.filter(r => r.is_anomaly)
  const totalWaste = requests.reduce((sum, r) => {
    if (r.anomaly_type === 'over_allocated' || r.anomaly_type === 'under_utilized') {
      return sum + Math.max(0, r.allocated_units - Math.round(r.allocated_units * r.utilization_pct / 100))
    }
    return sum
  }, 0)

  return {
    requests,
    metrics,
    scenario:         scenarioKey,
    total_waste:      totalWaste,
    anomaly_count:    anomalies.length,
    bottleneck_count: metrics.filter(m => m.is_bottleneck).length,
    timestamp:        new Date().toISOString(),
  }
}
