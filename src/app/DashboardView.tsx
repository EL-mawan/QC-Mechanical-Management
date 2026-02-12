"use client"

import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  FileText,
  Flame,
  Box,
  Droplets,
  Zap,
  LayoutDashboard,
  ShieldCheck,
  Search,
  ArrowRight
} from "lucide-react"
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as any

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
} as any

export function DashboardView({ metrics }: { metrics: any }) {
  // Mock data for charts - in real app, this would come from props or a separate fetching logic
  const performanceData = [
    { name: 'Mon', completion: 65, repair: 2.1 },
    { name: 'Tue', completion: 72, repair: 1.8 },
    { name: 'Wed', completion: 68, repair: 2.5 },
    { name: 'Thu', completion: 85, repair: 1.5 },
    { name: 'Fri', completion: 92, repair: 1.2 },
    { name: 'Sat', completion: 88, repair: 1.4 },
    { name: 'Sun', completion: 95, repair: 1.1 },
  ]

  const categoryDistribution = [
    { name: 'IR', value: metrics.ir.total, color: '#3b82f6' },
    { name: 'Welds', value: metrics.welding.total, color: '#f97316' },
    { name: 'Material', value: metrics.material.received, color: '#a855f7' },
    { name: 'Hydro', value: metrics.hydrotest.ready, color: '#06b6d4' },
  ]

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8 xl:p-10 selection:bg-teal-100 selection:text-teal-900">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-[1600px] mx-auto space-y-10 sm:space-y-14"
          >
            {/* 1. Header & Quick Actions */}
            <motion.div variants={itemVariants} className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 rounded-full w-fit border border-teal-100/50">
                  <Zap className="h-3 w-3 fill-current" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Live Operations Hub</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-3xl xl:text-5xl font-black text-[#0f2d2b] tracking-tighter leading-none">
                  Project Command Center
                </h1>
                <p className="text-slate-500 text-sm sm:text-base font-medium max-w-2xl">
                  Monitoring <span className="text-teal-600 font-bold underline decoration-teal-200 underline-offset-4">Mechanical QC Strategy</span> across all disciplines. 
                  Real-time data synchronization active.
                </p>
              </div>
              
              <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                <div className="flex items-center gap-3 bg-white p-2.5 sm:p-3 rounded-2xl shadow-sm border border-slate-100/80 backdrop-blur-xl grow lg:grow-0">
                   <div className="bg-emerald-50 text-emerald-600 p-2 rounded-xl border border-emerald-100/50 relative">
                     <Clock className="h-4 w-4" />
                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                   </div>
                   <div className="pr-2 border-r border-slate-100 last:border-none">
                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Syncing</p>
                     <p className="text-xs font-black text-slate-800 mt-1">Live Feed</p>
                   </div>
                   <div className="px-2">
                     <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">Status</p>
                     <p className="text-xs font-black text-emerald-600 mt-1">Operational</p>
                   </div>
                </div>
                <button className="h-12 w-12 rounded-2xl bg-[#0f2d2b] text-white flex items-center justify-center hover:bg-teal-900 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-teal-900/10 shrink-0">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* 2. Primary KPI Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              <KPISection 
                title="A. IR Summary" 
                icon={FileText} 
                accColor="blue"
                metrics={[
                  { label: "Total IR", value: metrics.ir.total, highlight: true },
                  { label: "Approve", value: metrics.ir.approved, icon: CheckCircle2, status: "pass" },
                  { label: "Wait", value: metrics.ir.pending, icon: Clock, status: "warn" },
                  { label: "Rej", value: metrics.ir.rejected, icon: AlertTriangle, status: "fail" }
                ]}
              />
              <KPISection 
                title="B. Welding" 
                icon={Flame} 
                accColor="orange"
                metrics={[
                  { label: "Total Joints", value: metrics.welding.total, highlight: true },
                  { label: "NDT %", value: `${metrics.welding.ndtPassed}%`, icon: ShieldCheck, status: "pass" },
                  { label: "Repair", value: `${metrics.welding.repairRate}%`, icon: Activity, status: "fail" },
                  { label: "Done", value: metrics.welding.completed, icon: CheckCircle2, status: "pass" }
                ]}
              />
              <KPISection 
                title="C. Materials" 
                icon={Box} 
                accColor="purple"
                metrics={[
                  { label: "Received", value: metrics.material.received, highlight: true },
                  { label: "Hold", value: metrics.material.hold, icon: AlertTriangle, status: "fail" },
                  { label: "MTC", value: metrics.material.missingMTC, icon: FileText, status: "warn" },
                  { label: "Vrf", value: metrics.material.received - metrics.material.hold, icon: ShieldCheck, status: "pass" }
                ]}
              />
              <KPISection 
                title="D. Hydrotest" 
                icon={Droplets} 
                accColor="cyan"
                metrics={[
                  { label: "Ready", value: metrics.hydrotest.ready, highlight: true },
                  { label: "Tested", value: metrics.hydrotest.tested, icon: Activity, status: "pass" },
                  { label: "Fail", value: metrics.hydrotest.failed, icon: AlertTriangle, status: "fail" },
                  { label: "Appr", value: metrics.hydrotest.approved, icon: CheckCircle2, status: "pass" }
                ]}
              />
            </div>

            {/* 3. Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Performance Trend */}
              <motion.div variants={itemVariants} className="lg:col-span-2">
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden flex flex-col h-full border border-slate-100/50">
                  <div className="p-8 pb-0 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        <Activity className="h-5 w-5 text-teal-600" />
                        Operational Performance
                      </h3>
                      <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">7-Day Progress Tracking</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-teal-500" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Completion</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="text-[10px] font-black uppercase text-slate-500">Repairs</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 min-h-[300px] p-4 sm:p-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={performanceData}>
                        <defs>
                          <linearGradient id="colorComp" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} 
                          dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="completion" 
                          stroke="#14b8a6" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorComp)" 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="repair" 
                          stroke="#fb7185" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          fill="transparent" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              {/* Data Distribution */}
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white p-8 h-full border border-slate-100/50">
                  <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 mb-8">
                    <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                    Data Distribution
                  </h3>
                  <div className="space-y-6">
                    {categoryDistribution.map((cat, idx) => (
                      <div key={cat.name} className="space-y-2">
                        <div className="flex justify-between items-end">
                          <span className="text-[10px] uppercase font-black text-slate-400 tracking-widest">{cat.name} Documents</span>
                          <span className="text-sm font-black text-slate-700">{cat.value}</span>
                        </div>
                        <div className="h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((cat.value / 500) * 100, 100)}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-12 bg-[#0f2d2b] p-6 rounded-3xl text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full -mr-8 -mt-8 group-hover:bg-white/10 transition-all duration-700" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-400/80 mb-2">Pro Tip</p>
                    <p className="text-sm font-bold leading-relaxed">Ensure all MTC certificates are verified before hydrotest phase.</p>
                    <button className="flex items-center gap-2 mt-4 text-[10px] font-black uppercase tracking-widest group-hover:gap-3 transition-all">
                      View Protocol <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </main>
  )
}

function KPISection({ title, icon: Icon, metrics, accColor }: any) {
  const colorMap: any = {
    blue: "text-blue-600 bg-blue-50 border-blue-100/50",
    orange: "text-orange-600 bg-orange-50 border-orange-100/50",
    purple: "text-purple-600 bg-purple-50 border-purple-100/50",
    cyan: "text-cyan-600 bg-cyan-50 border-cyan-100/50 text-cyan-600",
  }

  const highlight = metrics.find((m: any) => m.highlight)
  const others = metrics.filter((m: any) => !m.highlight)

  return (
    <motion.div variants={itemVariants}>
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2.5rem] bg-white overflow-hidden p-4 sm:p-7 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-slate-100/50">
        <div className="flex items-center justify-between mb-4 sm:mb-8">
          <div className={`p-2 sm:p-2.5 rounded-2xl border ${colorMap[accColor]}`}>
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <p className="text-[8px] sm:text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none">{title}</p>
        </div>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="space-y-0.5 sm:space-y-1">
            <h4 className="text-2xl sm:text-5xl font-black text-slate-800 tracking-tighter">{highlight.value}</h4>
            <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest">{highlight.label}</p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-50">
            {others.map((m: any, idx: number) => {
              const statusColors: any = {
                pass: "text-emerald-500",
                fail: "text-rose-500",
                warn: "text-amber-500"
              }
              const MIcon = m.icon
              return (
                <div key={idx} className="flex flex-col items-center text-center">
                  <div className={`p-1.5 rounded-lg mb-2 ${statusColors[m.status]}/10 ${statusColors[m.status]}`}>
                    <MIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-sm font-black text-slate-700 leading-none">{m.value}</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight mt-1 leading-none">{m.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

