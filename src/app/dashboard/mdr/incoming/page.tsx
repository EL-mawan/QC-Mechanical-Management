"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, PackageSearch, FileCheck2, Shovel, ScanLine, MoreHorizontal, Building2, Clock, Loader2, Trash2, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getMDRReports, deleteMDRReport } from "@/app/actions/master-actions"
import { CreateIncomingReportModal } from "@/components/modals/CreateIncomingReportModal"
import { EditIncomingModal } from "@/components/modals/EditIncomingModal"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function IncomingMDRPage() {
  const [reports, setReports] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedReport, setSelectedReport] = useState<any>(null)

  const loadReports = async () => {
    setLoading(true)
    try {
      const data = await getMDRReports("INCOMING")
      const parsedData = data.map((r: any) => {
         let metadata = {}
         try {
            metadata = r.data ? JSON.parse(r.data) : {}
         } catch (e) {
            console.error("Failed to parse report data", e)
         }
         return { ...r, ...metadata }
      })
      setReports(parsedData)
    } catch (error) {
      console.error("Failed to load reports", error)
      toast.error("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this report?")) {
      const result = await deleteMDRReport(id)
      if (result.success) {
        toast.success("Report deleted successfully")
        loadReports()
      } else {
        toast.error("Failed to delete report")
      }
    }
  }

  const handleEdit = (report: any) => {
    setSelectedReport(report)
    setShowEditModal(true)
  }

  // Calculate stats
  const stats = {
    total: reports.length,
    approved: reports.filter(r => r.status === 'PASS').length,
    rejected: reports.filter(r => r.status === 'REJECT').length,
    pending: reports.filter(r => r.status === 'PENDING').length
  }

  return (
    <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
               <div className="bg-[#1a4d4a] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
                  <PackageSearch className="h-6 w-6 sm:h-7 sm:w-7" />
               </div>
               <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">Incoming Inspection</h1>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Material Receiving & MTC Validation Log</p>
               </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Create Report
            </Button>
          </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
         <QuickStat label="Total Inspected" value={stats.total.toString()} icon={ScanLine} color="text-teal-600" bg="bg-teal-50" />
         <QuickStat label="Approved (MTC)" value={stats.approved.toString()} icon={FileCheck2} color="text-emerald-600" bg="bg-emerald-50" />
         <QuickStat label="Hold/Rejected" value={stats.rejected.toString()} icon={Shovel} color="text-red-600" bg="bg-red-50" />
         <QuickStat label="Pending Sync" value={stats.pending.toString()} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
      </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
             <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                   <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
                   <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Report Registry</CardTitle>
                </div>
                <div className="relative w-full sm:w-96">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input placeholder="Search batch, report ID or heat number..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
                </div>
             </CardHeader>
             <CardContent className="p-0">
               {loading ? (
                  <div className="py-20 flex justify-center flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none">Scanning Databases...</p>
                  </div>
               ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none whitespace-nowrap">
                          <TableHead className="font-black text-slate-500 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Report ID</TableHead>
                          <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest leading-none">Material & Supplier</TableHead>
                          <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest leading-none">Heat / Batch No</TableHead>
                          <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest leading-none">Inspector</TableHead>
                          <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest text-center leading-none">Status</TableHead>
                          <TableHead className="text-right pr-8 h-14 font-black text-slate-500 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.length === 0 ? (
                           <TableRow>
                             <TableCell colSpan={6} className="py-20 text-center text-slate-400 font-medium">No incoming reports found.</TableCell>
                           </TableRow>
                        ) : (
                          reports.map((r) => (
                            <TableRow key={r.id} className="border-b border-slate-50 hover:bg-teal-50/10 transition-colors group whitespace-nowrap">
                              <TableCell className="pl-8 py-5 font-mono font-black text-sm text-[#1a4d4a] uppercase tracking-tighter">{r.reportNumber || r.id.substring(0, 8)}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800">{r.material?.name || r.material?.markNo || r.material?.markSpec || r.material || '-'}</span>
                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 shadow-sm w-fit px-1 bg-slate-50 rounded">
                                      <Building2 className="h-3 w-3" /> {r.supplier || 'Unknown Supplier'}
                                    </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-teal-600 font-mono tracking-tighter uppercase">{r.material?.heatNumber || r.heatNumber || '-'}</span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">QTY: {r.material?.quantity || r.quantity || '-'} {r.material?.unit || 'PCS'}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                                      {r.inspector?.name?.substring(0,2).toUpperCase() || 'NA'}
                                    </div>
                                    <span className="text-xs font-bold text-slate-600">{r.inspector?.name || 'Unknown'}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest shadow-md border-none ${
                                    r.status === 'PASS' ? 'bg-emerald-500 text-white shadow-emerald-200' : 
                                    r.status === 'REJECT' ? 'bg-rose-500 text-white shadow-rose-200' : 'bg-amber-400 text-white shadow-amber-200'
                                }`}>
                                  {r.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-8">
                                <div className="flex justify-end">
                                  <DropdownMenu>
                                     <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-teal-600 cursor-pointer">
                                           <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                     </DropdownMenuTrigger>
                                     <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 bg-white ring-1 ring-slate-100 min-w-[180px]">
                                        <DropdownMenuItem onClick={() => handleEdit(r)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                           <Edit2 className="h-4 w-4 text-teal-500" /> Edit Details
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(r.id)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                           <Trash2 className="h-4 w-4" /> Remove Entry
                                        </DropdownMenuItem>
                                     </DropdownMenuContent>
                                  </DropdownMenu>
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
                    {reports.length === 0 ? (
                      <div className="py-20 text-center text-slate-400 font-medium">No incoming reports found.</div>
                    ) : (
                      reports.map((r) => (
                        <Card key={r.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
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
                                <h3 className="text-base font-black text-slate-800 leading-tight">
                                  {r.material?.name || r.material?.markNo || r.material?.markSpec || r.material || 'Unnamed Material'}
                                </h3>
                                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-1">
                                  <Building2 className="h-3 w-3" /> {r.supplier || 'Unknown Supplier'}
                                </p>
                              </div>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                       <MoreHorizontal className="h-4 w-4" />
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
                            
                            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                               <div>
                                 <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Heat / Batch</p>
                                 <p className="text-xs font-bold text-teal-600 font-mono truncate">{r.material?.heatNumber || r.heatNumber || '-'}</p>
                               </div>
                               <div>
                                 <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Quantity</p>
                                 <p className="text-xs font-bold text-slate-700">{r.material?.quantity || r.quantity || '-'} {r.material?.unit || 'PCS'}</p>
                               </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                               <div className="flex items-center gap-2">
                                 <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-500 border border-slate-200">
                                   {r.inspector?.name?.substring(0,2).toUpperCase() || 'NA'}
                                 </div>
                                 <p className="text-[10px] font-bold text-slate-600 truncate max-w-[120px]">{r.inspector?.name || 'Unknown Inspector'}</p>
                               </div>
                               <p className="text-[9px] font-bold text-slate-300 italic">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}</p>
                            </div>
                          </div>
                        </Card>
                      ))
                    )}
                  </div>
                </>
               )}
             </CardContent>
          </Card>
          
          <CreateIncomingReportModal 
             open={showCreateModal}
             onOpenChange={setShowCreateModal}
             onSuccess={loadReports}
          />

          {selectedReport && (
            <EditIncomingModal 
              report={selectedReport}
              open={showEditModal}
              onOpenChange={setShowEditModal}
              onSuccess={loadReports}
            />
          )}
    </main>
  )
}

function QuickStat({ label, value, icon: Icon, color, bg }: any) {
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
