"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Palette, Thermometer, Droplets, Wind, MoreHorizontal, FileCheck, Loader2, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getMDRReports, deleteMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"
import { EditPaintingModal } from "@/components/modals/EditPaintingModal"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { CreatePaintingModal } from "@/components/modals/CreatePaintingModal"

export default function PaintingMDRPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    const data = await getMDRReports("PAINTING")
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
    if (confirm(`Are you sure you want to delete report ${reportId}?`)) {
      const result = await deleteMDRReport(id)
      if (result.success) {
        toast.success(result.message)
        loadData()
      } else {
        toast.error(result.message)
      }
    }
  }

  // Calculate quick stats from real data
  const parsedReports = reports.map(r => ({
    ...r,
    parsedData: r.data ? (typeof r.data === 'string' ? JSON.parse(r.data) : r.data) : {}
  }))

  const passCount = reports.filter(r => r.status === 'PASS').length
  const avgDFT = parsedReports.length > 0 
    ? (parsedReports.reduce((acc, r) => acc + parseFloat(r.parsedData?.thickness || 0), 0) / parsedReports.length).toFixed(0)
    : "0"

  const humidity = parsedReports.length > 0 ? parsedReports[0].parsedData?.humidity : "62"

  return (
    <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
               <div className="bg-[#1a4d4a] p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
                  <Palette className="h-6 w-6 sm:h-7 sm:w-7" />
               </div>
               <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">Painting & Coating</h1>
                  <p className="text-muted-foreground text-[10px] sm:text-sm font-bold uppercase tracking-widest opacity-60">Environmental & DFT log</p>
               </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Log Coating Report
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
             <ClimateCard label="Total Reports" value={reports.length.toString()} icon={Palette} color="text-teal-600" bg="bg-teal-50" />
             <ClimateCard label="Pass Rate" value={`${reports.length > 0 ? ((passCount/reports.length)*100).toFixed(0) : 0}%`} icon={FileCheck} color="text-emerald-600" bg="bg-emerald-50" />
             <ClimateCard label="Humidity" value={`${humidity}%`} icon={Droplets} color="text-blue-600" bg="bg-blue-50" />
             <ClimateCard label="Avg. DFT" value={`${avgDFT} µm`} icon={Palette} color="text-teal-600" bg="bg-teal-50" />
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
             <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
                   <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Coating Application Log</CardTitle>
                </div>
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input placeholder="Search area or system..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
                </div>
             </CardHeader>
             <CardContent className="p-0">
               {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
                    <p className="font-bold text-xs uppercase tracking-widest text-slate-400">Scanning Shell Conditions...</p>
                  </div>
               ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-none whitespace-nowrap">
                            <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Report ID</TableHead>
                            <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Area & Coating System</TableHead>
                            <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest text-center leading-none">Environment</TableHead>
                            <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest text-center leading-none">DFT Check</TableHead>
                            <TableHead className="font-black text-slate-400 h-14 text-center uppercase text-[10px] tracking-widest leading-none">Status</TableHead>
                            <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {parsedReports.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No coating reports detected</TableCell>
                            </TableRow>
                          ) : (
                            parsedReports.map((r) => (
                              <TableRow key={r.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                                <TableCell className="pl-8 py-5 font-mono font-black text-sm text-[#1a4d4a] uppercase">{r.reportNumber || r.id.slice(0, 8)}</TableCell>
                                <TableCell>
                                   <div className="flex flex-col">
                                      <span className="font-bold text-slate-800 text-base">{r.parsedData?.area || "N/A"}</span>
                                      <span className="text-[10px] font-bold text-teal-600 uppercase mt-0.5 tracking-tight px-2 py-0.5 bg-teal-50 w-fit rounded leading-none">{r.parsedData?.system || "N/A"}</span>
                                   </div>
                                </TableCell>
                                <TableCell className="text-center">
                                   <div className="flex items-center justify-center gap-3">
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 italic">
                                         <Thermometer className="h-3.5 w-3.5 text-orange-400" /> {r.parsedData?.temp || 0}°C
                                      </div>
                                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 italic">
                                         <Droplets className="h-3.5 w-3.5 text-blue-400" /> {r.parsedData?.humidity || 0}%
                                      </div>
                                   </div>
                                </TableCell>
                                <TableCell className="text-center font-black text-[#1a4d4a] text-sm">
                                   {r.parsedData?.thickness || 0} µm
                                </TableCell>
                                <TableCell className="text-center">
                                   <Badge className={`rounded-full px-5 py-1 text-[10px] font-black tracking-widest border-none shadow-md ${
                                      r.status === 'PASS' ? 'bg-emerald-500 text-white' : r.status === 'HOLD' ? 'bg-amber-400 text-white' : 'bg-rose-500 text-white'
                                   }`}>
                                     {r.status || 'PASS'}
                                   </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                   <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                         <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl text-slate-300 hover:text-teal-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                            <MoreHorizontal className="h-5 w-5" />
                                         </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="rounded-xl p-2 bg-white shadow-2xl border-none ring-1 ring-slate-100 min-w-[150px]">
                                         <DropdownMenuItem onClick={() => handleEdit(r)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                            <Edit2 className="h-4 w-4" /> Edit Report
                                         </DropdownMenuItem>
                                         <DropdownMenuItem onClick={() => handleDelete(r.id, r.reportNumber || r.id)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                            <Trash2 className="h-4 w-4" /> Delete Log
                                         </DropdownMenuItem>
                                      </DropdownMenuContent>
                                   </DropdownMenu>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4 p-4">
                    {parsedReports.map((r) => (
                      <Card key={r.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white hover:shadow-md transition-shadow">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-2">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">{r.reportNumber || r.id.slice(0, 8)}</span>
                                 <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                   r.status === 'PASS' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                                 }`}>
                                   {r.status || 'PASS'}
                                 </Badge>
                               </div>
                               <h3 className="text-base font-black text-slate-800 leading-tight uppercase tracking-tight">{r.parsedData?.area || "N/A"}</h3>
                               <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1 truncate">{r.parsedData?.system || "N/A"}</p>
                            </div>
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                                     <MoreHorizontal className="h-3.5 w-3.5" />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="rounded-xl p-2 bg-white shadow-2xl border-none ring-1 ring-slate-100 min-w-[150px]">
                                  <DropdownMenuItem onClick={() => handleEdit(r)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                     <Edit2 className="h-4 w-4 text-teal-500" /> Edit Report
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(r.id, r.reportNumber || r.id)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                     <Trash2 className="h-4 w-4" /> Delete Log
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5 opacity-60">
                                  <Thermometer className="h-3 w-3 text-orange-400" /> Environment
                                </p>
                                <div className="flex flex-col gap-1">
                                   <p className="text-xs font-bold text-slate-700">{r.parsedData?.temp || 0}°C <span className="text-slate-300 font-normal">/</span> {r.parsedData?.humidity || 0}%</p>
                                </div>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1.5 flex items-center gap-1.5 opacity-60">
                                  <FileCheck className="h-3 w-3 text-emerald-400" /> DFT Check
                                </p>
                                <p className="text-sm font-black text-[#1a4d4a]">{r.parsedData?.thickness || 0} µm</p>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                             <p className="text-[10px] font-bold text-slate-400 font-mono flex items-center gap-1.5 uppercase tracking-tighter">
                                <Palette className="h-3 w-3" /> {new Date(r.createdAt).toLocaleDateString()}
                             </p>
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

          <CreatePaintingModal 
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onSuccess={loadData}
          />

          {selectedReport && (
             <EditPaintingModal 
               report={selectedReport}
               open={showEditModal}
               onOpenChange={setShowEditModal}
               onSuccess={loadData}
             />
          )}
    </main>
  )
}

function ClimateCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white group hover:shadow-md hover:-translate-y-1 transition-all border border-white/50">
       <div className="flex items-center gap-3 sm:gap-4">
          <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all group-hover:rotate-12 group-hover:scale-110 shadow-inner`}>
             <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <div>
            <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">{label}</p>
            <p className="text-lg sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2">{value}</p>
          </div>
       </div>
    </Card>
  )
}
