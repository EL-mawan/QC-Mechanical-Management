"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Zap } from "lucide-react"
import { updateWPS } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditWPSModalProps {
  wps: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditWPSModal({ wps, open, onOpenChange, onSuccess }: EditWPSModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    number: wps?.number || "",
    process: wps?.process || "",
    fillerMetal: wps?.fillerMetal || "",
    position: wps?.position || "ALL",
    status: wps?.status || "APPROVED"
  })

  useEffect(() => {
    if (wps) {
      setFormData({
        number: wps.number || "",
        process: wps.process || "",
        fillerMetal: wps.fillerMetal || "",
        position: wps.position || "ALL",
        status: wps.status || "APPROVED"
      })
    }
  }, [wps])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await updateWPS(wps.id, formData)
    
    if (result.success) {
      toast.success(result.message || "WPS updated successfully")
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Failed to update WPS")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white">
           <Zap className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit WPS</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update procedure specifications</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">WPS Number</Label>
                <Input 
                  placeholder="e.g. WPS-SMAW-001" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.number}
                  onChange={e => setFormData({...formData, number: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Welding Process</Label>
                  <Select 
                    value={formData.process}
                    onValueChange={val => setFormData({...formData, process: val})}
                  >
                     <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase">
                        <SelectValue placeholder="Process" />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                        <SelectItem value="SMAW" className="rounded-xl font-bold py-3 hover:bg-teal-50">SMAW</SelectItem>
                        <SelectItem value="GTAW" className="rounded-xl font-bold py-3 hover:bg-teal-50">GTAW</SelectItem>
                        <SelectItem value="FCAW" className="rounded-xl font-bold py-3 hover:bg-teal-50">FCAW</SelectItem>
                        <SelectItem value="SAW" className="rounded-xl font-bold py-3 hover:bg-teal-50">SAW</SelectItem>
                        <SelectItem value="GMAW" className="rounded-xl font-bold py-3 hover:bg-teal-50">GMAW</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Position</Label>
                  <Input 
                    placeholder="e.g. 6G" 
                    required 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                    value={formData.position}
                    onChange={e => setFormData({...formData, position: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Filler Metal</Label>
                <Input 
                  placeholder="e.g. E7018 / ER70S-2" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.fillerMetal}
                  onChange={e => setFormData({...formData, fillerMetal: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Approval Status</Label>
                <Select 
                  value={formData.status}
                  onValueChange={val => setFormData({...formData, status: val})}
                >
                   <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase">
                      <SelectValue placeholder="Select Status" />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                      <SelectItem value="APPROVED" className="rounded-xl font-bold py-3 hover:bg-teal-50">APPROVED</SelectItem>
                      <SelectItem value="PENDING" className="rounded-xl font-bold py-3 hover:bg-teal-50">PENDING</SelectItem>
                      <SelectItem value="REVIEW" className="rounded-xl font-bold py-3 hover:bg-teal-50">UNDER REVIEW</SelectItem>
                      <SelectItem value="REJECTED" className="rounded-xl font-bold py-3 hover:bg-teal-50">REJECTED</SelectItem>
                   </SelectContent>
                </Select>
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update WPS"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
