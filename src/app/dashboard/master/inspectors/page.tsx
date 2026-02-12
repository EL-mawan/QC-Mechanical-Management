"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Mail, Shield, Loader2, Edit2, Trash2, MoreVertical } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect, useState } from "react"
import { getInspectors, deleteInspector } from "@/app/actions/master-actions"
import { toast } from "sonner"
import { EditInspectorModal } from "@/components/modals/EditInspectorModal"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

export default function InspectorsPage() {
  const [inspectors, setInspectors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedInspector, setSelectedInspector] = useState<any>(null)

  const loadData = async () => {
    setLoading(true)
    const data = await getInspectors()
    setInspectors(data)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleEdit = (inspector: any) => {
    setSelectedInspector(inspector)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from the inspector registry?`)) {
      const result = await deleteInspector(id)
      if (result.success) {
        toast.success(result.message)
        loadData()
      } else {
        toast.error(result.message)
      }
    }
  }

  return (
    <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#1a4d4a] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
                <Shield className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight">Master Inspectors</h1>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm italic font-medium">Manage quality control personnel and certifications</p>
              </div>
            </div>
            <Button className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Invite Inspector
            </Button>
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
            <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
                <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Expert Registry</CardTitle>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search inspector by name or email..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
               {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Validating Personnel...</p>
                  </div>
               ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none whitespace-nowrap">
                          <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Inspector</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Role</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Certifications</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Status</TableHead>
                          <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inspectors.length === 0 ? (
                           <TableRow>
                             <TableCell colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No inspectors found</TableCell>
                           </TableRow>
                        ) : (
                          inspectors.map((inspector) => (
                            <TableRow key={inspector.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                              <TableCell className="pl-8 py-5">
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inspector.name}`} />
                                    <AvatarFallback className="bg-teal-50 text-teal-700 font-bold">{inspector.name?.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex flex-col">
                                    <span className="font-bold text-slate-800">{inspector.name}</span>
                                    <span className="text-xs font-medium text-slate-400">{inspector.email}</span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-slate-600 text-sm italic">{inspector.role?.name || 'Inspector'}</TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-[10px] px-2 py-0.5 border-2 border-slate-100 rounded-lg text-slate-500 font-black tracking-widest uppercase">
                                    {inspector.certifications || 'Verified'}
                                  </Badge>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest border-none shadow-sm ${
                                    inspector.status === "ACTIVE" ? "bg-emerald-500 text-white shadow-emerald-500/10" : "bg-slate-200 text-slate-500"
                                  }`}
                                >
                                  {(inspector.status || "ACTIVE").toUpperCase()}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right pr-8">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-teal-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                    <Mail className="h-4 w-4" />
                                  </Button>
                                  <Button onClick={() => handleEdit(inspector)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-amber-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button onClick={() => handleDelete(inspector.id, inspector.name)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
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
                    {inspectors.map((inspector) => (
                      <Card key={inspector.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3 min-w-0 pr-2">
                              <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm shrink-0">
                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${inspector.name}`} />
                                <AvatarFallback className="bg-teal-50 text-teal-700 font-bold">{inspector.name?.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                 <h3 className="text-base font-black text-slate-800 leading-tight truncate">{inspector.name}</h3>
                                 <p className="text-xs font-bold text-slate-400 truncate">{inspector.role?.name || 'Inspector'}</p>
                              </div>
                            </div>
                            <DropdownMenu>
                               <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400">
                                     <MoreVertical className="h-4 w-4" />
                                  </Button>
                               </DropdownMenuTrigger>
                               <DropdownMenuContent align="end" className="rounded-xl p-2 bg-white shadow-2xl border-none ring-1 ring-slate-100 min-w-[150px]">
                                  <DropdownMenuItem onClick={() => handleEdit(inspector)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-slate-600 focus:bg-teal-50 focus:text-teal-700">
                                     <Edit2 className="h-4 w-4" /> Edit Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDelete(inspector.id, inspector.name)} className="rounded-lg font-bold flex items-center gap-2 px-3 py-2 text-rose-600 focus:bg-rose-50 focus:text-rose-700">
                                     <Trash2 className="h-4 w-4" /> Remove Personnel
                                  </DropdownMenuItem>
                               </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid grid-cols-1 gap-4 border-t border-slate-50 pt-4 mb-4">
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Email Contact</p>
                                <p className="text-xs font-bold text-slate-700 font-mono truncate">{inspector.email}</p>
                             </div>
                             <div>
                                <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Certifications</p>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="outline" className="text-[9px] font-black tracking-widest border-2 border-slate-100 px-2 py-0.5 text-slate-500 uppercase rounded-lg">
                                    {inspector.certifications || 'Verified'}
                                  </Badge>
                                </div>
                             </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50 gap-2">
                             <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-teal-600 font-bold bg-teal-50/50 hover:bg-teal-50 gap-2 w-full active:scale-95 transition-all text-xs">
                                <Mail className="h-4 w-4" /> Contact
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

          {selectedInspector && (
             <EditInspectorModal 
               inspector={selectedInspector}
               open={showEditModal}
               onOpenChange={setShowEditModal}
               onSuccess={loadData}
             />
          )}
    </main>
  )
}
