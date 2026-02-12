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
import { Label } from "@/components/ui/label"
import { Loader2, RefreshCcw } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateNCRStatus } from "@/app/actions/qc-actions"
import { toast } from "sonner"

interface UpdateNCRStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ncrId: string
  currentStatus: string
  onSuccess: () => void
}

export function UpdateNCRStatusModal({ open, onOpenChange, ncrId, currentStatus, onSuccess }: UpdateNCRStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateNCRStatus(ncrId, status)

      if (result.success) {
        toast.success(result.message)
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to update status")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-sm">
        <div className="bg-[#1a4d4a] p-6 text-white relative">
           <div className="bg-white/10 p-2 rounded-xl w-fit mb-3">
              <RefreshCcw className="h-5 w-5" />
           </div>
           <DialogTitle className="text-xl font-black tracking-tight">Update Status</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1">Change current resolution stage</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">New Status</Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
              >
                 <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select Status" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="OPEN" className="font-bold text-red-600">OPEN</SelectItem>
                    <SelectItem value="ON_PROGRESS" className="font-bold text-amber-600">ON PROGRESS</SelectItem>
                    <SelectItem value="CLOSED" className="font-bold text-emerald-600">CLOSED</SelectItem>
                 </SelectContent>
              </Select>
           </div>

           <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-11 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-11 px-8 font-black shadow-lg shadow-teal-600/20 text-white flex-1">
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
