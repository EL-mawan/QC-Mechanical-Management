"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, UserPlus } from "lucide-react"
import { createInspector } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface InviteInspectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function InviteInspectorModal({ open, onOpenChange, onSuccess }: InviteInspectorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    roleName: "QC_Inspector",
    certifications: "Standard"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await createInspector(formData)
    
    if (result.success) {
      toast.success(result.message || "Inspector invited successfully")
      setFormData({
        name: "",
        email: "",
        roleName: "QC_Inspector",
        certifications: "Standard"
      })
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Failed to invite inspector")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg text-slate-800">
        <div className="bg-[#1a4d4a] p-8 text-white">
           <UserPlus className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Invite New Inspector</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Register new quality control personnel</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Full Name *</Label>
                <Input 
                  placeholder="e.g. John Doe" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Email Address *</Label>
                <Input 
                  type="email"
                  placeholder="e.g. inspector@qc.com" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Primary Certifications</Label>
                <Input 
                  placeholder="e.g. CSWIP, ASNT, etc." 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.certifications}
                  onChange={e => setFormData({...formData, certifications: e.target.value})}
                />
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-900/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Registry Inspector"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
