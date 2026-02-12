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
import { Loader2, ShieldCheck } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects, getInspectors, createMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface CreateFinalReleaseModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateFinalReleaseModal({ open, onOpenChange, onSuccess }: CreateFinalReleaseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    projectId: "",
    inspectorId: "",
    module: "",
    docsStatus: "Complete",
    result: "RELEASED"
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
        module: formData.module,
        docs: formData.docsStatus,
        result: formData.result
      }

      const result = await createMDRReport({
        type: "FINAL",
        projectId: formData.projectId,
        inspectorId: formData.inspectorId,
        status: formData.result === "RELEASED" ? "PASS" : "REJECT", // Map to DB status enum
        data: JSON.stringify(reportMetadata)
      })

      if (result.success) {
        toast.success("Release Note issued successfully")
        setFormData({
            projectId: "",
            inspectorId: "",
            module: "",
            docsStatus: "Complete",
            result: "RELEASED"
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to issue release")
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
              <ShieldCheck className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">Issue Final Release</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1">Final dossier validation and handover</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Project *</Label>
                 <Select 
                   value={formData.projectId} 
                   onValueChange={(val) => setFormData({...formData, projectId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Select Project" />
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

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Module Description *</Label>
                 <Input 
                    required 
                    placeholder="e.g. Main Deck Assembly"
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                    value={formData.module}
                    onChange={e => setFormData({...formData, module: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Dossier Status</Label>
                 <Select 
                   value={formData.docsStatus} 
                   onValueChange={(val) => setFormData({...formData, docsStatus: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       <SelectItem value="Complete" className="font-bold cursor-pointer text-emerald-600">Complete</SelectItem>
                       <SelectItem value="Incomplete" className="font-bold cursor-pointer text-amber-600">Incomplete</SelectItem>
                       <SelectItem value="Missing NDT" className="font-bold cursor-pointer text-rose-600">Missing NDT</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              
              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Final Result</Label>
                 <Select 
                   value={formData.result} 
                   onValueChange={(val) => setFormData({...formData, result: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       <SelectItem value="RELEASED" className="font-bold cursor-pointer text-emerald-600">RELEASED</SelectItem>
                       <SelectItem value="HOLD" className="font-bold cursor-pointer text-rose-600">HOLD</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Inspector *</Label>
                 <Select 
                   value={formData.inspectorId} 
                   onValueChange={(val) => setFormData({...formData, inspectorId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Select Inspector" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       {inspectors.length > 0 ? (
                          inspectors.map(i => (
                            <SelectItem key={i.id} value={i.id} className="font-bold cursor-pointer">
                               {i.name}
                            </SelectItem>
                          ))
                       ) : (
                          <SelectItem value="disabled" disabled>No inspectors found</SelectItem>
                       )}
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20 text-white flex-1">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Issue Release"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
