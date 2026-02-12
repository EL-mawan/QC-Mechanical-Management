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
import { Loader2, QrCode, UserCheck, Layers } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects, getInspectors, createMDRReport, getWPS, getWelders, getDrawings } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface CreateWeldingLogModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateWeldingLogModal({ open, onOpenChange, onSuccess }: CreateWeldingLogModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  const [wpss, setWpss] = useState<any[]>([])
  const [welders, setWelders] = useState<any[]>([])
  const [drawings, setDrawings] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    projectId: "",
    inspectorId: "",
    reportId: "",
    joint: "",
    welder: "",
    wps: "",
    drawing: "",
    status: "PASS"
  })

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        const [projectsData, inspectorsData, wpssData, weldersData, drawingsData] = await Promise.all([
          getProjects(),
          getInspectors(),
          getWPS(),
          getWelders(),
          getDrawings()
        ])
        setProjects(projectsData)
        setInspectors(inspectorsData)
        setWpss(wpssData)
        setWelders(weldersData)
        setDrawings(drawingsData)
        
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
        welder: formData.welder,
        wps: formData.wps,
        drawing: formData.drawing
      }

      const result = await createMDRReport({
        type: "WELDING",
        reportId: formData.reportId || `WL-${Date.now()}`,
        projectId: formData.projectId,
        inspectorId: formData.inspectorId,
        status: formData.status,
        data: JSON.stringify(reportMetadata)
      })

      if (result.success) {
        toast.success("Welding record created successfully")
        setFormData({
            projectId: "",
            inspectorId: formData.inspectorId,
            reportId: "",
            joint: "",
            welder: "",
            wps: "",
            drawing: "",
            status: "PASS"
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
           <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4 text-teal-300">
              <QrCode className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">New Welding Log</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest leading-none">Joint welding verification</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Project Selection *</Label>
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

              <div className="col-span-1 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Joint No. *</Label>
                 <Input 
                    required 
                    placeholder="e.g. J-001"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-mono font-bold uppercase"
                    value={formData.joint}
                    onChange={e => setFormData({...formData, joint: e.target.value})}
                 />
              </div>

              <div className="col-span-1 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">QC Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       <SelectItem value="PASS" className="font-bold text-emerald-600 rounded-lg">ACCEPTED</SelectItem>
                       <SelectItem value="REJECT" className="font-bold text-rose-600 rounded-lg">REJECTED</SelectItem>
                       <SelectItem value="PENDING" className="font-bold text-amber-600 rounded-lg">PENDING</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-1 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Welder Selection *</Label>
                 <Select 
                   value={formData.welder} 
                   onValueChange={(val) => setFormData({...formData, welder: val})}
                   required
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select Welder" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       {welders.map(w => (
                          <SelectItem key={w.id} value={w.name} className="font-bold cursor-pointer rounded-lg">
                             {w.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-1 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">WPS Ref *</Label>
                 <Select 
                   value={formData.wps} 
                   onValueChange={(val) => setFormData({...formData, wps: val})}
                   required
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select WPS" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       {wpss.map(w => (
                          <SelectItem key={w.id} value={w.number} className="font-bold cursor-pointer rounded-lg">
                             {w.number}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-1 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing Ref *</Label>
                 <Select 
                   value={formData.drawing} 
                   onValueChange={(val) => setFormData({...formData, drawing: val})}
                   required
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select DWG" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       {drawings.map(d => (
                          <SelectItem key={d.id} value={d.number} className="font-bold cursor-pointer rounded-lg">
                             {d.number}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-1 space-y-1.5">
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
           </div>

           <DialogFooter className="mt-6 pt-4 border-t border-slate-50">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl h-11 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl h-11 px-10 font-black shadow-lg shadow-teal-900/20 text-white flex-1 transition-all active:scale-95">
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Registry Joint"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
