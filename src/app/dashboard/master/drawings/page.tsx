"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileCode2, Download, RotateCcw, Building2, Calendar, Loader2, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { getDrawings, deleteDrawing } from "@/app/actions/master-actions"
import { toast } from "sonner"
import { EditDrawingModal } from "@/components/modals/EditDrawingModal"
import { CreateDrawingModal } from "@/components/modals/CreateDrawingModal"

export default function DrawingsPage() {
  const [drawings, setDrawings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDrawing, setSelectedDrawing] = useState<any>(null)

  const loadDrawings = async () => {
    setLoading(true)
    const data = await getDrawings()
    setDrawings(data)
    setLoading(false)
  }

  useEffect(() => {
    loadDrawings()
  }, [])

  const handleEdit = (drawing: any) => {
    setSelectedDrawing(drawing)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string, number: string) => {
    if (confirm(`Are you sure you want to delete drawing "${number}"?`)) {
      const result = await deleteDrawing(id)
      if (result.success) {
        toast.success(result.message)
        loadDrawings()
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
                <FileCode2 className="h-6 w-6 sm:h-7 sm:w-7" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight">Technical Drawings</h1>
                <p className="text-muted-foreground mt-1 text-xs sm:text-sm italic font-medium">Standard & Project Specific Engineering Data</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Upload Drawing
            </Button>
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
            <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
                <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Vault Registry</CardTitle>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input placeholder="Search drawing number or title..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
               {loading ? (
                  <div className="py-20 flex flex-col items-center justify-center">
                    <Loader2 className="h-10 w-10 animate-spin text-teal-600 mb-4" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Accessing Vault...</p>
                  </div>
               ) : (
                <>
                  {/* Desktop View */}
                  <div className="hidden md:block overflow-x-auto">
                    <Table>
                      <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-none whitespace-nowrap">
                          <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Drawing No</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Title & Project</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none text-center">Version</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Release Date</TableHead>
                          <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {drawings.length === 0 ? (
                           <TableRow>
                             <TableCell colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No drawings found</TableCell>
                           </TableRow>
                        ) : (
                          drawings.map((dwg) => (
                            <TableRow key={dwg.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                              <TableCell className="pl-8 py-6 font-mono font-black text-sm text-[#1a4d4a] group-hover:text-teal-600 transition-colors">{dwg.number}</TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-bold text-slate-800 text-base">{dwg.title}</span>
                                  <span className="text-[10px] font-bold text-teal-600/60 flex items-center gap-1 uppercase tracking-tight">
                                    <Building2 className="h-3 w-3" /> {dwg.project?.name || 'Standard'}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="outline" className="rounded-lg bg-teal-50/50 text-teal-700 border-teal-100 font-black px-3 py-1 uppercase text-[10px] tracking-widest">
                                  REV {dwg.revision}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-xs font-bold text-slate-400 flex items-center gap-2 h-14">
                                <Calendar className="h-3.5 w-3.5 text-slate-300" /> {new Date(dwg.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell className="text-right pr-8">
                                <div className="flex justify-end gap-1">
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-teal-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                  <Button onClick={() => handleEdit(dwg)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-amber-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button onClick={() => handleDelete(dwg.id, dwg.number)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-300 hover:text-rose-600 hover:bg-white hover:shadow-md transition-all cursor-pointer">
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
                    {drawings.map((dwg) => (
                      <Card key={dwg.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0 pr-2">
                               <div className="flex items-center gap-2 mb-1">
                                 <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase tracking-tighter">{dwg.number}</span>
                                 <Badge variant="outline" className="rounded-full px-2 py-0.5 text-[9px] font-black border-teal-100 text-teal-600 bg-teal-50/30">REV {dwg.revision}</Badge>
                               </div>
                               <h3 className="text-base font-black text-slate-800 leading-tight">{dwg.title}</h3>
                               <p className="text-[10px] font-bold text-teal-600/60 uppercase tracking-tight mt-1 flex items-center gap-1">
                                 <Building2 className="h-3 w-3" /> {dwg.project?.name || 'Standard'}
                               </p>
                            </div>
                            <div className="flex flex-col gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-teal-50 text-teal-600">
                                <Download className="h-3.5 w-3.5" />
                              </Button>
                              <Button onClick={() => handleDelete(dwg.id, dwg.number)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-rose-50 text-rose-400">
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                             <div className="flex items-center gap-2 text-slate-400 font-medium">
                               <Calendar className="h-3.5 w-3.5" />
                               <span className="text-[10px] font-bold">{new Date(dwg.createdAt).toLocaleDateString()}</span>
                             </div>
                             <Button onClick={() => handleEdit(dwg)} variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-amber-600 font-bold bg-amber-50/50 hover:bg-amber-50 gap-2 active:scale-95 transition-all text-[10px]">
                                <Edit2 className="h-3.5 w-3.5" /> Edit Master
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

          {selectedDrawing && (
            <EditDrawingModal 
              drawing={selectedDrawing}
              open={showEditModal}
              onOpenChange={setShowEditModal}
              onSuccess={loadDrawings}
            />
          )}

          <CreateDrawingModal 
            open={showCreateModal}
            onOpenChange={setShowCreateModal}
            onSuccess={loadDrawings}
          />
    </main>
  )
}
