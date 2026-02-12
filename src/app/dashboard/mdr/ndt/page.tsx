"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Microscope, Radiation, Activity, ShieldAlert, FileText, Download, Loader2, Edit2, Trash2, MoreVertical, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getMDRReports, deleteMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"
import { EditNDTModal } from "@/components/modals/EditNDTModal"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { CreateNDTModal } from "@/components/modals/CreateNDTModal"

export default function NDTMDRPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    const data = await getMDRReports("NDT")
    setReports(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (report: any) => {
    setSelectedReport(report)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string, reportId: string) => {
    if (confirm(`Are you sure you want to delete NDT report ${reportId}?`)) {
      const result = await deleteMDRReport(id)
      if (result.success) {
        toast.success(result.message)
        loadData()
      } else {
        toast.error(result.message)
      }
    }
  }

  // Calculate stats from real data
  const parsedReports = reports.map(r => ({
    ...r,
    parsedData: r.data ? (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) : {}
  }))

  const rtCount = parsedReports.filter(r => r.parsedData?.method === 'Radiography').length
  const utCount = parsedReports.filter(r => r.parsedData?.method === 'Ultrasonic').length
  const failRate = parsedReports.length > 0 
    ? ((parsedReports.filter(r => r.status === 'FAIL').length / parsedReports.length) * 100).toFixed(1)
    : "0"

  return (
    <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
               <div className="bg-[#1a4d4a] p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
                  <Radiation className="h-6 w-6 sm:h-7 sm:w-7" />
               </div>
               <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">NDT Management</h1>
                  <p className="text-muted-foreground text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-60">Non-Destructive Testing Registry</p>
               </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
               <Button onClick={() => setShowCreateModal(true)} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
                 <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> New Test Report
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
             <AnalysisCard label="RT Tests" value={rtCount.toString()} icon={Radiation} color="text-teal-600" bg="bg-teal-50" />
             <AnalysisCard label="UT Tests" value={utCount.toString()} icon={Microscope} color="text-blue-600" bg="bg-blue-50" />
             <AnalysisCard label="Repair Rate" value={`${failRate}%`} icon={ShieldAlert} color="text-red-600" bg="bg-red-50" />
             <AnalysisCard label="Total Ready" value={reports.length.toString()} icon={FileText} color="text-emerald-600" bg="bg-emerald-50" />
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
             <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
                   <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Laboratory Results Log</CardTitle>
                </div>
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input placeholder="Search test ID or joint No..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
                </div>
             </CardHeader>
             <CardContent className="p-0">
               {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Calibrating Detectors...</p>
                  </div>
               ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-none whitespace-nowrap">
                            <TableHead className="font-black text-slate-500 pl-8 h-14 uppercase text-[10px] tracking-widest">Report No.</TableHead>
                            <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest">Method / Joint</TableHead>
                            <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest">Specification</TableHead>
                            <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest text-center">Result</TableHead>
                            <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest">Inspector / Date</TableHead>
                            <TableHead className="text-right pr-8 h-14 font-black text-slate-500 uppercase text-[10px] tracking-widest">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {parsedReports.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No NDT results detected</TableCell>
                            </TableRow>
                          ) : (
                            parsedReports.map((ndt) => (
                              <TableRow key={ndt.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap text-sm">
                                <TableCell className="pl-8 py-5 font-mono font-black text-[#1a4d4a] uppercase tracking-tighter">{ndt.reportNumber || ndt.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                   <div className="flex flex-col">
                                      <span className="font-bold text-slate-800">{ndt.parsedData?.method || "Unknown"}</span>
                                      <span className="text-[10px] font-bold text-teal-600 uppercase mt-0.5 tracking-tight px-2 py-0.5 bg-teal-50 w-fit rounded">{ndt.parsedData?.joint || "N/A"} • {ndt.parsedData?.drawing || "N/A"}</span>
                                   </div>
                                </TableCell>
                                <TableCell>
                                   <Badge variant="outline" className="rounded-lg bg-slate-50 text-slate-500 text-[10px] font-bold px-2 py-0.5 border-2 border-slate-200 uppercase tracking-widest">
                                      {ndt.parsedData?.spec || "QUALIFIED"}
                                   </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                   <Badge className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest border-none ${
                                      ndt.status === 'PASS' ? 'bg-emerald-500 text-white' : 
                                      ndt.status === 'FAIL' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                                   } shadow-sm uppercase`}>
                                     {ndt.status || 'PENDING'}
                                   </Badge>
                                </TableCell>
                                <TableCell>
                                   <div className="flex flex-col">
                                      <span className="font-bold text-slate-600">{ndt.inspector?.name || "Unassigned"}</span>
                                      <span className="text-[10px] font-bold text-slate-400 font-mono italic">{new Date(ndt.createdAt).toLocaleDateString()}</span>
                                   </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                   <div className="flex justify-end gap-1">
                                     <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-teal-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                        <Download className="h-4 w-4" />
                                     </Button>
                                     <Button onClick={() => handleEdit(ndt)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-amber-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                        <Edit2 className="h-4 w-4" />
                                     </Button>
                                     <Button onClick={() => handleDelete(ndt.id, ndt.reportNumber || ndt.id)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                        <Trash2 className="h-4 w-4" />
                                     </Button>
                                   </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {parsedReports.map((ndt) => (
                      <Card key={ndt.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-2">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-tighter">{ndt.reportNumber || ndt.id.slice(0, 8)}</span>
                                 <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                   ndt.status === 'PASS' ? 'bg-emerald-500 text-white' : 
                                   ndt.status === 'FAIL' ? 'bg-rose-500 text-white' : 'bg-amber-400 text-white'
                                 }`}>
                                   {ndt.status || 'PENDING'}
                                 </Badge>
                               </div>
                               <h3 className="text-base font-black text-slate-800 leading-tight uppercase tracking-tight">{ndt.parsedData?.method || "Unknown"}</h3>
                               <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1 truncate">{ndt.parsedData?.joint || "N/A"} • {ndt.parsedData?.drawing || "N/A"}</p>
                            </div>
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                     <MoreVertical className="h-4 w-4" />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="rounded-xl p-2 bg-white shadow-2xl border-none ring-1 ring-slate-100 min-w-[150px]">
                                  <DropdownMenuItem onClick={() => handleEdit(ndt)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                     <Edit2 className="h-4 w-4 text-teal-500" /> Edit Result
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(ndt.id, ndt.reportNumber || ndt.id)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                     <Trash2 className="h-4 w-4" /> Remove Report
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 opacity-60">Specification</p>
                                <Badge variant="outline" className="text-[9px] font-black tracking-widest border-2 border-slate-100 px-2 py-0.5 text-slate-500 uppercase rounded-lg">
                                  {ndt.parsedData?.spec || "QUALIFIED"}
                                </Badge>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1 opacity-60">Test Date</p>
                                <p className="text-xs font-bold text-slate-700 font-mono flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(ndt.createdAt).toLocaleDateString()}</p>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-2">
                                <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 border border-slate-200">
                                   {ndt.inspector?.name?.substring(0, 2).toUpperCase() || 'QC'}
                                </div>
                                <p className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{ndt.inspector?.name || "Pending QC"}</p>
                             </div>
                             <Button variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-teal-600 font-bold bg-teal-50/50 hover:bg-teal-50 text-[10px] uppercase tracking-tighter active:scale-95 transition-all">
                                Trace
                             </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
               )}
             </CardContent>
          </Card>

          <CreateNDTModal 
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onSuccess={loadData}
          />

          {selectedReport && (
             <EditNDTModal 
               report={selectedReport}
               open={showEditModal}
               onOpenChange={setShowEditModal}
               onSuccess={loadData}
             />
          )}
    </main>
  )
}

function AnalysisCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-100 group">
       <div className="flex justify-between items-start mb-2 sm:mb-6">
          <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-transform group-hover:rotate-12`}>
             <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <Badge className="bg-slate-100 text-slate-500 border-none text-[8px] sm:text-[9px] font-black px-1.5 py-0.5">YTD 2024</Badge>
       </div>
       <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1 sm:mb-2">{label}</p>
       <h3 className="text-xl sm:text-3xl font-black text-slate-800 tracking-tighter">{value}</h3>
    </Card>
  )
}
