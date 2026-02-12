"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, QrCode, FileCheck, CheckCircle2, AlertCircle, Plus, Layers, MoreHorizontal, Edit2, Trash2, Loader2, UserCheck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getMDRReports, deleteMDRReport } from "@/app/actions/master-actions"
import { EditWeldingModal } from "@/components/modals/EditWeldingModal"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { CreateWeldingLogModal } from "@/components/modals/CreateWeldingLogModal"

export default function WeldingLogPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getMDRReports("WELDING")
      setReports(data)
    } catch (error) {
      console.error("Failed to load welding reports:", error)
      toast.error("Failed to load records")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string, jointNo: string) => {
    if (confirm(`Are you sure you want to delete welding record for ${jointNo}?`)) {
      const result = await deleteMDRReport(id)
      if (result.success) {
        toast.success(result.message)
        loadData()
      } else {
        toast.error(result.message)
      }
    }
  }

  const handleEdit = (report: any) => {
    setSelectedReport(report)
    setShowEditModal(true)
  }

  // Calculate quick stats from real data
  const parsedReports = reports.map(r => ({
    ...r,
    parsedData: r.data ? (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) : {}
  }))

  const stats = {
     total: parsedReports.length,
     passed: parsedReports.filter(r => r.status === 'PASS').length,
     rejected: parsedReports.filter(r => r.status === 'REJECT').length,
     completion: parsedReports.length > 0 ? Math.round((parsedReports.filter(r => r.status === 'PASS').length / parsedReports.length) * 100) : 0
  }

  return (
    <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-[#1a4d4a] p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
            <QrCode className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">Welding Log (MDR)</h1>
            <p className="text-muted-foreground text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-60">Joint tracking & Welding Management</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
           <Button onClick={() => setShowCreateModal(true)} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Log New Joint
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatSmall label="Total Joints" value={stats.total.toString()} icon={Layers} color="text-blue-600" bg="bg-blue-50" />
        <StatSmall label="Accepted" value={stats.passed.toString()} icon={CheckCircle2} color="text-emerald-600" bg="bg-emerald-50" />
        <StatSmall label="Rejected" value={stats.rejected.toString()} icon={AlertCircle} color="text-rose-600" bg="bg-rose-50" />
        <StatSmall label="Success Rate" value={`${stats.completion}%`} icon={FileCheck} color="text-teal-600" bg="bg-teal-50" />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
         <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Joint Registry</CardTitle>
            </div>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Search joint, welder or DWG..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
            </div>
         </CardHeader>
         <CardContent className="p-0">
           {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning Shell Conditions...</p>
              </div>
           ) : parsedReports.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <Layers className="h-12 w-12 text-slate-100" />
                <p className="text-sm font-bold text-slate-400">No welding records found.</p>
              </div>
           ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                     <TableRow className="border-none whitespace-nowrap">
                       <TableHead className="font-black text-slate-500 pl-8 h-14 uppercase text-[10px] tracking-widest">Joint/ID</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest">Welder & WPS</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest">Drawing</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest">Inspector</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest text-center">QC Status</TableHead>
                       <TableHead className="text-right pr-8 h-14 font-black text-slate-500 uppercase text-[10px] tracking-widest">Action</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {parsedReports.map((r) => {
                       return (
                        <TableRow key={r.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                          <TableCell className="pl-8 py-5 font-mono font-black text-sm text-[#1a4d4a] uppercase">{r.parsedData?.joint || 'N/A'}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-800">{r.parsedData?.welder || 'Unnamed Welder'}</span>
                              <span className="text-[10px] font-bold text-teal-600 uppercase mt-0.5 tracking-tight px-2 py-0.5 bg-teal-50 w-fit rounded border border-teal-100 shadow-sm">{r.parsedData?.wps || 'WPS-TBD'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm font-bold text-slate-500 font-mono tracking-tighter uppercase">{r.parsedData?.drawing || '-'}</TableCell>
                          <TableCell>
                             <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200">
                                   {r.inspector?.name?.substring(0, 2).toUpperCase() || 'QC'}
                                </div>
                                <span className="text-sm font-bold text-slate-600">{r.inspector?.name || 'QC Inspector'}</span>
                             </div>
                          </TableCell>
                          <TableCell className="text-center">
                             <Badge className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest shadow-md border-none ${
                                r.status === 'PASS' ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                                r.status === 'REJECT' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-slate-300 text-white shadow-slate-100'
                             }`}>
                                {r.status}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-teal-600 cursor-pointer">
                                      <MoreHorizontal className="h-5 w-5" />
                                   </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 bg-white ring-1 ring-slate-100 min-w-[200px]">
                                   <DropdownMenuItem onClick={() => handleEdit(r)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                      <Edit2 className="h-4 w-4 text-teal-500" /> Edit Record
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleDelete(r.id, r.parsedData?.joint || 'Unknown')} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                      <Trash2 className="h-4 w-4" /> Delete Log
                                   </DropdownMenuItem>
                                </DropdownMenuContent>
                             </DropdownMenu>
                          </TableCell>
                        </TableRow>
                       )
                     })}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                 {parsedReports.map((r) => {
                    return (
                      <Card key={r.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-2">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">{r.parsedData?.joint || 'N/A'}</span>
                                 <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                   r.status === 'PASS' ? 'bg-emerald-500 text-white' : 
                                   r.status === 'REJECT' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                                 }`}>
                                   {r.status}
                                 </Badge>
                               </div>
                               <h3 className="text-base font-black text-slate-800 leading-tight uppercase tracking-tight">{r.parsedData?.welder || 'Unnamed Welder'}</h3>
                               <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1 truncate">{r.parsedData?.wps || 'WPS-TBD'}</p>
                            </div>
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600">
                                     <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2 bg-white ring-1 ring-slate-100 min-w-[150px]">
                                  <DropdownMenuItem onClick={() => handleEdit(r)} className="rounded-xl flex items-center gap-2 px-3 py-2 cursor-pointer font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-700 text-xs">
                                     <Edit2 className="h-3.5 w-3.5 text-teal-500" /> Edit Joint
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(r.id, r.parsedData?.joint || 'Unknown')} className="rounded-xl flex items-center gap-2 px-3 py-2 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 text-xs">
                                     <Trash2 className="h-3.5 w-3.5 text-rose-500" /> Remove Log
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 opacity-60">Drawing Ref</p>
                                <p className="text-xs font-bold text-slate-700 font-mono truncate uppercase">{r.parsedData?.drawing || '-'}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 opacity-60">Date</p>
                                <p className="text-xs font-bold text-slate-700 font-mono italic">{new Date(r.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                <UserCheck className="h-3.5 w-3.5 text-slate-300" />
                                <p className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{r.inspector?.name || 'QC Pending'}</p>
                             </div>
                             <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-teal-600 font-bold bg-teal-50/50 hover:bg-teal-50 text-[10px] uppercase tracking-tighter active:scale-95 transition-all">
                                Trace
                             </Button>
                          </div>
                        </div>
                      </Card>
                    )
                 })}
              </div>
            </>
           )}
         </CardContent>
      </Card>

      <CreateWeldingLogModal 
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={loadData}
      />

      {selectedReport && (
        <EditWeldingModal 
          report={selectedReport}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSuccess={loadData}
        />
      )}
    </main>
  )
}

function StatSmall({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:-translate-y-1 transition-transform">
       <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-inner transition-transform group-hover:scale-110`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
       </div>
       <div>
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1 sm:mb-2">{label}</p>
          <p className="text-lg sm:text-2xl font-black text-slate-800">{value}</p>
       </div>
    </Card>
  )
}


