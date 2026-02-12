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
import { Loader2, Palette, Thermometer, Droplets } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects, getInspectors, createMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface CreatePaintingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreatePaintingModal({ open, onOpenChange, onSuccess }: CreatePaintingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    projectId: "",
    inspectorId: "",
    reportId: "",
    area: "",
    system: "",
    temp: "",
    humidity: "",
    thickness: "",
    status: "PASS"
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
        area: formData.area,
        system: formData.system,
        temp: formData.temp,
        humidity: formData.humidity,
        thickness: formData.thickness
      }

      const result = await createMDRReport({
        type: "PAINTING",
        reportId: formData.reportId,
        projectId: formData.projectId,
        inspectorId: formData.inspectorId,
        status: formData.status,
        data: JSON.stringify(reportMetadata)
      })

      if (result.success) {
        toast.success("Painting report created successfully")
        setFormData({
            projectId: "",
            inspectorId: formData.inspectorId,
            reportId: "",
            area: "",
            system: "",
            temp: "",
            humidity: "",
            thickness: "",
            status: "PASS"
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to create report")
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
              <Palette className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">New Coating Log</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Environmental & DFT verification</p>
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
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Report No. *</Label>
                 <Input 
                    required 
                    placeholder="PNT-001"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-mono font-bold uppercase"
                    value={formData.reportId}
                    onChange={e => setFormData({...formData, reportId: e.target.value})}
                 />
              </div>

              <div className="col-span-1 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Coating Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl bg-white p-1">
                       <SelectItem value="PASS" className="font-bold text-emerald-600 rounded-lg">ACCEPTED</SelectItem>
                       <SelectItem value="HOLD" className="font-bold text-amber-600 rounded-lg">ON HOLD</SelectItem>
                       <SelectItem value="FAIL" className="font-bold text-rose-600 rounded-lg">REJECTED</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Structure Area / Component *</Label>
                 <Input 
                    required 
                    placeholder="e.g. Main Frame - Section A"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.area}
                    onChange={e => setFormData({...formData, area: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Coating System / Spec *</Label>
                 <Input 
                    required 
                    placeholder="e.g. Epoxy Primer 250um"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.system}
                    onChange={e => setFormData({...formData, system: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1 flex items-center gap-1">
                    <Thermometer className="h-3 w-3" /> Temp (°C)
                 </Label>
                 <Input 
                    type="number"
                    required 
                    placeholder="28"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.temp}
                    onChange={e => setFormData({...formData, temp: e.target.value})}
                 />
              </div>

              <div className="space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1 flex items-center gap-1">
                    <Droplets className="h-3 w-3" /> Humidity (%)
                 </Label>
                 <Input 
                    type="number"
                    required 
                    placeholder="65"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.humidity}
                    onChange={e => setFormData({...formData, humidity: e.target.value})}
                 />
              </div>

              <div className="col-span-1 space-y-1.5">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Avg DFT (µm)</Label>
                 <Input 
                    type="number"
                    required 
                    placeholder="250"
                    className="h-11 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.thickness}
                    onChange={e => setFormData({...formData, thickness: e.target.value})}
                 />
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
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Registry Coating"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
