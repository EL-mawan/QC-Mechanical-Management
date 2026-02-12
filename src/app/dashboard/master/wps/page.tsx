"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileCode2, ShieldCheck, Zap, Scissors, Layers, FileText, Loader2, Edit2, Trash2, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getWPS, deleteWPS } from "@/app/actions/master-actions"
import { toast } from "sonner"
import { EditWPSModal } from "@/components/modals/EditWPSModal"
import { CreateWPSModal } from "@/components/modals/CreateWPSModal"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function WPSPage() {
  const [wpsEntries, setWpsEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedWps, setSelectedWps] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    const data = await getWPS()
    setWpsEntries(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (wps: any) => {
    setSelectedWps(wps)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string, number: string) => {
    if (confirm(`Are you sure you want to delete WPS "${number}"?`)) {
      const result = await deleteWPS(id)
      if (result.success) {
        toast.success(result.message)
        loadData()
      } else {
        toast.error(result.message)
      }
    }
  }

  const stats = {
    smaw: wpsEntries.filter(w => w.process === 'SMAW').length,
    gtaw: wpsEntries.filter(w => w.process === 'GTAW').length,
    fcaw: wpsEntries.filter(w => w.process === 'FCAW').length,
    saw: wpsEntries.filter(w => w.process === 'SAW').length,
  }

  return (
    <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#1a4d4a] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
                <FileCode2 className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight">WPS Standards</h1>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm italic font-medium">Welding Procedure Specifications & Qualifications</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Register New WPS
            </Button>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <StatAction label="SMAW" count={`${stats.smaw} Procedures`} icon={Zap} color="text-amber-600" bg="bg-amber-50" />
            <StatAction label="GTAW" count={`${stats.gtaw} Procedures`} icon={Scissors} color="text-blue-600" bg="bg-blue-50" />
            <StatAction label="FCAW" count={`${stats.fcaw} Procedures`} icon={ShieldCheck} color="text-purple-600" bg="bg-purple-50" />
            <StatAction label="SAW" count={`${stats.saw} Procedures`} icon={Layers} color="text-emerald-600" bg="bg-emerald-50" />
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
            <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
                <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Procedure Database</CardTitle>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search WPS number or process..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
               {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Scanning Registry...</p>
                  </div>
               ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none whitespace-nowrap">
                          <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">WPS Number</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Process</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Filler Metal</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Position</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Status</TableHead>
                          <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {wpsEntries.length === 0 ? (
                           <TableRow>
                             <TableCell colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No procedures found</TableCell>
                           </TableRow>
                        ) : (
                          wpsEntries.map((wps) => (
                            <TableRow key={wps.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                              <TableCell className="pl-8 py-5 font-mono font-black text-sm text-[#1a4d4a]">{wps.number}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="rounded-lg bg-teal-50/50 text-teal-700 border-teal-100 font-black px-3 py-1 uppercase text-[10px] tracking-tight">
                                   {wps.process}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm font-bold text-slate-700">{wps.fillerMetal}</TableCell>
                              <TableCell className="text-sm font-bold text-slate-400 italic">{wps.position}</TableCell>
                              <TableCell>
                                <Badge 
                                  className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest border-none shadow-sm ${
                                    wps.status === 'APPROVED' ? 'bg-emerald-500 text-white shadow-emerald-500/10' : 'bg-amber-400 text-white shadow-amber-400/10'
                                  }`}
                                >
                                  {(wps.status || 'PENDING').toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-8">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-teal-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button onClick={() => handleEdit(wps)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-amber-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button onClick={() => handleDelete(wps.id, wps.number)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
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
                    {wpsEntries.map((wps) => (
                      <Card key={wps.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-2">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">{wps.number}</span>
                                 <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                                   wps.status === 'APPROVED' ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'
                                 }`}>
                                   {wps.status}
                                 </Badge>
                               </div>
                               <h3 className="text-base font-black text-slate-800 leading-tight">Welding Procedure</h3>
                            </div>
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                     <MoreVertical className="h-4 w-4" />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="rounded-xl p-2 bg-white shadow-2xl border-none ring-1 ring-slate-100 min-w-[150px]">
                                  <DropdownMenuItem onClick={() => handleEdit(wps)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                     <Edit2 className="h-4 w-4" /> Edit WPS
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(wps.id, wps.number)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                     <Trash2 className="h-4 w-4" /> Delete WPS
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Filler Metal</p>
                                <p className="text-xs font-bold text-slate-700">{wps.fillerMetal}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Position</p>
                                <p className="text-xs font-bold text-slate-700 italic">{wps.position}</p>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                             <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-teal-600 font-bold bg-teal-50/50 hover:bg-teal-50 gap-2 w-full active:scale-95 transition-all text-xs">
                                <FileText className="h-4 w-4" /> View Technical Spec
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

          {selectedWps && (
             <EditWPSModal 
               wps={selectedWps}
               open={showEditModal}
               onOpenChange={setShowEditModal}
               onSuccess={loadData}
             />
          )}

          <CreateWPSModal 
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onSuccess={loadData}
          />
    </main>
  )
}

function StatAction({ label, count, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 bg-white hover:bg-[#1a4d4a] transition-all cursor-pointer group hover:-translate-y-1">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={`${bg} ${color} p-2 sm:p-3 rounded-xl group-hover:bg-white/20 group-hover:text-white transition-all shadow-inner shrink-0`}>
           <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
           <p className="font-black text-slate-800 leading-tight group-hover:text-white transition-colors text-sm sm:text-base truncate">{label}</p>
           <p className="text-[8px] sm:text-[10px] text-slate-400 font-bold uppercase mt-0.5 group-hover:text-teal-100 transition-colors tracking-widest leading-none truncate">{count}</p>
        </div>
      </div>
    </Card>
  )
}
