"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Layers2, Compass, PenTool, ClipboardCheck, MoreHorizontal, Camera, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { getMDRReports, deleteMDRReport } from "@/app/actions/master-actions"
import { CreateFitupModal } from "@/components/modals/CreateFitupModal"
import { EditFitupModal } from "@/components/modals/EditFitupModal"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Edit2, Trash2, Loader2, UserCheck } from "lucide-react"

export default function FitupMDRPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    const data = await getMDRReports("FITUP")
    setReports(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this fit-up record?")) {
      const result = await deleteMDRReport(id)
      if (result.success) {
        toast.success("Record deleted successfully")
        loadData()
      } else {
        toast.error(result.message || "Failed to delete record")
      }
    }
  }

  const handleEdit = (report: any) => {
    setSelectedReport(report)
    setShowEditModal(true)
  }

  return (
    <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
               <div className="bg-[#1a4d4a] p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
                  <Compass className="h-6 w-6 sm:h-7 sm:w-7" />
               </div>
               <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">Fit-up Inspection</h1>
                  <p className="text-muted-foreground text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-60">Pre-welding assembly tracking</p>
               </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> New Fit-up Log
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
             <TrendCard label="Total Joints" value={reports.length.toString()} icon={Layers2} color="text-teal-600" bg="bg-teal-50" />
             <TrendCard label="Passed" value={reports.filter(r => r.status === 'PASS').length.toString()} icon={ClipboardCheck} color="text-emerald-600" bg="bg-emerald-50" />
             <TrendCard label="Rejected" value={reports.filter(r => r.status === 'REJECT').length.toString()} icon={PenTool} color="text-red-600" bg="bg-red-50" />
             <TrendCard label="Pending" value={reports.filter(r => r.status === 'PENDING').length.toString()} icon={Camera} color="text-amber-600" bg="bg-amber-50" />
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
             <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
                   <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Joint Assembly Registry</CardTitle>
                </div>
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input placeholder="Search joint No..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
                </div>
             </CardHeader>
             <CardContent className="p-0">
               {loading ? (
                 <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    <p className="font-bold text-xs uppercase tracking-widest">Loading records...</p>
                 </div>
               ) : (
                <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                       <TableRow className="border-none whitespace-nowrap">
                         <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Report ID</TableHead>
                         <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Joint & DWG</TableHead>
                         <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Assembly Parts</TableHead>
                         <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none text-center">Gap / Root</TableHead>
                         <TableHead className="font-black text-slate-400 h-14 text-center uppercase text-[10px] tracking-widest leading-none">Status</TableHead>
                         <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {reports.length === 0 ? (
                         <TableRow>
                            <TableCell colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No fit-up records found</TableCell>
                         </TableRow>
                       ) : (
                        reports.map((r) => {
                          const data = r.data ? JSON.parse(r.data) : {}
                          return (
                            <TableRow key={r.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                              <TableCell className="pl-8 py-5 font-mono font-bold text-xs text-slate-300 group-hover:text-teal-600 uppercase">
                                {r.reportNumber || r.id.substring(0, 8)}
                              </TableCell>
                              <TableCell>
                                 <div className="flex flex-col">
                                    <span className="font-bold text-slate-800 text-base">{data.joint || 'N/A'}</span>
                                    <span className="text-[10px] font-bold text-teal-600 uppercase mt-0.5 tracking-tight px-2 py-0.5 bg-teal-50 w-fit rounded border border-teal-100">{data.drawing || '-'}</span>
                                 </div>
                              </TableCell>
                              <TableCell className="text-sm font-bold text-slate-600 italic">{data.parts || '-'}</TableCell>
                              <TableCell className="text-center">
                                 <div className="flex flex-col items-center">
                                    <span className="text-xs font-bold text-slate-700">{data.gap || '-'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 italic">/ {data.rootFace || '-'}</span>
                                 </div>
                              </TableCell>
                              <TableCell className="text-center">
                                 <Badge className={`rounded-full px-5 py-1 text-[10px] font-black tracking-widest border-none shadow-md ${
                                    r.status === 'PASS' ? 'bg-emerald-500 text-white' : 
                                    r.status === 'REJECT' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                                 }`}>
                                   {r.status}
                                 </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-8">
                                 <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                       <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-slate-300 hover:text-teal-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                          <MoreHorizontal className="h-4 w-4" />
                                       </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 bg-white ring-1 ring-slate-100 min-w-[180px]">
                                       <DropdownMenuItem onClick={() => handleEdit(r)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                          <Edit2 className="h-4 w-4 text-teal-500" /> Edit Record
                                       </DropdownMenuItem>
                                       <DropdownMenuItem onClick={() => handleDelete(r.id)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                          <Trash2 className="h-4 w-4" /> Delete Log
                                       </DropdownMenuItem>
                                    </DropdownMenuContent>
                                 </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })
                       )}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4 p-4">
                   {reports.length === 0 ? (
                     <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No fit-up records found</div>
                   ) : (
                    reports.map((r) => {
                      const data = r.data ? JSON.parse(r.data) : {}
                      return (
                        <Card key={r.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                          <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                              <div className="min-w-0 pr-2">
                                 <div className="flex items-center gap-2 mb-1">
                                   <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-tighter">
                                     {r.reportNumber || r.id.substring(0, 8)}
                                   </span>
                                   <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                     r.status === 'PASS' ? 'bg-emerald-500 text-white' : 
                                     r.status === 'REJECT' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                                   }`}>
                                     {r.status}
                                   </Badge>
                                 </div>
                                 <h3 className="text-base font-black text-slate-800 leading-tight uppercase tracking-tight">{data.joint || 'N/A'}</h3>
                                 <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1">{data.drawing || '-'}</p>
                              </div>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                       <MoreHorizontal className="h-3.5 w-3.5" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2 bg-white ring-1 ring-slate-100">
                                    <DropdownMenuItem onClick={() => handleEdit(r)} className="px-3 py-2.5 rounded-xl font-bold text-[11px] text-slate-600 focus:bg-teal-50 flex items-center gap-2">
                                       <Edit2 className="h-3 w-3 text-teal-500" /> Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(r.id)} className="px-3 py-2.5 rounded-xl font-bold text-[11px] text-rose-600 focus:bg-rose-50 flex items-center gap-2">
                                       <Trash2 className="h-3 w-3" /> Delete
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                            </div>

                            <div className="p-3 rounded-xl bg-slate-50 mb-4 border border-slate-100 shadow-inner">
                               <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5 opacity-60">
                                 <Layers2 className="h-3 w-3" /> Assembly Component
                               </p>
                               <p className="text-xs font-bold text-slate-700 italic leading-relaxed">{data.parts || '-'}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                               <div>
                                  <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1 opacity-60">Gap / Face</p>
                                  <div className="flex items-center gap-1.5">
                                     <span className="text-sm font-black text-slate-700">{data.gap || '-'}</span>
                                     <span className="text-xs font-bold text-slate-300">|</span>
                                     <span className="text-xs font-bold text-slate-400 italic">{data.rootFace || '-'}</span>
                                  </div>
                               </div>
                               <div>
                                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 opacity-60">Authority</p>
                                  <div className="flex items-center gap-2">
                                     <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500 border border-slate-300 shadow-sm">
                                        {r.inspector?.name?.substring(0, 2).toUpperCase() || 'NA'}
                                     </div>
                                     <p className="text-xs font-bold text-slate-600 truncate">{r.inspector?.name || 'QC Inspector'}</p>
                                  </div>
                               </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                               <p className="text-[9px] font-bold text-slate-300 font-mono flex items-center gap-1.5 uppercase tracking-tighter">
                                  <Clock className="h-3 w-3" /> {new Date(r.createdAt).toLocaleDateString()}
                               </p>
                               <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-teal-600 font-bold bg-teal-50/50 hover:bg-teal-50 gap-2 active:scale-95 transition-all text-xs">
                                  <Camera className="h-4 w-4" /> Trace
                               </Button>
                            </div>
                          </div>
                        </Card>
                      )
                    })
                   )}
                </div>
                </>
               )}
             </CardContent>
          </Card>

          <CreateFitupModal 
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onSuccess={loadData}
          />

          {selectedReport && (
            <EditFitupModal 
              report={selectedReport}
              open={showEditModal}
              onOpenChange={setShowEditModal}
              onSuccess={loadData}
            />
          )}
    </main>
  )
}

function TrendCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white flex items-center justify-between group hover:shadow-md hover:-translate-y-1 transition-all border border-white/50">
       <div className="space-y-1">
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none opacity-60">{label}</p>
          <p className="text-xl sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2">{value}</p>
       </div>
       <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all group-hover:rotate-12 group-hover:scale-110 shadow-inner`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
       </div>
    </Card>
  )
}
