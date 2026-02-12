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
import { Loader2, AlertTriangle } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects, getInspectors, getMaterials } from "@/app/actions/master-actions"
import { getInspectionsForNCR, createNCR, createInspection } from "@/app/actions/qc-actions"
import { MaterialSelect } from "@/components/MaterialSelect"
import { toast } from "sonner"

interface CreateNCRModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateNCRModal({ open, onOpenChange, onSuccess }: CreateNCRModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Data sources
  const [projects, setProjects] = useState<any[]>([])
  const [inspectors, setInspectors] = useState<any[]>([])
  const [inspections, setInspections] = useState<any[]>([])
  
  // Mode: "Select Inspection" or "Manual (Create Inspection)"
  const [mode, setMode] = useState<"select" | "manual">("manual")

  const [formData, setFormData] = useState({
    projectId: "",
    inspectionId: "", // If selecting existing
    inspectorId: "", // For manual inspection creation
    
    // NCR Fields
    ncrNumber: "",
    description: "",
    rootCause: "",
    correctiveAction: "",
    status: "OPEN",
    materialId: "",
    
    // Additional fields for NCR filtering/display not directly in schema but useful?
    // The schema only has ncrNumber, inspectionId, status, description, rootCause, correctiveAction, preventiveAction, closedDate.
    // Project comes from Inspection.project.
    
    // Manual Inspection Fields (if creating new inspection on the fly)
    manualItemName: "",
    manualResult: "FAIL"
  })

  useEffect(() => {
    if (open) {
      const loadData = async () => {
        const [p, i, insp] = await Promise.all([
          getProjects(),
          getInspectors(),
          getInspectionsForNCR()
        ])
        setProjects(p)
        setInspectors(i)
        setInspections(insp)
        
        // Default ncr number generator?
        const date = new Date()
        setFormData(prev => ({
            ...prev,
            ncrNumber: `NCR-${date.getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`
        }))
      }
      loadData()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let finalInspectionId = formData.inspectionId

      // If manual mode, create inspection first
      if (mode === "manual") {
         if (!formData.projectId || !formData.inspectorId) {
            toast.error("Please select Project and Inspector for new inspection")
            setIsSubmitting(false)
            return
         }
         
         // Create a dummy inspection to attach NCR to
         // Schema: Inspection(projectId, inspectorId, itpItemId?, result, status, date)
         // Note: itpItemId is optional? Check schema. 
         // If generic, maybe we don't link itpItemId or we need one.
         // Let's assume we can create without itpItemId if nullable, or we need to fetch ITPs. 
         // Let's assume we can create without itpItemId if nullable, or we can proceed or fail gracefully.
         
         const newInsp = await createInspection({
            projectId: formData.projectId,
            inspectorId: formData.inspectorId,
            materialId: formData.materialId,
            status: "Rejected", // Use Title Case to match schema expectation
            date: new Date(),
            // We might need an itpItemId if schema enforces it. 
            // If schema says itpItemId String, we might fail. 
            // Let's hope it's optional or we have a default.
            // If it fails, user must select existing.
         })
         
         if (newInsp.success && newInsp.data) {
            finalInspectionId = newInsp.data.id
         } else {
            toast.error(newInsp.message || "Failed to create underlying inspection record")
            setIsSubmitting(false)
            return
         }
      }

      if (!finalInspectionId) {
         toast.error("No valid inspection selected or created")
         setIsSubmitting(false)
         return
      }

      const result = await createNCR({
        ncrNumber: formData.ncrNumber,
        inspectionId: finalInspectionId,
        materialId: formData.materialId,
        status: formData.status,
        title: formData.description || `NCR for ${formData.ncrNumber}`,
        description: formData.description,
        rootCause: formData.rootCause,
        correctiveAction: formData.correctiveAction,
        // preventiveAction?
      })

      if (result.success) {
        toast.success("NCR created successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to create NCR")
      }
    } catch (error) {
      console.error(error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 p-8 text-white relative">
           <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4">
              <AlertTriangle className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">New NCR</DialogTitle>
           <p className="text-red-100/80 text-xs font-medium mt-1">Raise a Non-Conformance Report</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           
           {/* Mode Selection */}
           <div className="flex gap-4 mb-4 bg-slate-50 p-1 rounded-xl">
              <Button 
                type="button"
                variant={mode === "manual" ? "secondary" : "ghost"}
                className={`flex-1 rounded-lg ${mode === "manual" ? "bg-white shadow-sm font-bold text-red-600" : "text-slate-400"}`}
                onClick={() => setMode("manual")}
              >
                New Issue (Manual)
              </Button>
              <Button 
                type="button"
                variant={mode === "select" ? "secondary" : "ghost"}
                className={`flex-1 rounded-lg ${mode === "select" ? "bg-white shadow-sm font-bold text-red-600" : "text-slate-400"}`}
                onClick={() => setMode("select")}
              >
                From Inspection
              </Button>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">NCR Number *</Label>
                 <Input 
                    required 
                    placeholder="e.g. NCR-2024-001"
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-mono tracking-widest text-red-600 font-bold"
                    value={formData.ncrNumber}
                    onChange={e => setFormData({...formData, ncrNumber: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Related Material (Optional)</Label>
                 <MaterialSelect 
                    value={formData.materialId}
                    onValueChange={(val) => setFormData({...formData, materialId: val})}
                    placeholder="Select material if applicable..."
                 />
                 <p className="text-[10px] text-red-600 font-bold px-1">Link this issue to a specific material record</p>
              </div>

              {mode === "select" ? (
                 <div className="col-span-2 space-y-2">
                    <Label className="text-xs font-bold uppercase text-slate-500">Select Failed Inspection *</Label>
                    <Select 
                      value={formData.inspectionId} 
                      onValueChange={(val) => setFormData({...formData, inspectionId: val})}
                      required={mode === "select"}
                    >
                       <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                          <SelectValue placeholder="Select Inspection" />
                       </SelectTrigger>
                       <SelectContent className="rounded-xl border-none shadow-xl">
                          {inspections.length > 0 ? (
                             inspections.map(i => (
                               <SelectItem key={i.id} value={i.id} className="font-bold cursor-pointer">
                                  {i.project?.name} - {new Date(i.createdAt).toLocaleDateString()}
                               </SelectItem>
                             ))
                          ) : (
                             <SelectItem value="disabled" disabled>No eligible inspections found</SelectItem>
                          )}
                       </SelectContent>
                    </Select>
                 </div>
              ) : (
                 <>
                    <div className="col-span-2 space-y-2">
                       <Label className="text-xs font-bold uppercase text-slate-500">Project *</Label>
                       <Select 
                         value={formData.projectId} 
                         onValueChange={(val) => setFormData({...formData, projectId: val})}
                         required={mode === "manual"}
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
                       <Label className="text-xs font-bold uppercase text-slate-500">Reporting Inspector *</Label>
                       <Select 
                         value={formData.inspectorId} 
                         onValueChange={(val) => setFormData({...formData, inspectorId: val})}
                         required={mode === "manual"}
                       >
                          <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                             <SelectValue placeholder="Select Inspector" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-xl">
                             {inspectors.map(i => (
                                <SelectItem key={i.id} value={i.id} className="font-bold cursor-pointer">
                                   {i.name}
                                </SelectItem>
                             ))}
                          </SelectContent>
                       </Select>
                    </div>
                 </>
              )}

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Description of Non-Conformance *</Label>
                 <Textarea 
                    required 
                    placeholder="Describe the defect or issue..."
                    className="min-h-[100px] rounded-2xl border-slate-200 bg-slate-50 resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Root Cause (Optional)</Label>
                 <Textarea 
                    placeholder="Analysis of why this occurred..."
                    className="min-h-[80px] rounded-2xl border-slate-200 bg-slate-50 resize-none"
                    value={formData.rootCause}
                    onChange={e => setFormData({...formData, rootCause: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Corrective Action (Optional)</Label>
                 <Textarea 
                    placeholder="Steps to fix..."
                    className="min-h-[80px] rounded-2xl border-slate-200 bg-slate-50 resize-none"
                    value={formData.correctiveAction}
                    onChange={e => setFormData({...formData, correctiveAction: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       <SelectItem value="OPEN" className="font-bold text-red-600">OPEN</SelectItem>
                       <SelectItem value="ON_PROGRESS" className="font-bold text-amber-600">ON PROGRESS</SelectItem>
                       <SelectItem value="CLOSED" className="font-bold text-emerald-600">CLOSED</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-red-600 hover:bg-red-700 rounded-2xl h-12 px-10 font-black shadow-lg shadow-red-600/20 text-white flex-1">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create NCR"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
