"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, UserCheck, Award, TrendingUp, Loader2, UserPlus, MoreVertical, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getWelders, createWelder, deleteWelder } from "@/app/actions/master-actions"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { EditWelderModal } from "@/components/modals/EditWelderModal"
import { toast } from "sonner"

export default function WeldersPage() {
  const [welders, setWelders] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedWelder, setSelectedWelder] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    idNumber: "",
    performance: 100
  })

  const loadWelders = async () => {
    setIsLoading(true)
    const data = await getWelders()
    setWelders(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadWelders()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await createWelder(formData)
    if (res.success) {
      toast.success("Welder registered successfully")
      setShowAddModal(false)
      loadWelders()
      setFormData({ name: "", idNumber: "", performance: 100 })
    }
    setIsSubmitting(false)
  }

  const handleEdit = (welder: any) => {
    setSelectedWelder(welder)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete welder "${name}"?`)) {
      const result = await deleteWelder(id)
      if (result.success) {
        toast.success(result.message || "Welder deleted", { description: "Removed from registry", duration: 4000 })
        loadWelders()
      } else {
        toast.error(result.message || "Failed to delete", { description: "Could not remove welder", duration: 5000 })
      }
    }
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight">Welder Registry</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm italic font-medium">Tracking certification and performance scores</p>
        </div>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a4d4a] hover:bg-teal-900 rounded-xl sm:rounded-2xl px-6 sm:px-8 h-10 sm:h-12 flex items-center gap-2 shadow-xl shadow-teal-900/20 font-bold transition-all transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
              <UserPlus className="h-4 w-4 sm:h-5 sm:w-5" /> Enroll Welder
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
            <div className="bg-[#1a4d4a] p-8 text-white">
               <Award className="h-8 w-8 mb-4 text-teal-300" />
               <DialogTitle className="text-2xl font-black">Register Expert Welder</DialogTitle>
               <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Enroll a new welder into the project tracking</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Full Legal Name</Label>
                    <Input 
                      placeholder="e.g. Robert Pattinson" 
                      required 
                      className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Certification ID (Stamp)</Label>
                    <Input 
                      placeholder="e.g. W-7728-XYZ" 
                      required 
                      className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-mono font-bold"
                      value={formData.idNumber}
                      onChange={e => setFormData({...formData, idNumber: e.target.value})}
                    />
                  </div>
               </div>
               <DialogFooter className="mt-8">
                 <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 font-black shadow-lg shadow-teal-600/20 cursor-pointer">
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Enroll Welder"}
                 </Button>
               </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
         <StatCard label="Top Performer" value={welders[0]?.name || "N/A"} icon={Award} color="bg-teal-600" />
         <StatCard label="Avg. Repair Rate" value="4.2%" icon={TrendingUp} color="bg-blue-600" />
         <StatCard label="Total Crew" value={welders.length.toString()} icon={UserCheck} color="bg-emerald-600" />
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
         <CardHeader className="p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-50 gap-4">
            <CardTitle className="text-xl font-black text-slate-800">Master Roster</CardTitle>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Filter by stamp ID..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 text-sm" />
            </div>
         </CardHeader>
         <CardContent className="p-0">
            {isLoading ? (
               <div className="py-24 flex flex-col items-center gap-4">
                  <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Accessing Crew Registry...</p>
               </div>
            ) : (
              <>
                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none whitespace-nowrap">
                          <TableHead className="pl-10 h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">Full Name & ID</TableHead>
                          <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-center">Total Joints</TableHead>
                          <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-center">Repair Rate</TableHead>
                          <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-right pr-10">Perf. Score</TableHead>
                          <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-right pr-12">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {welders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="py-20 text-center text-slate-400 font-black whitespace-nowrap uppercase tracking-widest text-[10px]">No Crew Members Found</TableCell>
                        </TableRow>
                      ) : (
                        welders.map((w) => (
                          <TableRow key={w.id} className="group border-b border-slate-50 hover:bg-teal-50/10 cursor-pointer whitespace-nowrap">
                            <TableCell className="pl-10 py-6">
                                <div className="flex flex-col">
                                  <span className="text-lg font-black text-slate-800 group-hover:text-teal-700 transition-colors">{w.name}</span>
                                  <span className="text-[10px] font-bold text-teal-600 uppercase tracking-tighter mt-1">{w.idNumber} / CERTIFIED</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-center font-bold text-slate-600">{w.totalWelds} JOINTS</TableCell>
                            <TableCell className="text-center">
                                <Badge className={`rounded-xl px-3 py-1 font-black text-[10px] border-none shadow-sm ${w.repairRate < 5 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                  {w.repairRate}% REPAIR
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-10">
                                <div className="flex items-center justify-end gap-3">
                                  <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                                      <div className="bg-teal-500 h-full" style={{ width: `${w.performance}%` }} />
                                  </div>
                                  <span className="text-xs font-black text-slate-800">{w.performance}</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-right pr-12">
                              <div className="flex justify-end gap-1">
                                <Button onClick={() => handleEdit(w)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-300 hover:text-teal-600 transition-all shadow-none hover:shadow-md cursor-pointer">
                                  <Edit2 className="h-4 w-4" />
                                </Button>
                                <Button onClick={() => handleDelete(w.id, w.name)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-300 hover:text-rose-600 transition-all shadow-none hover:shadow-md cursor-pointer">
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
                  {welders.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 font-black uppercase tracking-widest text-[10px]">No Crew Members Found</div>
                  ) : (
                    welders.map((w) => (
                      <Card key={w.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-2">
                              <h3 className="text-lg font-black text-slate-800 leading-tight">{w.name}</h3>
                              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mt-1">{w.idNumber} / CERTIFIED</p>
                            </div>
                            <div className="flex gap-2">
                              <Button onClick={() => handleEdit(w)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                <Edit2 className="h-3.5 w-3.5" />
                              </Button>
                              <Button onClick={() => handleDelete(w.id, w.name)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-rose-50 text-rose-400">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                            <div>
                              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Repair Rate</p>
                              <Badge className={`rounded-xl px-2 py-0.5 font-black text-[9px] border-none ${w.repairRate < 5 ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                {w.repairRate}%
                              </Badge>
                            </div>
                            <div>
                              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Total Joints</p>
                              <p className="text-sm font-bold text-slate-700">{w.totalWelds} JOINTS</p>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-slate-50">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Performance Score</p>
                              <span className="text-xs font-black text-teal-600">{w.performance}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-teal-500 h-full" style={{ width: `${w.performance}%` }} />
                            </div>
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
      {selectedWelder && (
        <EditWelderModal 
          key={selectedWelder.id}
          welder={selectedWelder} 
          open={showEditModal} 
          onOpenChange={setShowEditModal} 
          onSuccess={loadWelders}
        />
      )}
    </main>
  )
}

function StatCard({ label, value, icon: Icon, color }) {
  return (
    <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:shadow-lg transition-all">
       <div className={`${color} p-2 sm:p-4 rounded-xl sm:rounded-2xl text-white shadow-lg shadow-teal-900/10 group-hover:scale-110 transition-transform`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
       </div>
       <div className="min-w-0">
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1 sm:mb-2 truncate">{label}</p>
          <p className="text-sm sm:text-xl font-black text-slate-800 tracking-tight truncate">{value}</p>
       </div>
    </Card>
  )
}
