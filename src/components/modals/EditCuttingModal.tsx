"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Scissors } from "lucide-react"
import { updateMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditCuttingModalProps {
  report: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditCuttingModal({ report, open, onOpenChange, onSuccess }: EditCuttingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reportData = report?.data || {}
  
  const [formData, setFormData] = useState({
    part: reportData.part || "",
    drawing: reportData.drawing || "",
    material: reportData.material || "",
    dimension: reportData.dimension || "",
    status: report?.status || "PENDING"
  })

  useEffect(() => {
    if (report) {
      const data = report.data || {}
      setFormData({
        part: data.part || "",
        drawing: data.drawing || "",
        material: data.material || "",
        dimension: data.dimension || "",
        status: report.status || "PENDING"
      })
    }
  }, [report])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await updateMDRReport(report.id, {
      status: formData.status,
      data: {
        ...report.data,
        part: formData.part,
        drawing: formData.drawing,
        material: formData.material,
        dimension: formData.dimension
      }
    })
    
    if (result.success) {
      toast.success(result.message || "Cutting report updated successfully")
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Failed to update report")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white relative">
           <Scissors className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit Cutting Record</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update dimensional verification & traceability</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Part Name / Number</Label>
                <Input 
                  placeholder="e.g. Main Gusset G1" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.part}
                  onChange={e => setFormData({...formData, part: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing No.</Label>
                  <Input 
                    placeholder="e.g. DWG-2024-001" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold uppercase"
                    value={formData.drawing}
                    onChange={e => setFormData({...formData, drawing: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Material Heat No.</Label>
                  <Input 
                    placeholder="e.g. HT-10255" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold font-mono"
                    value={formData.material}
                    onChange={e => setFormData({...formData, material: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Dimensions (mm)</Label>
                  <Input 
                    placeholder="e.g. 250x250x12" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold font-mono"
                    value={formData.dimension}
                    onChange={e => setFormData({...formData, dimension: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">QC Status</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={val => setFormData({...formData, status: val})}
                  >
                     <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase">
                        <SelectValue placeholder="Status" />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                        <SelectItem value="PASS" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-emerald-600">PASS</SelectItem>
                        <SelectItem value="FAIL" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-rose-600">REJECT</SelectItem>
                        <SelectItem value="PENDING" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-slate-600">PENDING</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Log"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
