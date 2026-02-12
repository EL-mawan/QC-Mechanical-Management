"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Plus } from "lucide-react"
import { createDrawing, getProjects } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface CreateDrawingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateDrawingModal({ open, onOpenChange, onSuccess }: CreateDrawingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    number: "",
    title: "",
    revision: "0",
    projectId: ""
  })

  useEffect(() => {
    if (open) {
      const loadProjects = async () => {
        const data = await getProjects()
        setProjects(data)
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, projectId: data[0].id }))
        }
      }
      loadProjects()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await createDrawing(formData)
    
    if (result.success) {
      toast.success(result.message || "Drawing uploaded successfully")
      setFormData({
        number: "",
        title: "",
        revision: "0",
        projectId: projects[0]?.id || ""
      })
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Failed to upload drawing")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg text-slate-800">
        <div className="bg-[#1a4d4a] p-8 text-white">
           <Plus className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Upload New Drawing</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Add new engineering documentation</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing Number *</Label>
                <Input 
                  placeholder="e.g. DWG-ST-001" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.number}
                  onChange={e => setFormData({...formData, number: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing Title *</Label>
                <Input 
                  placeholder="e.g. Main Deck Framing Plan" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Revision</Label>
                  <Input 
                    placeholder="e.g. 0" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                    value={formData.revision}
                    onChange={e => setFormData({...formData, revision: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Project Assignment *</Label>
                  <Select 
                    value={formData.projectId}
                    onValueChange={val => setFormData({...formData, projectId: val})}
                  >
                     <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                        <SelectValue placeholder="Select project" />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                         {projects.map(p => (
                           <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold py-3 hover:bg-teal-50">
                              {p.name}
                           </SelectItem>
                         ))}
                     </SelectContent>
                  </Select>
                </div>
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-900/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Upload Drawing"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
