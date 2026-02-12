"use client"

import { useState } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ListPlus } from "lucide-react"
import { createITPItem } from "@/app/actions/qc-actions"
import { toast } from "sonner"

interface AddITPItemModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itpId: string
  onSuccess: () => void
}

export function AddITPItemModal({ open, onOpenChange, itpId, onSuccess }: AddITPItemModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    stage: "",
    description: "",
    holdPoint: false,
    witnessPoint: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await createITPItem({
          ...formData,
          itpId
      })

      if (result.success) {
        toast.success(result.message)
        setFormData({
            stage: "",
            description: "",
            holdPoint: false,
            witnessPoint: false
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to add ITP phase")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-md">
        <div className="bg-[#1a4d4a] p-6 text-white relative">
           <div className="bg-white/10 p-2 rounded-xl w-fit mb-3">
              <ListPlus className="h-5 w-5" />
           </div>
           <DialogTitle className="text-xl font-black tracking-tight">Add Inspection Phase</DialogTitle>
           <p className="text-teal-100/60 text-[10px] font-bold mt-1 uppercase tracking-widest">Append new stage to ITP framework</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div className="space-y-4">
              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Stage Name *</Label>
                 <Input 
                    placeholder="e.g. Visual Welding Inspection"
                    required
                    className="h-11 rounded-2xl border-slate-200 bg-slate-50 font-bold"
                    value={formData.stage}
                    onChange={e => setFormData({...formData, stage: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Requirements / Description</Label>
                 <Textarea 
                    placeholder="Reference standards, tolerances, etc."
                    className="rounded-2xl border-slate-200 bg-slate-50 min-h-[80px]"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                 />
              </div>

              <div className="flex gap-6 pt-2">
                 <div className="flex items-center space-x-2">
                    <Checkbox 
                       id="holdPoint" 
                       checked={formData.holdPoint}
                       onCheckedChange={(checked) => setFormData({...formData, holdPoint: !!checked})}
                       className="rounded-lg border-rose-200 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500" 
                    />
                    <label htmlFor="holdPoint" className="text-xs font-black text-rose-600 uppercase cursor-pointer">Hold Point</label>
                 </div>
                 <div className="flex items-center space-x-2">
                    <Checkbox 
                       id="witnessPoint" 
                       checked={formData.witnessPoint}
                       onCheckedChange={(checked) => setFormData({...formData, witnessPoint: !!checked})}
                       className="rounded-lg border-blue-200 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500" 
                    />
                    <label htmlFor="witnessPoint" className="text-xs font-black text-blue-600 uppercase cursor-pointer">Witness Point</label>
                 </div>
              </div>
           </div>

           <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-11 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-11 px-8 font-black shadow-lg shadow-teal-600/20 text-white flex-1 transition-all">
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to Framework"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
