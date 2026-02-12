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
import { Loader2, ShieldCheck } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { updateITPItemStatus } from "@/app/actions/qc-actions"
import { toast } from "sonner"

interface UpdateITPItemStatusModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemId: string
  currentStatus: string
  onSuccess: () => void
}

export function UpdateITPItemStatusModal({ open, onOpenChange, itemId, currentStatus, onSuccess }: UpdateITPItemStatusModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState(currentStatus)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const result = await updateITPItemStatus(itemId, status)

      if (result.success) {
        toast.success(result.message)
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to update phase status")
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
              <ShieldCheck className="h-5 w-5" />
           </div>
           <DialogTitle className="text-xl font-black tracking-tight">Inspection Verdict</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1">Submit result for this ITP stage</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">Phase Outcome</Label>
              <Select 
                value={status} 
                onValueChange={setStatus}
              >
                 <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Select Result" />
                 </SelectTrigger>
                 <SelectContent className="rounded-xl border-none shadow-xl">
                    <SelectItem value="PENDING" className="font-bold text-slate-400 cursor-pointer">PENDING</SelectItem>
                    <SelectItem value="PASS" className="font-bold text-emerald-600 cursor-pointer">PASS / APPROVED</SelectItem>
                    <SelectItem value="REJECT" className="font-bold text-rose-600 cursor-pointer">REJECT / FAIL</SelectItem>
                 </SelectContent>
              </Select>
           </div>

           <DialogFooter className="mt-6 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-11 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-11 px-8 font-black shadow-lg shadow-teal-600/20 text-white flex-1 transition-all">
               {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Verify Result"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
