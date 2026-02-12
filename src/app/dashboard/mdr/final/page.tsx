"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, CheckCircle2, FileArchive, Ship, ClipboardList, MoreHorizontal, ShieldCheck, Loader2, Trash2, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getMDRReports, deleteMDRReport } from "@/app/actions/master-actions"
import { CreateFinalReleaseModal } from "@/components/modals/CreateFinalReleaseModal"
import { EditFinalReleaseModal } from "@/components/modals/EditFinalReleaseModal"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function FinalMDRPage() {
  const [releases, setReleases] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await getMDRReports("FINAL")
      const parsedData = data.map((r: any) => {
         let metadata = {}
         try {
            metadata = r.data ? JSON.parse(r.data) : {}
         } catch (e) {
            console.error("Failed to parse report data", e)
         }
         return { ...r, ...metadata }
      })
      setReleases(parsedData)
    } catch (error) {
      console.error("Failed to load releases", error)
      toast.error("Failed to load release notes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (report: any) => {
    setSelectedReport(report)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this release note?")) {
      const result = await deleteMDRReport(id)
      if (result.success) {
        toast.success("Release Note deleted successfully")
        loadData()
      } else {
        toast.error("Failed to delete release note")
      }
    }
  }

  const stats = {
    total: releases.length,
    released: releases.filter(r => r.result === 'RELEASED' || r.status === 'PASS').length,
    hold: releases.filter(r => r.result === 'HOLD' || r.status === 'REJECT').length
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-[#1a4d4a] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
              <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7" />
           </div>
           <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">Final Release (MDR)</h1>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Internal QC handover & Final dossier validation</p>
           </div>
        </div>
        <Button 
           onClick={() => setShowCreateModal(true)}
           className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Issue Release Note
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
         <SummaryCard label="Ready for Delivery" value={stats.released.toString()} icon={Ship} color="text-teal-600" bg="bg-teal-50" />
         <SummaryCard label="In Review / Hold" value={stats.hold.toString()} icon={ClipboardList} color="text-amber-600" bg="bg-amber-50" />
         <SummaryCard label="Dossier Complete" value={`${stats.total > 0 ? Math.round((stats.released/stats.total)*100) : 0}%`} icon={FileArchive} color="text-emerald-600" bg="bg-emerald-50" />
         <SummaryCard label="Total Released" value={stats.total.toString()} icon={CheckCircle2} color="text-indigo-600" bg="bg-indigo-50" />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
         <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Module Release Registry</CardTitle>
            </div>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Search module or project..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
            </div>
         </CardHeader>
         <CardContent className="p-0">
           {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading releases...</p>
              </div>
           ) : releases.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <FileArchive className="h-12 w-12 text-slate-100" />
                <p className="text-sm font-bold text-slate-400">No releases found.</p>
              </div>
           ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                     <TableRow className="border-none whitespace-nowrap">
                       <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Release ID</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Module Description</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Dossier Status</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 text-center uppercase text-[10px] tracking-widest leading-none">Final Result</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Authority / Date</TableHead>
                       <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {releases.map((r) => (
                       <TableRow key={r.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                         <TableCell className="pl-8 py-5 font-mono font-bold text-xs text-[#1a4d4a]">{r.id.substring(0,8).toUpperCase()}...</TableCell>
                         <TableCell>
                            <div className="flex flex-col">
                               <span className="font-bold text-slate-800 text-base">{r.module || '-'}</span>
                               <span className="text-[10px] font-bold text-teal-600 uppercase mt-0.5 tracking-tight px-2 py-0.5 bg-teal-50 w-fit rounded">{r.project?.name || 'Unknown'}</span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <div className="flex items-center gap-2">
                               <div className={`h-2 w-2 rounded-full ${r.docs === 'Complete' ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' : 'bg-rose-500 shadow-sm shadow-rose-500/50'}`} />
                               <span className="text-sm font-bold text-slate-600">{r.docs || '-'}</span>
                            </div>
                         </TableCell>
                         <TableCell className="text-center">
                            <Badge className={`rounded-full px-5 py-1 text-[10px] font-black tracking-widest border-none shadow-md ${
                               (r.result === 'RELEASED' || r.status === 'PASS') ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                            }`}>
                              {r.result || r.status}
                            </Badge>
                         </TableCell>
                         <TableCell>
                            <div className="flex flex-col">
                               <span className="text-xs font-bold text-slate-600">{r.inspector?.name || 'Unknown'}</span>
                               <span className="text-[10px] font-bold text-slate-400 font-mono italic">{new Date(r.createdAt).toLocaleDateString()}</span>
                            </div>
                         </TableCell>
                         <TableCell className="text-right pr-8">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-white text-slate-300 hover:text-teal-600 shadow-none hover:shadow-md transition-all cursor-pointer">
                                       <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 bg-white ring-1 ring-slate-100 min-w-[180px]">
                                    <DropdownMenuItem onClick={() => handleEdit(r)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                       <Edit2 className="h-4 w-4" /> Edit Release
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(r.id)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                       <Trash2 className="h-4 w-4" /> Delete Release
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
                 {releases.map((r) => (
                   <Card key={r.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                     <div className="p-5">
                       <div className="flex justify-between items-start mb-4">
                         <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">{r.id.substring(0,8)}</span>
                              <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                (r.result === 'RELEASED' || r.status === 'PASS') ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                              }`}>
                                {r.result || r.status}
                              </Badge>
                            </div>
                            <h3 className="text-base font-black text-slate-800 leading-tight">{r.module || 'Unnamed Module'}</h3>
                            <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1">{r.project?.name || 'No Project'}</p>
                         </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2 bg-white">
                               <DropdownMenuItem onClick={() => handleEdit(r)} className="text-slate-600 font-bold px-4 py-3 rounded-xl focus:bg-teal-50 focus:text-teal-700 flex items-center gap-2">
                                  <Edit2 className="h-4 w-4" /> Edit
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleDelete(r.id)} className="text-rose-600 font-bold px-4 py-3 rounded-xl focus:bg-rose-50 focus:text-rose-700 flex items-center gap-2">
                                  <Trash2 className="h-4 w-4" /> Delete
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                       </div>

                       <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                          <div>
                             <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Dossier Status</p>
                             <div className="flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${r.docs === 'Complete' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                                <span className="text-xs font-bold text-slate-700">{r.docs || 'Incomplete'}</span>
                             </div>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Release Date</p>
                             <p className="text-xs font-bold text-slate-700 font-mono italic">{new Date(r.createdAt || Date.now()).toLocaleDateString()}</p>
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                             <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 border border-slate-200">
                                {(r.inspector?.name || 'QC').substring(0, 2).toUpperCase()}
                             </div>
                             <p className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{r.inspector?.name || 'Quality Control'}</p>
                          </div>
                          <p className="text-[9px] font-bold text-slate-300 italic">{r.project?.location || 'Handover'}</p>
                       </div>
                     </div>
                   </Card>
                 ))}
              </div>
            </>
           )}
         </CardContent>
      </Card>
      
      <CreateFinalReleaseModal 
         open={showCreateModal}
         onOpenChange={setShowCreateModal}
         onSuccess={loadData}
      />

      {selectedReport && (
         <EditFinalReleaseModal 
           report={selectedReport}
           open={showEditModal}
           onOpenChange={setShowEditModal}
           onSuccess={loadData}
         />
      )}
    </main>
  )
}

function SummaryCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white flex flex-col justify-between group hover:bg-teal-600 transition-all duration-500 border border-white/50 hover:border-teal-500/50 hover:-translate-y-1">
       <div className="flex justify-between items-start mb-2 sm:mb-6">
          <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl group-hover:bg-white/20 group-hover:text-white transition-colors shadow-inner`}>
             <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <div className="h-1.5 w-1.5 rounded-full bg-teal-500 group-hover:bg-white shadow-sm" />
       </div>
       <div>
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest group-hover:text-teal-100 transition-colors">{label}</p>
          <p className="text-xl sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 group-hover:text-white transition-colors">{value}</p>
       </div>
    </Card>
  )
}
