"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Palette } from "lucide-react"
import { updateMDRReport } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditPaintingModalProps {
  report: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditPaintingModal({ report, open, onOpenChange, onSuccess }: EditPaintingModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const reportData = report?.data || {}
  
  const [formData, setFormData] = useState({
    area: reportData.area || "",
    system: reportData.system || "",
    thickness: reportData.thickness || "",
    temp: reportData.temp || "",
    humidity: reportData.humidity || "",
    status: report?.status || "PENDING"
  })

  useEffect(() => {
    if (report) {
      const data = report.data || {}
      setFormData({
        area: data.area || "",
        system: data.system || "",
        thickness: data.thickness || "",
        temp: data.temp || "",
        humidity: data.humidity || "",
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
        area: formData.area,
        system: formData.system,
        thickness: formData.thickness,
        temp: formData.temp,
        humidity: formData.humidity
      }
    })
    
    if (result.success) {
      toast.success(result.message || "Coating report updated successfully")
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
           <Palette className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit Coating Report</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update environmental & DFT records</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Target Area</Label>
                <Input 
                  placeholder="e.g. Section A - Main Deck" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Coating System</Label>
                <Input 
                  placeholder="e.g. Epoxy Primer / Polyurethane" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.system}
                  onChange={e => setFormData({...formData, system: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Air Temp (°C)</Label>
                  <Input 
                    placeholder="e.g. 28.4" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold font-mono"
                    value={formData.temp}
                    onChange={e => setFormData({...formData, temp: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Humidity (%)</Label>
                  <Input 
                    placeholder="e.g. 62" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold font-mono"
                    value={formData.humidity}
                    onChange={e => setFormData({...formData, humidity: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Avg. DFT (µm)</Label>
                  <Input 
                    placeholder="e.g. 125" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold font-mono"
                    value={formData.thickness}
                    onChange={e => setFormData({...formData, thickness: e.target.value})}
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
                        <SelectItem value="HOLD" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-amber-600">HOLD</SelectItem>
                        <SelectItem value="FAIL" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-rose-600">FAIL</SelectItem>
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
