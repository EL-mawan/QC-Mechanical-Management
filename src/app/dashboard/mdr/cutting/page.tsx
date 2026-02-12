"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Scissors, Ruler, Square, Triangle, MoreHorizontal, FileDown, Loader2, Trash2, Edit2, FileCheck2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getMDRReports, deleteMDRReport } from "@/app/actions/master-actions"
import { EditCuttingModal } from "@/components/modals/EditCuttingModal"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function CuttingMDRPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getMDRReports("CUTTING")
      setReports(data)
    } catch (err) {
      toast.error("Failed to load cutting reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this cutting record?")) {
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

  const stats = {
    total: reports.length,
    accuracy: reports.filter(r => r.status === 'PASS').length,
    reject: reports.filter(r => r.status === 'REJECT' || r.status === 'FAIL').length
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-[#1a4d4a] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
              <Scissors className="h-6 w-6 sm:h-7 sm:w-7" />
           </div>
           <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">Cutting & Dimension</h1>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Part traceability & dimensional verification log</p>
           </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
           <Button variant="outline" className="rounded-xl border-slate-200 h-10 sm:h-12 px-6 font-bold text-slate-600 flex items-center justify-center gap-2 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
              <FileDown className="h-4 w-4" /> Export Report
           </Button>
           <Button className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
             <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Log Cut Part
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
         <MetricCard label="Total Parts Logged" value={stats.total.toString()} icon={Square} color="text-teal-600" bg="bg-teal-50" />
         <MetricCard label="Dimension Pass" value={stats.accuracy.toString()} icon={Ruler} color="text-emerald-600" bg="bg-emerald-50" />
         <MetricCard label="Reject Rate" value={`${stats.total > 0 ? ((stats.reject/stats.total)*100).toFixed(1) : 0}%`} icon={Triangle} color="text-orange-600" bg="bg-orange-50" />
         <MetricCard label="Traceability Rate" value="100%" icon={FileCheck2} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
         <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Part Cutting Log</CardTitle>
            </div>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Search part name or drawing..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
            </div>
         </CardHeader>
         <CardContent className="p-0">
           {loading ? (
             <div className="py-20 flex flex-col items-center justify-center gap-4">
               <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
               <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading cutting logs...</p>
             </div>
           ) : reports.length === 0 ? (
             <div className="py-20 text-center flex flex-col items-center gap-2">
               <Scissors className="h-12 w-12 text-slate-100" />
               <p className="text-sm font-bold text-slate-400">No cutting logs found.</p>
             </div>
           ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                     <TableRow className="border-none whitespace-nowrap">
                       <TableHead className="font-black text-slate-500 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Report ID</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest leading-none">Part & Drawing</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest leading-none">Material Heat</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest leading-none">Dimensions (mm)</TableHead>
                       <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest text-center leading-none">QC Status</TableHead>
                       <TableHead className="text-right pr-8 h-14 font-black text-slate-500 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {reports.map((s) => (
                       <TableRow key={s.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                         <TableCell className="pl-8 py-5 font-mono font-black text-[11px] text-[#1a4d4a] uppercase">
                            {s.reportId || s.id.substring(0,8).toUpperCase()}
                         </TableCell>
                         <TableCell>
                            <div className="flex flex-col">
                               <span className="font-bold text-slate-800 text-sm tracking-tight">{s.data?.part || '-'}</span>
                               <span className="text-[9px] font-black text-teal-600 uppercase mt-0.5 tracking-widest px-2 py-0.5 bg-teal-50 w-fit rounded leading-tight">{s.data?.drawing || '-'}</span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <Badge variant="outline" className="font-mono text-[10px] border-slate-200 text-slate-600 bg-slate-50 px-2 py-0.5 rounded-lg border-2">
                               {s.data?.material || '-'}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-xs font-bold text-slate-600 font-mono tracking-tighter">{s.data?.dimension || '-'}</TableCell>
                         <TableCell className="text-center">
                            <Badge className={`rounded-full px-5 py-1 text-[10px] font-black tracking-widest shadow-sm border-none ${
                               s.status === 'PASS' ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                               (s.status === 'REJECT' || s.status === 'FAIL') ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-slate-400 text-white'
                            }`}>
                              {s.status}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right pr-8">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-white text-slate-300 hover:text-teal-600 transition-all shadow-none hover:shadow-md cursor-pointer">
                                       <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 bg-white ring-1 ring-slate-100 min-w-[160px]">
                                    <DropdownMenuItem onClick={() => handleEdit(s)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                       <Edit2 className="h-4 w-4" /> Edit Record
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(s.id)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                       <Trash2 className="h-4 w-4" /> Delete Log
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                         </TableCell>
                       </TableRow>
                     ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                 {reports.map((s) => (
                   <Card key={s.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                     <div className="p-5">
                       <div className="flex justify-between items-start mb-4">
                         <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                {s.reportId || s.id.substring(0,8)}
                              </span>
                              <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                s.status === 'PASS' ? 'bg-emerald-500 text-white' : 
                                (s.status === 'REJECT' || s.status === 'FAIL') ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                              }`}>
                                {s.status}
                              </Badge>
                            </div>
                            <h3 className="text-base font-black text-slate-800 leading-tight">{s.data?.part || 'No Part Name'}</h3>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1">{s.data?.drawing || 'No Drawing'}</p>
                         </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2 bg-white ring-1 ring-slate-100">
                               <DropdownMenuItem onClick={() => handleEdit(s)} className="rounded-xl flex items-center gap-2 px-3 py-2 cursor-pointer font-bold text-[11px] text-slate-600 focus:bg-teal-50">
                                  <Edit2 className="h-3 w-3" /> Edit
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleDelete(s.id)} className="rounded-xl flex items-center gap-2 px-3 py-2 cursor-pointer font-bold text-[11px] text-rose-600 focus:bg-rose-50">
                                  <Trash2 className="h-3 w-3" /> Delete
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                       </div>

                       <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                          <div>
                             <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Material Heat</p>
                             <Badge variant="outline" className="font-mono text-[10px] border-slate-200 text-slate-600 bg-slate-50 px-2 py-0.5 rounded tracking-tighter font-black">
                               {s.data?.material || '-'}
                             </Badge>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Dimensions</p>
                             <p className="text-sm font-bold text-slate-700 font-mono tracking-tighter">{s.data?.dimension || '-'}</p>
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                             <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 border border-slate-200 uppercase shadow-inner">
                                {(s.inspector?.name || 'QC').substring(0, 2).toUpperCase()}
                             </div>
                             <p className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{s.inspector?.name || 'QC Inspector'}</p>
                          </div>
                          <p className="text-[9px] font-bold text-slate-300 italic">{s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'}</p>
                       </div>
                     </div>
                   </Card>
                 ))}
              </div>
            </>
           )}
         </CardContent>
      </Card>

      {selectedReport && (
        <EditCuttingModal 
          report={selectedReport}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSuccess={loadData}
        />
      )}
    </main>
  )
}

function MetricCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:-translate-y-1 transition-transform">
       <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-inner transition-transform group-hover:scale-110`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
       </div>
       <div>
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1 sm:mb-2">{label}</p>
          <p className="text-xl sm:text-2xl font-black text-slate-800">{value}</p>
       </div>
    </Card>
  )
}
