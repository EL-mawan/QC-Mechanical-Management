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
import { Loader2, Compass } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditFitupModalProps {
  report: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditFitupModal({ report, open, onOpenChange, onSuccess }: EditFitupModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    joint: "",
    drawing: "",
    parts: "",
    gap: "",
    rootFace: "",
    status: "PENDING"
  })

  useEffect(() => {
    if (report) {
      const reportData = report.data ? JSON.parse(report.data) : {}
      setFormData({
        joint: reportData.joint || "",
        drawing: reportData.drawing || "",
        parts: reportData.parts || "",
        gap: reportData.gap || "",
        rootFace: reportData.rootFace || "",
        status: report.status || "PENDING"
      })
    }
  }, [report])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateMDRReport(report.id, {
        status: formData.status,
        data: JSON.stringify({
          joint: formData.joint,
          drawing: formData.drawing,
          parts: formData.parts,
          gap: formData.gap,
          rootFace: formData.rootFace
        })
      })

      if (result.success) {
        toast.success("Fit-up record updated successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to update record")
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
              <Compass className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">Edit Fit-up Inspection</DialogTitle>
           <p className="text-teal-100/80 text-[10px] uppercase font-bold mt-1 tracking-widest">Pre-welding assembly & joint preparation check</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Joint Number</Label>
                 <Input 
                    required 
                    placeholder="e.g. J-01"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-mono tracking-widest uppercase font-bold focus:bg-white transition-all"
                    value={formData.joint}
                    onChange={e => setFormData({...formData, joint: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing Number</Label>
                 <Input 
                    required 
                    placeholder="e.g. DWG-2024-001"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-mono font-bold focus:bg-white transition-all"
                    value={formData.drawing}
                    onChange={e => setFormData({...formData, drawing: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Assembly Parts</Label>
                 <Input 
                    placeholder="e.g. G1 + Main Beam"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold italic"
                    value={formData.parts}
                    onChange={e => setFormData({...formData, parts: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Root Gap</Label>
                 <Input 
                    placeholder="e.g. 2.5mm"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.gap}
                    onChange={e => setFormData({...formData, gap: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Root Face</Label>
                 <Input 
                    placeholder="e.g. 1.5mm"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.rootFace}
                    onChange={e => setFormData({...formData, rootFace: e.target.value})}
                 />
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Inspection Result</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       <SelectItem value="PENDING" className="font-bold text-slate-600 rounded-xl hover:bg-slate-50">Draft / Waiting</SelectItem>
                       <SelectItem value="PASS" className="font-bold text-emerald-600 rounded-xl hover:bg-emerald-50">PASS / Approved</SelectItem>
                       <SelectItem value="REJECT" className="font-bold text-rose-600 rounded-xl hover:bg-rose-50">REJECT / Failed</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-900/20 text-white flex-1 transition-all active:scale-95">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Inspection"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
