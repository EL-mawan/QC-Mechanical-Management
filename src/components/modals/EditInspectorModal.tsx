"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Shield } from "lucide-react"
import { updateInspector } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditInspectorModalProps {
  inspector: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditInspectorModal({ inspector, open, onOpenChange, onSuccess }: EditInspectorModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: inspector?.name || "",
    email: inspector?.email || "",
    roleName: inspector?.role?.name || "QC_Inspector",
    certifications: inspector?.certifications || "Standard", 
    status: inspector?.status || "ACTIVE"
  })

  useEffect(() => {
    if (inspector) {
      setFormData({
        name: inspector.name || "",
        email: inspector.email || "",
        roleName: inspector.role?.name || "QC_Inspector",
        certifications: inspector.certifications || "Standard",
        status: inspector.status || "ACTIVE"
      })
    }
  }, [inspector])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Note: We might need to add updateInspector to server actions if it doesn't exist
    const result = await updateInspector(inspector.id, formData)
    
    if (result.success) {
      toast.success(result.message || "Inspector updated successfully")
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Failed to update inspector")
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white">
           <Shield className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit Inspector</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Update personnel credentials</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Full Name</Label>
                <Input 
                  placeholder="e.g. Sarah Connor" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Email Address</Label>
                <Input 
                  type="email"
                  placeholder="e.g. sarah.c@qc.com" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Role Type</Label>
                  <Select 
                    value={formData.roleName}
                    onValueChange={val => setFormData({...formData, roleName: val})}
                  >
                     <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase">
                        <SelectValue placeholder="Role" />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                        <SelectItem value="QC_Inspector" className="rounded-xl font-bold py-3 hover:bg-teal-50">INSPECTOR</SelectItem>
                        <SelectItem value="QC_Inspector_Lead" className="rounded-xl font-bold py-3 hover:bg-teal-50">QC LEAD</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Status</Label>
                  <Select 
                    value={formData.status}
                    onValueChange={val => setFormData({...formData, status: val})}
                  >
                     <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase">
                        <SelectValue placeholder="Status" />
                     </SelectTrigger>
                     <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                        <SelectItem value="ACTIVE" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-emerald-600">ACTIVE</SelectItem>
                        <SelectItem value="ON_LEAVE" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-amber-600">ON LEAVE</SelectItem>
                        <SelectItem value="INACTIVE" className="rounded-xl font-bold py-3 hover:bg-teal-50 text-rose-600">INACTIVE</SelectItem>
                     </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Certifications (Comma separated)</Label>
                <Input 
                  placeholder="e.g. CSWIP 3.1, ASNT Level II" 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.certifications}
                  onChange={e => setFormData({...formData, certifications: e.target.value})}
                />
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Member"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
