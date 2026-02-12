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
import { Loader2, Compass, PlusCircle } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects, getInspectors, createMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface CreateFitupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateFitupModal({ open, onOpenChange, onSuccess }: CreateFitupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    projectId: "",
    inspectorId: "",
    joint: "",
    drawing: "",
    parts: "",
    gap: "",
    rootFace: "",
    status: "PENDING"
  })

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        const [projectsData, inspectorsData] = await Promise.all([
          getProjects(),
          getInspectors()
        ])
        setProjects(projectsData)
        setInspectors(inspectorsData)
        
        if (inspectorsData.length > 0) {
           setFormData(prev => ({ ...prev, inspectorId: inspectorsData[0].id }))
        }
      }
      loadData()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const reportMetadata = {
        joint: formData.joint,
        drawing: formData.drawing,
        parts: formData.parts,
        gap: formData.gap,
        rootFace: formData.rootFace
      }

      const result = await createMDRReport({
        type: "FITUP",
        projectId: formData.projectId,
        inspectorId: formData.inspectorId,
        status: formData.status,
        data: JSON.stringify(reportMetadata)
      })

      if (result.success) {
        toast.success("Fit-up record created successfully")
        setFormData({
            projectId: "",
            inspectorId: formData.inspectorId, // Keep inspector for next entry
            joint: "",
            drawing: "",
            parts: "",
            gap: "",
            rootFace: "",
            status: "PENDING"
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to create record")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg text-slate-800">
        <div className="bg-[#1a4d4a] p-8 text-white relative">
           <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4">
              <Compass className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">New Fit-up Inspection</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1">Log assembly and pre-welding joint checks</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Project *</Label>
                 <Select 
                   value={formData.projectId} 
                   onValueChange={(val) => setFormData({...formData, projectId: val})}
                   required
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       {projects.map(p => (
                          <SelectItem key={p.id} value={p.id} className="font-bold cursor-pointer rounded-lg">
                             {p.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Joint No *</Label>
                 <Input 
                    required 
                    placeholder="e.g. J-01"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-mono font-bold uppercase"
                    value={formData.joint}
                    onChange={e => setFormData({...formData, joint: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing Ref *</Label>
                 <Input 
                    required 
                    placeholder="DWG-001"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-mono font-bold"
                    value={formData.drawing}
                    onChange={e => setFormData({...formData, drawing: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Parts to Assemble</Label>
                 <Input 
                    placeholder="e.g. Beam A + Plate B"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold italic"
                    value={formData.parts}
                    onChange={e => setFormData({...formData, parts: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Root Gap</Label>
                 <Input 
                    placeholder="2.5mm"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.gap}
                    onChange={e => setFormData({...formData, gap: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Root Face</Label>
                 <Input 
                    placeholder="1.5mm"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.rootFace}
                    onChange={e => setFormData({...formData, rootFace: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Inspector</Label>
                 <Select 
                   value={formData.inspectorId} 
                   onValueChange={(val) => setFormData({...formData, inspectorId: val})}
                   required
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Inspector" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       {inspectors.map(i => (
                          <SelectItem key={i.id} value={i.id} className="font-bold cursor-pointer rounded-lg">
                             {i.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       <SelectItem value="PENDING" className="font-bold text-amber-600 rounded-lg">Draft</SelectItem>
                       <SelectItem value="PASS" className="font-bold text-emerald-600 rounded-lg">PASS</SelectItem>
                       <SelectItem value="REJECT" className="font-bold text-rose-600 rounded-lg">REJECT</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-6 pt-4 border-t border-slate-50">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl h-11 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl h-11 px-10 font-black shadow-lg shadow-teal-900/20 text-white flex-1 transition-all active:scale-95">
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Fit-up Record"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
