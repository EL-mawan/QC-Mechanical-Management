"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, AlertTriangle, FileText, CheckCircle2, Clock, MoreHorizontal, Trash2, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { deleteNCR } from "@/app/actions/qc-actions"
import { CreateNCRModal } from "@/components/modals/CreateNCRModal"
import { toast } from "sonner"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { MobileHub } from "@/components/mobile-hub"

export function NCRView({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [ncrs, setNcrs] = useState<any[]>(initialData)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [mobileView, setMobileView] = useState<'hub' | 'list'>('hub')

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this NCR?")) {
      const result = await deleteNCR(id)
      if (result.success) {
        toast.success("NCR deleted successfully")
        router.refresh()
      } else {
        toast.error("Failed to delete NCR")
      }
    }
  }

  const stats = {
    open: ncrs.filter(n => n.status?.toUpperCase() === 'OPEN').length,
    progress: ncrs.filter(n => n.status?.toUpperCase() === 'ON_PROGRESS').length,
    closed: ncrs.filter(n => n.status?.toUpperCase() === 'CLOSED').length
  }

  const hubItems = [
    {
      title: "NCR Registry",
      subtitle: "View All",
      icon: FileText,
      onClick: () => setMobileView('list'),
      color: "bg-red-500",
      lightColor: "bg-red-50"
    },
    {
      title: "New Issues",
      subtitle: "Open Status",
      icon: AlertTriangle,
      url: "#",
      color: "bg-amber-500",
      lightColor: "bg-amber-50"
    },
    {
      title: "Register NCR",
      subtitle: "Create New",
      icon: Plus,
      onClick: () => setShowCreateModal(true),
      color: "bg-indigo-500",
      lightColor: "bg-indigo-50"
    },
    {
      title: "Resolved",
      subtitle: "Closed Case",
      icon: CheckCircle2,
      url: "#",
      color: "bg-emerald-500",
      lightColor: "bg-emerald-50"
    }
  ]

  return (
    <main className="flex-1 p-4 sm:p-6 pb-24 md:pb-6">
          {/* Mobile Hub View */}
          {mobileView === 'hub' && (
            <div className="md:hidden">
              <MobileHub 
                title="NCR Management" 
                description="Quality Non-Conformance" 
                items={hubItems} 
              />
            </div>
          )}

          <div className={`${mobileView === 'hub' ? 'hidden md:flex' : 'flex'} flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6`}>
            <div>
              <div className="flex items-center gap-3">
                 {mobileView === 'list' && (
                   <Button onClick={() => setMobileView('hub')} variant="ghost" size="icon" className="md:hidden">
                      <Eye className="h-5 w-5 rotate-225" />
                   </Button>
                 )}
                 <h1 className="text-xl sm:text-2xl font-bold">NCR Management</h1>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">Monitor and resolve Non-Conformance Reports</p>
            </div>
            <Button 
               onClick={() => setShowCreateModal(true)}
               className="bg-red-600 hover:bg-red-700 rounded-xl w-full sm:w-auto h-10 sm:h-auto text-sm sm:text-base"
            >
              <Plus className="h-4 w-4 mr-2" /> Create NCR
            </Button>
          </div>

          <div className={`${mobileView === 'hub' ? 'hidden md:grid' : 'grid'} grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6`}>
            <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="bg-red-100 p-2 rounded-lg text-red-600">
                <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[8px] sm:text-xs text-muted-foreground uppercase font-black">Open NCR</p>
                <p className="text-lg sm:text-xl font-bold">{stats.open}</p>
              </div>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="bg-amber-100 p-2 rounded-lg text-amber-600">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[8px] sm:text-xs text-muted-foreground uppercase font-black">On Progress</p>
                <p className="text-lg sm:text-xl font-bold">{stats.progress}</p>
              </div>
            </Card>
            <Card className="border-none shadow-sm rounded-2xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <div>
                <p className="text-[8px] sm:text-xs text-muted-foreground uppercase font-black">Closed</p>
                <p className="text-lg sm:text-xl font-bold">{stats.closed}</p>
              </div>
            </Card>
          </div>

          <Card className={`${mobileView === 'hub' ? 'hidden md:block' : 'block'} border-none shadow-sm rounded-2xl`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 px-4 sm:px-6">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search NCR..." className="pl-10 h-10 rounded-xl text-sm" />
              </div>
            </CardHeader>
            <CardContent className="px-0 sm:px-6">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-none">
                      <TableHead className="font-semibold">NCR Number</TableHead>
                      <TableHead className="font-semibold">Description</TableHead>
                      <TableHead className="font-semibold">Project</TableHead>
                      <TableHead className="font-semibold">Inspector</TableHead>
                      <TableHead className="font-semibold">Status</TableHead>
                      <TableHead className="font-semibold text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                <TableBody>
                   {ncrs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-slate-500">No NCRs found.</TableCell>
                      </TableRow>
                   ) : (
                      ncrs.map((ncr) => (
                        <TableRow key={ncr.id} className="hover:bg-muted/50 border-none group">
                          <TableCell className="font-mono font-bold text-sm text-red-600">{ncr.ncrNumber}</TableCell>
                          <TableCell className="font-medium text-sm max-w-[200px] truncate">
                             <div className="flex flex-col">
                                <span>{ncr.description || ncr.title}</span>
                                {ncr.material && (
                                   <span className="text-[10px] text-teal-600 font-bold uppercase tracking-tight flex items-center gap-1 mt-0.5">
                                      <FileText className="h-3 w-3" /> {ncr.material.name || ncr.material.markNo}
                                   </span>
                                )}
                             </div>
                          </TableCell>
                          <TableCell className="text-xs text-slate-600 font-bold uppercase">{ncr.inspection?.project?.name || 'GENERIC'}</TableCell>
                          <TableCell className="text-xs font-medium text-slate-500">{ncr.inspection?.inspector?.name || 'QC INSPECTOR'}</TableCell>
                          <TableCell>
                            <Badge 
                              className={`rounded-lg border-none ${
                                 ncr.status?.toUpperCase() === "OPEN" ? "bg-red-100 text-red-600 hover:bg-red-200" : 
                                 ncr.status?.toUpperCase() === "ON_PROGRESS" ? "bg-amber-100 text-amber-600 hover:bg-amber-200" : 
                                 "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                              }`}
                            >
                              {ncr.status?.toUpperCase() || 'UNKNOWN'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                             <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-800">
                                      <MoreHorizontal className="h-4 w-4" />
                                   </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl">
                                   <DropdownMenuItem 
                                      onClick={() => router.push(`/dashboard/ncr/${ncr.id}`)}
                                      className="gap-2 cursor-pointer font-medium"
                                    >
                                      <Eye className="h-4 w-4" /> View Details
                                   </DropdownMenuItem>
                                   <DropdownMenuItem onClick={() => handleDelete(ncr.id)} className="gap-2 cursor-pointer font-medium text-red-600 focus:text-red-700 focus:bg-red-50">
                                      <Trash2 className="h-4 w-4" /> Delete NCR
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
              <div className={`${mobileView === 'hub' ? 'hidden' : 'block'} md:hidden space-y-3 px-4 pb-4`}>
                {ncrs.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No NCRs found.</div>
                ) : (
                  ncrs.map((ncr) => (
                    <Card key={ncr.id} className="border border-slate-100 shadow-sm p-4 hover:shadow-md transition-shadow bg-white rounded-2xl">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <Badge className="bg-red-50 text-red-600 border-red-200 font-mono font-bold text-[10px] mb-2">
                            {ncr.ncrNumber}
                          </Badge>
                          <p className="font-bold text-sm text-slate-800 line-clamp-2 leading-snug">
                            {ncr.description || ncr.title}
                          </p>
                          {ncr.material && (
                            <p className="text-[10px] text-teal-600 font-black uppercase mt-1.5 flex items-center gap-1 opacity-80">
                              <FileText className="h-3 w-3" /> {ncr.material.name || ncr.material.markNo}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0 -mr-2">
                              <MoreHorizontal className="h-4 w-4 text-slate-400" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl border-none shadow-2xl">
                            <DropdownMenuItem onClick={() => router.push(`/dashboard/ncr/${ncr.id}`)} className="gap-3 font-bold py-2.5">
                              <Eye className="h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(ncr.id)} className="gap-3 font-bold py-2.5 text-red-600 focus:text-red-700 focus:bg-red-50">
                              <Trash2 className="h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 mt-1">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Project</span>
                          <span className="text-[11px] text-slate-600 font-black truncate max-w-[120px]">{ncr.inspection?.project?.name || 'GENERIC'}</span>
                        </div>
                        <Badge className={`rounded-lg text-[10px] font-black tracking-tighter shadow-sm border-none ${
                          ncr.status?.toUpperCase() === "OPEN" ? "bg-red-500 text-white" : 
                          ncr.status?.toUpperCase() === "ON_PROGRESS" ? "bg-amber-500 text-white" : 
                          "bg-emerald-500 text-white"
                        }`}>
                          {ncr.status?.toUpperCase()}
                        </Badge>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
          
          <CreateNCRModal 
             open={showCreateModal}
             onOpenChange={setShowCreateModal}
             onSuccess={() => router.refresh()}
          />
    </main>
  )
}
