"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MapPin, Calendar, Layout, MoreHorizontal, Loader2, Building2, Edit2, Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getProjects, createProject, deleteProject } from "@/app/actions/master-actions"
import { getClients } from "@/app/actions/client-actions"
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
import { EditProjectModal } from "@/components/modals/EditProjectModal"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    clientId: "",
    status: "ONGOING"
  })

  const loadData = async () => {
    setIsLoading(true)
    const [pData, cData] = await Promise.all([getProjects(), getClients()])
    setProjects(pData)
    setClients(cData)
    setIsLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientId) {
      toast.error("✗ Silakan pilih client terlebih dahulu", {
        description: "Client harus dipilih untuk membuat project",
        duration: 4000,
      })
      return
    }
    
    setIsSubmitting(true)
    const res = await createProject(formData)
    if (res.success) {
      toast.success(res.message || "Project berhasil diluncurkan", {
        description: "Project telah tersimpan ke database",
        duration: 4000,
      })
      setShowAddModal(false)
      loadData()
      setFormData({ name: "", location: "", clientId: "", status: "ONGOING" })
    } else {
      toast.error(res.message || "Gagal membuat project", {
        description: "Silakan periksa data dan coba lagi",
        duration: 5000,
      })
    }
    setIsSubmitting(false)
  }

  const handleEdit = (project: any) => {
    setSelectedProject(project)
    setShowEditModal(true)
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete project "${name}"?`)) {
      const result = await deleteProject(id)
      if (result.success) {
        toast.success(result.message || "Project deleted", { description: "Data deleted from database", duration: 4000 })
        loadData()
      } else {
        toast.error(result.message || "Failed to delete", { description: "Failed to delete project", duration: 5000 })
      }
    }
  }

  return (
    <main className="flex-1 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight">Active Projects</h1>
              <p className="text-muted-foreground mt-1 text-xs sm:text-sm italic font-medium">Monitoring fabrication progress and site locations</p>
            </div>

            <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
              <DialogTrigger asChild>
                <Button className="bg-[#1a4d4a] hover:bg-teal-900 rounded-xl sm:rounded-2xl px-6 sm:px-8 h-10 sm:h-12 flex items-center gap-2 shadow-xl shadow-teal-900/20 font-bold transition-all transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Start New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
                <div className="bg-[#1a4d4a] p-8 text-white">
                   <Layout className="h-8 w-8 mb-4 text-teal-300" />
                   <DialogTitle className="text-2xl font-black">Project Initiation</DialogTitle>
                   <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Define new project scope & client</p>
                </div>
                <form onSubmit={handleSubmit} className="p-8 space-y-5">
                   <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Project Assignment</Label>
                        <Input 
                          placeholder="e.g. Fabrication of Main Deck Section" 
                          required 
                          className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Operational Location</Label>
                        <Input 
                          placeholder="e.g. Workshop Yard 2" 
                          required 
                          className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Parent Client</Label>
                        <Select onValueChange={val => setFormData({...formData, clientId: val})}>
                           <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                              <SelectValue placeholder="Select corporate entity" />
                           </SelectTrigger>
                           <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                              {clients.map(c => (
                                <SelectItem key={c.id} value={c.id} className="rounded-xl font-bold py-3 hover:bg-teal-50">
                                   {c.name}
                                </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                      </div>
                   </div>
                   <DialogFooter className="mt-8">
                     <Button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 font-black shadow-lg shadow-teal-600/20 cursor-pointer">
                        {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Authorize Project Site"}
                     </Button>
                   </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md">
             <CardHeader className="p-4 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-50 gap-4">
                <div className="flex items-center gap-4">
                   <div className="h-8 sm:h-10 w-1.5 flex bg-teal-600 rounded-full" />
                   <CardTitle className="text-xl font-black text-slate-800">Operational Registry</CardTitle>
                </div>
                <div className="relative w-full sm:w-80">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                   <Input placeholder="Search project name..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 text-sm" />
                </div>
             </CardHeader>
             <CardContent className="p-0">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-24 gap-4">
                     <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Querying Operational Data...</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-none whitespace-nowrap">
                              <TableHead className="pl-10 h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">Project & Client</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">Location</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-center">Inspec. Count</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-center">Status</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-right pr-10">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {projects.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No Projects Found</TableCell>
                            </TableRow>
                          ) : (
                            projects.map((project) => (
                              <TableRow key={project.id} className="group border-b border-slate-50 hover:bg-teal-50/10 cursor-pointer whitespace-nowrap">
                                <TableCell className="pl-10 py-6">
                                    <div className="flex flex-col">
                                      <span className="text-lg font-black text-slate-800 group-hover:text-teal-700 transition-colors uppercase">{project.name}</span>
                                      <span className="text-xs font-bold text-slate-400 flex items-center gap-1 mt-1">
                                          <Building2 className="h-3.5 w-3.5 text-teal-600/50" /> {project.client?.name}
                                      </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                      <MapPin className="h-4 w-4 text-rose-500/50" /> {project.location || "Site Unmapped"}
                                    </div>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge className="bg-slate-100 text-slate-600 border-none font-black px-3 py-1 rounded-xl shadow-inner">
                                      {project._count.reports} REPORTS
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">
                                    <Badge className={`rounded-full px-4 py-1 text-[10px] font-black tracking-widest border-none ring-1 ${
                                      project.status === 'COMPLETED' ? 'bg-emerald-500 text-white ring-emerald-500/10' : 'bg-teal-50 text-teal-600 ring-teal-600/10'
                                    }`}>
                                      {project.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-10">
                                  <div className="flex justify-end gap-1">
                                    <Button onClick={() => handleEdit(project)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-300 hover:text-teal-600 transition-all shadow-none hover:shadow-md cursor-pointer">
                                      <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button onClick={() => handleDelete(project.id, project.name)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-300 hover:text-rose-600 transition-all shadow-none hover:shadow-md cursor-pointer">
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
                      {projects.length === 0 ? (
                        <div className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No Projects Found</div>
                      ) : (
                        projects.map((project) => (
                          <Card key={project.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                            <div className="p-5">
                              <div className="flex justify-between items-start mb-4">
                                <div className="min-w-0 pr-2">
                                  <h3 className="text-lg font-black text-slate-800 uppercase truncate leading-tight">{project.name}</h3>
                                  <p className="text-[10px] font-bold text-teal-600 flex items-center gap-1 mt-1 truncate">
                                    <Building2 className="h-3 w-3" /> {project.client?.name}
                                  </p>
                                </div>
                                <Badge className={`rounded-full px-3 py-0.5 text-[8px] font-black tracking-widest border-none ring-1 shrink-0 ${
                                  project.status === 'COMPLETED' ? 'bg-emerald-500 text-white ring-emerald-500/10' : 'bg-teal-50 text-teal-600 ring-teal-600/10'
                                }`}>
                                  {project.status}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-2 mb-4">
                                <div className="bg-rose-50 p-1.5 rounded-lg">
                                  <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                </div>
                                <span className="text-xs font-bold text-slate-600">{project.location || "Site Unmapped"}</span>
                              </div>

                              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div className="flex items-center gap-1.5">
                                  <div className="bg-slate-50 px-3 py-1 rounded-full text-[10px] font-black text-slate-500 border border-slate-100">
                                    {project._count.reports} REPORTS
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button onClick={() => handleEdit(project)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-slate-50 text-slate-400 cursor-pointer">
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button onClick={() => handleDelete(project.id, project.name)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-rose-50 text-rose-400 cursor-pointer">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
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
          {selectedProject && (
            <EditProjectModal 
              key={selectedProject.id}
              project={selectedProject} 
              clients={clients}
              open={showEditModal} 
              onOpenChange={setShowEditModal} 
              onSuccess={loadData}
            />
          )}
    </main>
  )
}
