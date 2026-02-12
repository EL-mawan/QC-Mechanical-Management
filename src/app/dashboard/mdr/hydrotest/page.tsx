"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileCheck2, Clock, Droplets, Activity, AlertTriangle, MoreHorizontal, Building2, Trash2, Edit2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getHydrotestPackages, deleteHydrotestPackage } from "@/app/actions/qc-actions"
import { CreateHydrotestPackageModal } from "@/components/modals/CreateHydrotestPackageModal"
import { EditHydrotestModal } from "@/components/modals/EditHydrotestModal"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

function QuickStat({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:-translate-y-1 transition-all border border-white/50 hover:shadow-md">
       <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-2xl shadow-inner transition-all group-hover:scale-110 group-hover:rotate-6`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
       </div>
       <div>
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">{label}</p>
          <p className="text-lg sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2">{value}</p>
       </div>
    </Card>
  )
}

export default function HydrotestMDRPage() {
  const [packages, setPackages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<any>(null)

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await getHydrotestPackages()
      setPackages(data)
    } catch (error) {
      console.error("Failed to load hydrotest packages:", error)
      toast.error("Failed to load packages")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this test package?")) {
      const result = await deleteHydrotestPackage(id)
      if (result.success) {
        toast.success("Package deleted successfully")
        loadData()
      } else {
        toast.error("Failed to delete package")
      }
    }
  }

  const handleEdit = (p: any) => {
    setSelectedPackage(p)
    setShowEditModal(true)
  }

  const stats = {
    total: packages.length,
    passed: packages.filter(p => p.status === 'APPROVED' || p.result === 'PASS').length,
    failed: packages.filter(p => p.status === 'FAILED' || p.result === 'FAIL').length,
    pending: packages.filter(p => p.status === 'READY' || p.status === 'TESTED').length
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-[#00acc1] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-cyan-900/10 text-white shrink-0">
              <Droplets className="h-6 w-6 sm:h-7 sm:w-7" />
           </div>
           <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">Hydrotest Packages</h1>
              <p className="text-muted-foreground text-xs sm:text-sm font-medium">Pressure Test Management & Records</p>
           </div>
        </div>
        <Button 
           onClick={() => setShowCreateModal(true)}
           className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Create Package
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
         <QuickStat label="Total Packages" value={stats.total.toString()} icon={Droplets} color="text-cyan-600" bg="bg-cyan-50" />
         <QuickStat label="Approved / Passed" value={stats.passed.toString()} icon={FileCheck2} color="text-emerald-600" bg="bg-emerald-50" />
         <QuickStat label="Failed / Rejected" value={stats.failed.toString()} icon={AlertTriangle} color="text-rose-600" bg="bg-rose-50" />
         <QuickStat label="Pending Final Appr." value={stats.pending.toString()} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
         <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="h-8 sm:h-10 w-1 flex bg-cyan-600 rounded-full" />
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Package Registry</CardTitle>
            </div>
            <div className="relative w-full sm:w-96">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Search package no, project or status..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
            </div>
         </CardHeader>
         <CardContent className="p-0">
           {loading ? (
              <div className="py-20 flex flex-col items-center justify-center gap-4">
                <Activity className="h-10 w-10 animate-pulse text-cyan-600" />
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading packages...</p>
              </div>
           ) : packages.length === 0 ? (
              <div className="py-20 text-center flex flex-col items-center gap-2">
                <Droplets className="h-12 w-12 text-slate-100" />
                <p className="text-sm font-bold text-slate-400">No packages found.</p>
              </div>
           ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                     <TableRow className="border-none whitespace-nowrap">
                       <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Test Pack No</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Project</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Test Date</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest text-center leading-none">Result</TableHead>
                       <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest text-center leading-none">Status</TableHead>
                       <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {packages.map((p) => (
                       <TableRow key={p.id} className="border-b border-slate-50 hover:bg-cyan-50/10 transition-colors group whitespace-nowrap">
                         <TableCell className="pl-8 py-5 font-mono font-black text-sm text-[#1a4d4a] uppercase">
                            {p.testPackNumber}
                         </TableCell>
                         <TableCell>
                            <div className="flex flex-col">
                               <span className="font-bold text-slate-800 text-base">{p.project?.name || 'Unknown'}</span>
                               <span className="text-[10px] font-bold text-cyan-600 uppercase mt-0.5 tracking-tight flex items-center gap-1.5 px-2 py-0.5 bg-cyan-50 w-fit rounded shadow-sm">
                                  <Building2 className="h-3 w-3" /> {p.project?.location || 'Handover'}
                               </span>
                            </div>
                         </TableCell>
                         <TableCell>
                            <span className="text-xs font-bold text-slate-400 font-mono italic">
                              {p.testDate ? new Date(p.testDate).toLocaleDateString() : '-'}
                            </span>
                         </TableCell>
                         <TableCell className="text-center">
                           {p.result ? (
                              <Badge className={`rounded-full px-5 py-1 text-[10px] font-black tracking-widest border-none shadow-md ${
                                 p.result === 'PASS' ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-rose-500 text-white shadow-rose-200'
                              }`}>
                                {p.result}
                              </Badge>
                           ) : <span className="text-xs font-bold text-slate-300">-</span>}
                         </TableCell>
                         <TableCell className="text-center">
                            <Badge variant="outline" className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest border-2 ${
                               p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                               p.status === 'FAILED' ? 'bg-rose-50 text-rose-600 border-rose-100' : 
                               'bg-amber-50 text-amber-600 border-amber-100'
                            }`}>
                               {p.status}
                            </Badge>
                         </TableCell>
                         <TableCell className="text-right pr-8">
                            <div className="flex justify-end">
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-2xl hover:bg-white hover:shadow-md transition-all text-slate-400 hover:text-cyan-600 cursor-pointer">
                                       <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 bg-white ring-1 ring-slate-100 min-w-[200px]">
                                    <DropdownMenuItem onClick={() => handleEdit(p)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-slate-600 focus:bg-cyan-50 focus:text-cyan-700">
                                       <Edit2 className="h-4 w-4 text-cyan-500" /> Edit Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleDelete(p.id)} className="rounded-xl flex items-center gap-3 px-4 py-3 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                       <Trash2 className="h-4 w-4" /> Delete Package
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
                 {packages.map((p) => (
                   <Card key={p.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                     <div className="p-5">
                       <div className="flex justify-between items-start mb-4">
                         <div className="min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-mono font-black text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded uppercase">{p.testPackNumber}</span>
                              {p.result && (
                                <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                  p.result === 'PASS' ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-500 text-white shadow-rose-100'
                                }`}>
                                  {p.result}
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-base font-black text-slate-800 leading-tight">Pressure Test Pack</h3>
                            <p className="text-[10px] font-bold text-cyan-600 uppercase tracking-tight mt-1 truncate">{p.project?.name || 'No Project'}</p>
                         </div>
                         <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                               </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl border-none shadow-xl p-2 bg-white ring-1 ring-slate-100">
                               <DropdownMenuItem onClick={() => handleEdit(p)} className="px-3 py-2.5 rounded-xl font-bold text-[11px] text-slate-600 focus:bg-cyan-50 flex items-center gap-2">
                                  <Edit2 className="h-3 w-3 text-cyan-500" /> Edit
                               </DropdownMenuItem>
                               <DropdownMenuItem onClick={() => handleDelete(p.id)} className="px-3 py-2.5 rounded-xl font-bold text-[11px] text-rose-600 focus:bg-rose-50 flex items-center gap-2">
                                  <Trash2 className="h-3 w-3" /> Delete
                               </DropdownMenuItem>
                            </DropdownMenuContent>
                         </DropdownMenu>
                       </div>

                       <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                          <div>
                             <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Test Status</p>
                             <Badge variant="outline" className={`rounded-full px-2 py-0.5 text-[9px] font-bold border ${
                                p.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 
                                p.status === 'FAILED' ? 'bg-rose-50 text-rose-600 border-rose-200' : 
                                'bg-amber-50 text-amber-600 border-amber-200'
                             }`}>
                               {p.status}
                             </Badge>
                          </div>
                          <div>
                             <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Test Date</p>
                             <p className="text-xs font-bold text-slate-700 font-mono italic">{p.testDate ? new Date(p.testDate).toLocaleDateString() : '-'}</p>
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                          <div className="flex items-center gap-2">
                             <Building2 className="h-3.5 w-3.5 text-slate-300" />
                             <p className="text-[10px] font-bold text-slate-400 truncate max-w-[120px] uppercase tracking-tighter">{p.project?.location || 'In-Shop'}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="h-8 px-3 rounded-xl text-cyan-600 font-bold bg-cyan-50/50 hover:bg-cyan-50 gap-2 text-[10px] active:scale-95 transition-all">
                             <Activity className="h-3 w-3" /> View Specs
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
      
      <CreateHydrotestPackageModal 
         open={showCreateModal}
         onOpenChange={setShowCreateModal}
         onSuccess={loadData}
      />

      {selectedPackage && (
        <EditHydrotestModal 
          packageData={selectedPackage}
          open={showEditModal}
          onOpenChange={setShowEditModal}
          onSuccess={loadData}
        />
      )}
    </main>
  )
}
