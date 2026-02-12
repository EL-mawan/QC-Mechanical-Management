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
import { getProjects, getInspectors, updateMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditFinalReleaseModalProps {
  report: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditFinalReleaseModal({ report, open, onOpenChange, onSuccess }: EditFinalReleaseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  const reportData = report || {}
  
  const [formData, setFormData] = useState({
    projectId: reportData.projectId || "",
    inspectorId: reportData.inspectorId || "",
    module: reportData.module || "",
    docsStatus: reportData.docs || "Complete",
    result: reportData.result || "RELEASED"
  })

  useEffect(() => {
    if (open) {
      const loadInitialData = async () => {
        const [projectsData, inspectorsData] = await Promise.all([
          getProjects(),
          getInspectors()
        ])
        setProjects(projectsData)
        setInspectors(inspectorsData)
      }
      loadInitialData()
    }
  }, [open])

  useEffect(() => {
    if (report) {
      setFormData({
        projectId: report.projectId || "",
        inspectorId: report.inspectorId || "",
        module: report.module || "",
        docsStatus: report.docs || "Complete",
        result: report.result || "RELEASED"
      })
    }
  }, [report])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const reportMetadata = {
        module: formData.module,
        docs: formData.docsStatus,
        result: formData.result
      }

      const result = await updateMDRReport(report.id, {
        projectId: formData.projectId,
        inspectorId: formData.inspectorId,
        status: formData.result === "RELEASED" ? "PASS" : "REJECT",
        data: JSON.stringify(reportMetadata)
      })

      if (result.success) {
        toast.success("Release Note updated successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to update release")
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
              <ShieldCheck className="h-6 w-6 text-teal-300" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">Edit Final Release</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update dossier validation & handover records</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Target Project *</Label>
                 <Select 
                   value={formData.projectId} 
                   onValueChange={(val) => setFormData({...formData, projectId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select Project" />
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

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Module Description *</Label>
                 <Input 
                    required 
                    placeholder="e.g. Main Deck Assembly"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                    value={formData.module}
                    onChange={e => setFormData({...formData, module: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Dossier Status</Label>
                 <Select 
                   value={formData.docsStatus} 
                   onValueChange={(val) => setFormData({...formData, docsStatus: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       <SelectItem value="Complete" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-emerald-600">Complete</SelectItem>
                       <SelectItem value="Incomplete" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-amber-600">Incomplete</SelectItem>
                       <SelectItem value="Missing NDT" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-rose-600">Missing NDT</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Handover Result</Label>
                 <Select 
                   value={formData.result} 
                   onValueChange={(val) => setFormData({...formData, result: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase tracking-widest text-[10px]">
                       <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       <SelectItem value="RELEASED" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-emerald-600 uppercase tracking-widest text-[10px]">RELEASED</SelectItem>
                       <SelectItem value="HOLD" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-rose-600 uppercase tracking-widest text-[10px]">HOLD</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Certifying Inspector *</Label>
                 <Select 
                   value={formData.inspectorId} 
                   onValueChange={(val) => setFormData({...formData, inspectorId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select Inspector" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       {inspectors.map(i => (
                          <SelectItem key={i.id} value={i.id} className="rounded-xl font-bold py-3 hover:bg-teal-50">
                             {i.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20 text-white flex-1 transition-all active:scale-95">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Handover"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
