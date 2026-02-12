"use client"

import { useState, useEffect } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, FileSignature, Layout } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects } from "@/app/actions/master-actions"
import { createITP } from "@/app/actions/qc-actions"
import { toast } from "sonner"

interface CreateITPModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  initialData?: any
}

export function CreateITPModal({ open, onOpenChange, onSuccess, initialData }: CreateITPModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    status: "DRAFT"
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        projectId: initialData.projectId || "",
        title: initialData.title || "",
        description: initialData.description || "",
        status: initialData.status || "DRAFT"
      })
    } else {
      setFormData({
        projectId: "",
        title: "",
        description: "",
        status: "DRAFT"
      })
    }
  }, [initialData, open])

  useEffect(() => {
    if (open) {
      const loadProjects = async () => {
        const data = await getProjects()
        setProjects(data)
      }
      loadProjects()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { updateITP } = await import("@/app/actions/qc-actions")
      const result = initialData 
        ? await updateITP(initialData.id, formData)
        : await createITP(formData)

      if (result.success) {
        toast.success(result.message)
        if (!initialData) {
          setFormData({
              projectId: "",
              title: "",
              description: "",
              status: "DRAFT"
          })
        }
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to save ITP")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white relative">
           <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4">
              <FileSignature className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">Design New ITP</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Inspection Test Plan Framework</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-4">
              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Project Assignment *</Label>
                 <Select 
                   value={formData.projectId} 
                   onValueChange={(val) => setFormData({...formData, projectId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold">
                       <SelectValue placeholder="Link to Project" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       {projects.map(p => (
                          <SelectItem key={p.id} value={p.id} className="font-bold cursor-pointer">
                             {p.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">ITP Title *</Label>
                 <Input 
                    placeholder="e.g. Structure Fabrication ITP"
                    required
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold"
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Scope Description</Label>
                 <Textarea 
                    placeholder="Detailed inspection scope..."
                    className="rounded-2xl border-slate-200 bg-slate-50 min-h-[100px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Initial Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       <SelectItem value="DRAFT" className="font-bold cursor-pointer transition-colors">DRAFT</SelectItem>
                       <SelectItem value="ISSUED" className="font-bold cursor-pointer text-blue-600">ISSUED</SelectItem>
                       <SelectItem value="APPROVED" className="font-bold cursor-pointer text-emerald-600">APPROVED</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-teal-900 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-900/20 text-white flex-1 transition-all">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Initiate Document"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
