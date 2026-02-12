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
import { getProjects, getInspectors, createMDRReport, getMaterials } from "@/app/actions/master-actions"
import { MaterialSelect } from "@/components/MaterialSelect"
import { toast } from "sonner"

interface CreateIncomingReportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateIncomingReportModal({ open, onOpenChange, onSuccess }: CreateIncomingReportModalProps) {
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
        
        // Default inspector if only one found to save clicks? Or just pick first.
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
      // Pack specific fields into 'data' JSON string
      const selectedMaterial = materials.find(m => m.id === formData.materialId)
      
      const reportMetadata = {
        material: selectedMaterial?.name || "",
        supplier: formData.supplier,
        heatNumber: formData.heatNumber || selectedMaterial?.heatNumber || "", 
        quantity: formData.quantity || selectedMaterial?.quantity?.toString() || ""
      }

      const result = await createMDRReport({
        type: "INCOMING",
        projectId: formData.projectId,
        inspectorId: formData.inspectorId,
        materialId: formData.materialId,
        status: formData.status,
        data: JSON.stringify(reportMetadata)
      })

      if (result.success) {
        toast.success("Incoming Report created successfully")
        setFormData({
            projectId: "",
            inspectorId: "",
            materialId: "",
            supplier: "",
            heatNumber: "",
            quantity: "",
            status: "PENDING"
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
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white relative">
           <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4">
              <PackageSearch className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">New Incoming Inspection</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1">Record material receipt and inspection details</p>
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
                 <Label className="text-xs font-bold uppercase text-slate-500">Pick From Material Inventory *</Label>
                 <MaterialSelect 
                   value={formData.materialId}
                   onValueChange={(val) => {
                      const mat = materials.find(m => m.id === val)
                      setFormData({...formData, materialId: val, heatNumber: mat?.heatNumber || formData.heatNumber})
                   }}
                 />
                 <p className="text-[10px] text-teal-600 font-bold px-1">Referencing the Master Material Database</p>
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Heat / Batch No</Label>
                 <Input 
                    placeholder="Auto-filled from inventory"
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-mono"
                    value={formData.heatNumber}
                    onChange={e => setFormData({...formData, heatNumber: e.target.value})}
                 />
              </div>
              
              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       <SelectItem value="PENDING" className="font-bold cursor-pointer text-amber-600">Pending</SelectItem>
                       <SelectItem value="PASS" className="font-bold cursor-pointer text-emerald-600">Pass / Approved</SelectItem>
                       <SelectItem value="REJECT" className="font-bold cursor-pointer text-rose-600">Reject / Hold</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20 text-white flex-1">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Report"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
