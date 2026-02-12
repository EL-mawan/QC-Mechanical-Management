"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Loader2, Award } from "lucide-react"
import { updateWelder } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditWelderModalProps {
  welder: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditWelderModal({ welder, open, onOpenChange, onSuccess }: EditWelderModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: welder?.name || "",
    idNumber: welder?.idNumber || "",
    performance: welder?.performance || 100
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await updateWelder(welder.id, formData)
    
    if (result.success) {
      toast.success(result.message || "Welder updated successfully", {
        description: "Certification data refreshed",
        duration: 4000,
      })
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Failed to update welder", {
        description: "Please check the ID and try again",
        duration: 5000,
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white">
           <Award className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit Welder Profile</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update certification & performance metrics</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Full Legal Name</Label>
                <Input 
                  placeholder="e.g. Robert Pattinson" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Certification ID (Stamp)</Label>
                <Input 
                  placeholder="e.g. W-7728-XYZ" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-mono font-bold"
                  value={formData.idNumber}
                  onChange={e => setFormData({...formData, idNumber: e.target.value})}
                />
              </div>
              <div className="grid gap-4 pt-2">
                <div className="flex justify-between items-center">
                   <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Performance Rating</Label>
                   <span className="font-black text-teal-600 text-lg">{formData.performance}%</span>
                </div>
                <Slider 
                   defaultValue={[formData.performance]} 
                   max={100} 
                   step={1} 
                   onValueChange={(val) => setFormData({...formData, performance: val[0]})}
                   className="py-2"
                />
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Save Changes"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
