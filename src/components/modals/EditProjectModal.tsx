"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Layout } from "lucide-react"
import { updateProject } from "@/app/actions/master-actions"
import { getClients } from "@/app/actions/client-actions"
import { toast } from "sonner"

interface EditProjectModalProps {
  project: any
  clients: any[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditProjectModal({ project, clients: initialClients, open, onOpenChange, onSuccess }: EditProjectModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clients, setClients] = useState<any[]>(initialClients || [])
  
  const [formData, setFormData] = useState({
    name: project?.name || "",
    location: project?.location || "",
    clientId: project?.clientId || "",
    status: project?.status || "ONGOING"
  })

  useEffect(() => {
    if (initialClients && initialClients.length > 0) {
      setClients(initialClients)
    } else {
      const loadClients = async () => {
        const data = await getClients()
        setClients(data)
      }
      loadClients()
    }
  }, [initialClients])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await updateProject(project.id, formData)
    
    if (result.success) {
      toast.success(result.message || "Project berhasil diupdate", {
        description: "Data telah tersimpan ke database",
        duration: 4000,
      })
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Gagal mengupdate project", {
        description: "Silakan periksa data dan coba lagi",
        duration: 5000,
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white">
           <Layout className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit Project</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update project details</p>
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
                <Select 
                  value={formData.clientId}
                  onValueChange={val => setFormData({...formData, clientId: val})}
                >
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
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={val => setFormData({...formData, status: val})}
                >
                   <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                      <SelectValue placeholder="Select status" />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                      <SelectItem value="ONGOING" className="rounded-xl font-bold py-3 hover:bg-teal-50">ONGOING</SelectItem>
                      <SelectItem value="COMPLETED" className="rounded-xl font-bold py-3 hover:bg-teal-50">COMPLETED</SelectItem>
                      <SelectItem value="HOLD" className="rounded-xl font-bold py-3 hover:bg-teal-50">HOLD</SelectItem>
                   </SelectContent>
                </Select>
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Project"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
