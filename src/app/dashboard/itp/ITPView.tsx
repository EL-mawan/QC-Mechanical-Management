"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileSignature, CheckSquare, Target, Clock, MoreHorizontal, ArrowUpRight, Loader2, Trash2, Edit } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { deleteITP } from "@/app/actions/qc-actions"
import { CreateITPModal } from "@/components/modals/CreateITPModal"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { MobileHub } from "@/components/mobile-hub"

export function ITPView({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [itps, setItps] = useState<any[]>(initialData)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingITP, setEditingITP] = useState<any>(null)
  const [mobileView, setMobileView] = useState<'hub' | 'list'>('hub')

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete ITP "${title}"?`)) {
      const res = await deleteITP(id)
      if (res.success) {
        toast.success(res.message)
        router.refresh()
      } else {
        toast.error(res.message)
      }
    }
  }

  const handleEdit = (itp: any) => {
    setEditingITP(itp)
    setShowCreateModal(true)
  }

  const hubItems = [
    {
      title: "ITP Library",
      subtitle: "View All",
      icon: CheckSquare,
      onClick: () => setMobileView('list'),
      color: "bg-teal-500",
      lightColor: "bg-teal-50"
    },
    {
      title: "New Design",
      subtitle: "Template",
      icon: Plus,
      onClick: () => {
        setEditingITP(null)
        setShowCreateModal(true)
      },
      color: "bg-orange-500",
      lightColor: "bg-orange-50"
    },
    {
      title: "Live Docs",
      subtitle: "Approved",
      icon: Target,
      url: "#", // Add filtering logic if needed
      color: "bg-blue-500",
      lightColor: "bg-blue-50"
    },
    {
      title: "Drafts",
      subtitle: "In Review",
      icon: Clock,
      url: "#",
      color: "bg-amber-500",
      lightColor: "bg-amber-50"
    }
  ]

  return (
    <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6">
          {/* Mobile Hub View */}
          {mobileView === 'hub' && (
            <div className="md:hidden">
              <MobileHub 
                title="ITP Services" 
                description="Inspection Management" 
                items={hubItems} 
              />
            </div>
          )}

          <div className={`${mobileView === 'hub' ? 'hidden md:flex' : 'flex'} flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8`}>
            <div className="flex items-center gap-3 sm:gap-4">
               {mobileView === 'list' && (
                 <Button onClick={() => setMobileView('hub')} variant="ghost" size="icon" className="md:hidden">
                    <ArrowUpRight className="h-5 w-5 rotate-225" />
                 </Button>
               )}
               <div className="bg-[#1a4d4a] p-2.5 sm:p-3 rounded-2xl shadow-xl shadow-teal-900/10 text-white">
                  <FileSignature className="h-5 w-5 sm:h-7 sm:w-7" />
               </div>
               <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight">Inspection Test Plans</h1>
                  <p className="text-muted-foreground text-xs sm:text-sm font-medium">Define Hold, Witness, and Review points</p>
               </div>
            </div>
            <Button 
               onClick={() => {
                 setEditingITP(null)
                 setShowCreateModal(true)
               }}
               className="bg-[#1a4d4a] hover:bg-teal-900 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center gap-2 shadow-lg shadow-teal-900/20 font-black w-full sm:w-auto text-sm sm:text-base"
            >
               <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Design New ITP
            </Button>
          </div>

          <div className={`${mobileView === 'hub' ? 'hidden md:grid' : 'grid'} grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8`}>
             <ITPStatCard label="Live Documents" value={itps.filter(i => i.status === 'APPROVED').length.toString()} icon={CheckSquare} color="text-teal-600" bg="bg-teal-50" />
             <ITPStatCard label="Total Frameworks" value={itps.length.toString()} icon={Target} color="text-blue-600" bg="bg-blue-50" />
             <ITPStatCard label="Drafts/Review" value={itps.filter(i => i.status !== 'APPROVED').length.toString()} icon={Clock} color="text-amber-600" bg="bg-amber-50" />
          </div>

          <Card className={`${mobileView === 'hub' ? 'hidden md:block' : 'block'} border-none shadow-sm rounded-3xl overflow-hidden bg-white`}>
             <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="text-xl font-black text-slate-800 tracking-tight">ITP Master Library</CardTitle>
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input placeholder="Search ITP title or ID..." className="pl-11 h-11 rounded-2xl border-slate-100 bg-slate-50/50 text-sm" />
                </div>
             </CardHeader>
             <CardContent className="p-0">
               {/* Desktop View */}
               <div className="hidden md:block">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                      <TableRow className="border-none">
                        <TableHead className="font-black text-slate-400 pl-10 h-14 uppercase text-[10px] tracking-widest">ITP Document</TableHead>
                        <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest">Assigned Project</TableHead>
                        <TableHead className="font-black text-slate-500 h-14 uppercase text-[10px] tracking-widest text-center">Stages</TableHead>
                        <TableHead className="font-black text-slate-400 h-14 text-center uppercase text-[10px] tracking-widest">Status</TableHead>
                        <TableHead className="text-right pr-10 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest">Action</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                      {itps.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No ITP documents found</TableCell>
                        </TableRow>
                      ) : (
                        itps.map((i) => (
                          <TableRow key={i.id} className="border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
                            <TableCell className="pl-10 py-6">
                              <div className="flex flex-col">
                                  <span className="font-black text-slate-800 text-lg group-hover:text-teal-700 transition-colors">{i.title}</span>
                                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 mt-1 uppercase tracking-widest">
                                    <FileSignature className="h-3 w-3 text-teal-500" /> {i.id.substring(0, 8)}...
                                  </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm font-bold text-slate-500">{i.project?.name || 'GENERIC'}</span>
                            </TableCell>
                            <TableCell className="text-center font-black text-slate-600">
                              {i.itpItems?.length || 0} Stages
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`rounded-xl px-4 py-1 text-[9px] font-black tracking-widest border-2 shadow-sm ${
                                  i.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                  i.status === 'ISSUED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                  i.status === 'DRAFT' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                              }`}>
                                {i.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right pr-10">
                              <div className="flex justify-end gap-2 text-slate-700">
                                  <Button 
                                    onClick={() => router.push(`/dashboard/itp/${i.id}`)}
                                    variant="ghost" size="sm" className="rounded-xl h-10 px-4 font-black text-teal-600 hover:bg-teal-50 flex items-center gap-2"
                                  >
                                    Details <ArrowUpRight className="h-4 w-4" />
                                  </Button>
                                  
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl text-slate-300 hover:text-slate-600">
                                          <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2">
                                        <DropdownMenuItem onClick={() => handleEdit(i)} className="rounded-lg font-bold gap-3 py-2.5">
                                          <Edit className="h-4 w-4" /> Edit Framework
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                          onClick={() => handleDelete(i.id, i.title)}
                                          className="rounded-lg font-bold gap-3 py-2.5 text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                                        >
                                          <Trash2 className="h-4 w-4" /> Delete ITP
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
                  {itps.length === 0 ? (
                    <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No ITP documents found</div>
                  ) : (
                    itps.map((i) => (
                      <Card key={i.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                        <div className="p-5">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 min-w-0 pr-4">
                              <h3 className="font-black text-slate-800 text-lg leading-tight group-hover:text-teal-700 truncate">{i.title}</h3>
                              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest flex items-center gap-1.5">
                                <FileSignature className="h-3 w-3 text-teal-500" /> {i.id.substring(0, 8)}
                              </p>
                            </div>
                            <Badge className={`rounded-xl px-3 py-0.5 text-[8px] font-black tracking-widest border shadow-sm ${
                                i.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                i.status === 'ISSUED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                                i.status === 'DRAFT' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-50 text-slate-500 border-slate-200'
                            }`}>
                              {i.status}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 pb-4 mb-4 border-b border-slate-50">
                            <div>
                              <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Project</p>
                              <p className="text-xs font-bold text-slate-600 truncate">{i.project?.name || 'GENERIC'}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-[9px] uppercase font-black text-slate-400 tracking-widest mb-1">Complexity</p>
                              <p className="text-xs font-bold text-slate-600">{i.itpItems?.length || 0} Stages</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              onClick={() => router.push(`/dashboard/itp/${i.id}`)}
                              className="flex-1 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-xl h-10 font-black text-xs transition-all active:scale-95"
                            >
                              Open Details
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl p-2 w-48">
                                <DropdownMenuItem onClick={() => handleEdit(i)} className="rounded-lg font-bold gap-3 py-2.5">
                                  <Edit className="h-4 w-4 text-slate-400" /> Edit Framework
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => handleDelete(i.id, i.title)}
                                  className="rounded-lg font-bold gap-3 py-2.5 text-rose-600 focus:text-rose-700 focus:bg-rose-50"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete ITP
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
               </div>
             </CardContent>
          </Card>

          <CreateITPModal 
             open={showCreateModal}
             onOpenChange={setShowCreateModal}
             onSuccess={() => router.refresh()}
             initialData={editingITP}
          />
    </main>
  )
}

function ITPStatCard({ label, value, icon: Icon, color, bg }: any) {
  return (
    <Card className="border-none shadow-sm rounded-3xl p-4 sm:p-6 bg-white border border-slate-50 flex items-center justify-between group hover:-translate-y-2 transition-transform duration-500">
       <div className="flex flex-col h-full justify-between">
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none">{label}</p>
          <p className="text-xl sm:text-4xl font-black text-slate-800 mt-2 sm:mt-4 tracking-tighter">{value}</p>
       </div>
       <div className={`${bg} ${color} p-2.5 sm:p-4 rounded-xl sm:rounded-3xl shadow-lg shadow-teal-900/5 group-hover:rotate-12 transition-transform`}>
          <Icon className="h-4 w-4 sm:h-7 sm:w-7" />
       </div>
    </Card>
  )
}
