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
import { Loader2, PackageSearch } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects, getInspectors, getMaterials, updateMDRReport } from "@/app/actions/master-actions"
import { MaterialSelect } from "@/components/MaterialSelect"
import { toast } from "sonner"

interface EditIncomingModalProps {
  report: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditIncomingModal({ report, open, onOpenChange, onSuccess }: EditIncomingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  const [materials, setMaterials] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    projectId: "",
    inspectorId: "",
    materialId: "",
    supplier: "",
    heatNumber: "",
    quantity: "",
    status: "PENDING"
  })

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        const [projectsData, inspectorsData, materialsData] = await Promise.all([
          getProjects(),
          getInspectors(),
          getMaterials()
        ])
        setProjects(projectsData)
        setInspectors(inspectorsData)
        setMaterials(materialsData)
      }
      loadData()
    }
  }, [open])

  useEffect(() => {
    if (report) {
      const metadata = report.data ? JSON.parse(report.data) : {}
      setFormData({
        projectId: report.projectId || "",
        inspectorId: report.inspectorId || "",
        materialId: report.materialId || "",
        supplier: metadata.supplier || "",
        heatNumber: metadata.heatNumber || "",
        quantity: metadata.quantity || "",
        status: report.status || "PENDING"
      })
    }
  }, [report])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const selectedMaterial = materials.find(m => m.id === formData.materialId)
      
      const reportMetadata = {
        material: selectedMaterial?.name || "",
        supplier: formData.supplier,
        heatNumber: formData.heatNumber || selectedMaterial?.heatNumber || "", 
        quantity: formData.quantity || selectedMaterial?.quantity?.toString() || ""
      }

      const result = await updateMDRReport(report.id, {
        status: formData.status,
        data: JSON.stringify(reportMetadata)
      })

      if (result.success) {
        toast.success("Incoming Report updated successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to update report")
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
              <PackageSearch className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">Edit Incoming Report</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Modify inspection & receiving details</p>
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
                          <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold py-3 hover:bg-cyan-50">
                             {p.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Reference Material *</Label>
                 <MaterialSelect 
                   value={formData.materialId}
                   onValueChange={(val) => {
                      const mat = materials.find(m => m.id === val)
                      setFormData({...formData, materialId: val, heatNumber: mat?.heatNumber || formData.heatNumber})
                   }}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">QC Inspector</Label>
                 <Select 
                   value={formData.inspectorId} 
                   onValueChange={(val) => setFormData({...formData, inspectorId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Inspector" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       {inspectors.map(i => (
                          <SelectItem key={i.id} value={i.id} className="rounded-xl font-bold py-3 hover:bg-cyan-50">
                             {i.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Heat / Batch No</Label>
                 <Input 
                    placeholder="Reference No"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-mono tracking-widest font-bold focus:bg-white"
                    value={formData.heatNumber}
                    onChange={e => setFormData({...formData, heatNumber: e.target.value})}
                 />
              </div>
              
              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Action Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       <SelectItem value="PENDING" className="font-bold text-amber-600 rounded-xl hover:bg-amber-50">HOLD / Pending</SelectItem>
                       <SelectItem value="PASS" className="font-bold text-emerald-600 rounded-xl hover:bg-emerald-50">PASS / Accepted</SelectItem>
                       <SelectItem value="REJECT" className="font-bold text-rose-600 rounded-xl hover:bg-rose-50">REJECT / Non-Conform</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-900/20 text-white flex-1 transition-all active:scale-95">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Report"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
