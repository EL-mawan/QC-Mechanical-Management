"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Radiation } from "lucide-react"
import { updateMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditNDTModalProps {
  report: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditNDTModal({ report, open, onOpenChange, onSuccess }: EditNDTModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reportData = report?.data || {}
  
  const [formData, setFormData] = useState({
    method: "Radiography",
    joint: "",
    drawing: "",
    spec: "",
    status: "PENDING"
  })

  useEffect(() => {
    if (report) {
      const data = report.data ? (typeof report.data === 'string' ? JSON.parse(report.data) : report.data) : {}
      setFormData({
        method: data.method || "Radiography",
        joint: data.joint || "",
        drawing: data.drawing || "",
        spec: data.spec || "",
        status: report.status || "PENDING"
      })
    }
  }, [report])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await updateMDRReport(report.id, {
      status: formData.status,
      data: JSON.stringify({
        method: formData.method,
        joint: formData.joint,
        drawing: formData.drawing,
        spec: formData.spec
      })
    })
    
    if (result.success) {
      toast.success(result.message || "NDT report updated successfully")
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
        <div className="bg-[#1a4d4a] p-8 text-white">
           <Radiation className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit NDT Result</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update laboratory verification data</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">NDT Method</Label>
                  <Select 
                    value={formData.method}
                    onValueChange={val => setFormData({...formData, method: val})}
                  >
                     <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase">
                        <SelectValue placeholder="Method" />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                        <SelectItem value="Radiography" className="rounded-xl font-bold py-3 hover:bg-teal-50">RT (Radiography)</SelectItem>
                        <SelectItem value="Ultrasonic" className="rounded-xl font-bold py-3 hover:bg-teal-50">UT (Ultrasonic)</SelectItem>
                        <SelectItem value="Magnetic Particle" className="rounded-xl font-bold py-3 hover:bg-teal-50">MT (Magnetic)</SelectItem>
                        <SelectItem value="Liquid Penetrant" className="rounded-xl font-bold py-3 hover:bg-teal-50">PT (Penetrant)</SelectItem>
                        <SelectItem value="Visual" className="rounded-xl font-bold py-3 hover:bg-teal-50">VI (Visual)</SelectItem>
                     </SelectContent>
                  </Select>
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
                        <SelectItem value="PASS" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-emerald-600 uppercase">ACCEPTED</SelectItem>
                        <SelectItem value="FAIL" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-rose-600 uppercase">REJECTED</SelectItem>
                        <SelectItem value="PENDING" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-slate-600 uppercase">PENDING</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Joint No.</Label>
                  <Input 
                    placeholder="e.g. J-101" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold uppercase"
                    value={formData.joint}
                    onChange={e => setFormData({...formData, joint: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing No.</Label>
                  <Input 
                    placeholder="e.g. DWG-001" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold uppercase"
                    value={formData.drawing}
                    onChange={e => setFormData({...formData, drawing: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Acceptance Specification</Label>
                <Input 
                  placeholder="e.g. ASME VIII Div 1" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.spec}
                  onChange={e => setFormData({...formData, spec: e.target.value})}
                />
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Result"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
