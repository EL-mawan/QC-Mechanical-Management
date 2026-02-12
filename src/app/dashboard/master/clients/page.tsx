"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit2, Trash2, Mail, Building2, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { getClients, createClient, deleteClient } from "@/app/actions/client-actions"
import { toast } from "sonner"
import { EditClientModal } from "@/components/modals/EditClientModal"

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  })

  const loadClients = async () => {
    setIsLoading(true)
    const data = await getClients()
    setClients(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadClients()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await createClient(formData)
    
    if (result.success) {
      toast.success(result.message || "Client berhasil ditambahkan", {
        description: "Data telah tersimpan ke database",
        duration: 4000,
      })
      setShowAddModal(false)
      loadClients()
      setFormData({ name: "", email: "", contact: "" })
    } else {
      toast.error(result.message || "Gagal menambahkan client", {
        description: "Silakan periksa data dan coba lagi",
        duration: 5000,
      })
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string, clientName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus client "${clientName}"?`)) {
      const result = await deleteClient(id)
      if (result.success) {
        toast.success(result.message || "Client berhasil dihapus", {
          description: "Data telah dihapus dari database",
          duration: 4000,
        })
        loadClients()
      } else {
        toast.error(result.message || "Gagal menghapus client", {
          description: "Terjadi kesalahan saat menghapus data",
          duration: 5000,
        })
      }
    }
  }

  const handleEdit = (client: any) => {
    setSelectedClient(client)
    setShowEditModal(true)
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1a4d4a] tracking-tight">Client Hub</h1>
          <p className="text-muted-foreground mt-1 text-xs sm:text-sm italic">Manage your corporate partners & database connections</p>
        </div>
        
        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogTrigger asChild>
            <Button className="bg-[#1a4d4a] hover:bg-teal-900 rounded-xl sm:rounded-2xl px-6 sm:px-8 h-10 sm:h-12 flex items-center gap-2 shadow-xl shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Add New Client
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
            <div className="bg-[#1a4d4a] p-8 text-white relative">
               <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4">
                  <Building2 className="h-6 w-6" />
               </div>
               <DialogTitle className="text-2xl font-black tracking-tight">New Client Account</DialogTitle>
               <p className="text-teal-100/60 text-xs font-medium mt-1">Register a new corporate entity to the system</p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-slate-600 font-bold text-xs uppercase tracking-widest pl-1">Company Name</Label>
                  <Input 
                    id="name" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-inner px-4 border-2 focus:border-teal-500 font-bold" 
                    placeholder="e.g. PT Energy Persada"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="text-slate-600 font-bold text-xs uppercase tracking-widest pl-1">Primary Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-inner px-4 border-2 focus:border-teal-500 font-bold" 
                    placeholder="contact@company.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                   <Label htmlFor="contact" className="text-slate-600 font-bold text-xs uppercase tracking-widest pl-1">Contact Person</Label>
                   <Input 
                    id="contact" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-inner px-4 border-2 focus:border-teal-500 font-bold" 
                    placeholder="Personal name"
                    value={formData.contact}
                    onChange={e => setFormData({...formData, contact: e.target.value})}
                  />
                </div>
              </div>
              <DialogFooter className="mt-8">
                <Button type="button" variant="ghost" onClick={() => setShowAddModal(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20 text-white cursor-pointer">
                  {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Save Client"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
         <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="h-8 sm:h-10 w-1.5 flex bg-teal-600 rounded-full" />
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Active Directory</CardTitle>
            </div>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Filter by name..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm" />
            </div>
         </CardHeader>
         <CardContent className="p-0">
           {isLoading ? (
             <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                <p className="text-slate-400 font-bold text-sm italic animate-pulse">Connecting to DBMS...</p>
             </div>
           ) : (
            <>
              {/* Desktop View */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-none whitespace-nowrap">
                      <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest">Client Identity</TableHead>
                      <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest pl-10">Primary Contact</TableHead>
                      <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest text-center">Projects</TableHead>
                      <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest text-right pr-12">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="py-20 text-center text-slate-400 font-medium">No clients found in database.</TableCell>
                      </TableRow>
                    ) : (
                      clients.map((client) => (
                        <TableRow key={client.id} className="border-b border-slate-50 group hover:bg-teal-50/10 transition-colors whitespace-nowrap">
                          <TableCell className="pl-8 py-6">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#1a4d4a] font-black text-lg border border-teal-100 shadow-inner group-hover:scale-110 transition-transform">
                                   {client.name.charAt(0)}
                                </div>
                                <div className="flex flex-col">
                                   <span className="font-black text-slate-800 text-lg leading-tight uppercase">{client.name}</span>
                                   <span className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1">
                                      <Mail className="h-3.5 w-3.5 text-teal-600/50" /> {client.email}
                                   </span>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell className="pl-10">
                             <span className="font-bold text-slate-600 text-sm tracking-tight">{client.contact}</span>
                          </TableCell>
                          <TableCell className="text-center">
                             <Badge variant="outline" className="rounded-xl bg-white border-2 border-slate-50 font-black text-teal-600 px-3 py-1 text-[10px] shadow-sm">
                               {client._count.projects} ACTIVE
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-12">
                            <div className="flex justify-end gap-1">
                              <Button onClick={() => handleEdit(client)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-300 hover:text-teal-600 transition-all shadow-none hover:shadow-md cursor-pointer">
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button onClick={() => handleDelete(client.id, client.name)} variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-300 hover:text-rose-600 transition-all shadow-none hover:shadow-md cursor-pointer">
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
                {clients.length === 0 ? (
                  <div className="py-20 text-center text-slate-400 font-medium">No clients found in database.</div>
                ) : (
                  clients.map((client) => (
                    <Card key={client.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                      <div className="p-5">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-12 w-12 rounded-2xl bg-teal-50 flex items-center justify-center text-[#1a4d4a] font-black text-lg border border-teal-100 shadow-inner shrink-0">
                            {client.name.charAt(0)}
                          </div>
                          <div className="min-w-0 pr-2">
                            <h3 className="text-lg font-black text-slate-800 uppercase truncate leading-tight">{client.name}</h3>
                            <p className="text-xs text-slate-400 font-bold flex items-center gap-1 mt-1 truncate">
                              <Mail className="h-3 w-3 text-teal-600" /> {client.email}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Primary Contact</p>
                            <p className="text-sm font-bold text-slate-700 truncate">{client.contact}</p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Projects</p>
                            <Badge className="rounded-lg bg-teal-50 text-teal-600 font-black text-[10px] border-none px-2 py-0.5">
                              {client._count.projects} ACTIVE
                            </Badge>
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-slate-50">
                          <Button onClick={() => handleEdit(client)} variant="ghost" size="sm" className="rounded-xl flex items-center gap-2 font-bold text-slate-600 hover:bg-teal-50 hover:text-teal-700 cursor-pointer">
                            <Edit2 className="h-3.5 w-3.5" /> Edit
                          </Button>
                          <Button onClick={() => handleDelete(client.id, client.name)} variant="ghost" size="sm" className="rounded-xl flex items-center gap-2 font-bold text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer">
                            <Trash2 className="h-3.5 w-3.5" /> Terminate
                          </Button>
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
      
      {selectedClient && (
        <EditClientModal 
          client={selectedClient} 
          open={showEditModal} 
          onOpenChange={setShowEditModal} 
          onSuccess={loadClients}
        />
      )}
    </main>
  )
}
