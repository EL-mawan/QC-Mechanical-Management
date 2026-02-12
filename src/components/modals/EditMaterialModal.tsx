"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Warehouse } from "lucide-react"
import { updateMaterial } from "@/app/actions/master-actions"
import { toast } from "sonner"

interface EditMaterialModalProps {
  material: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditMaterialModal({ material, open, onOpenChange, onSuccess }: EditMaterialModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: material?.name || "",
    specification: material?.specification || "",
    heatNumber: material?.heatNumber || "",
    quantity: material?.quantity || 0,
    unit: material?.unit || "pcs"
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await updateMaterial(material.id, formData)
    
    if (result.success) {
      toast.success(result.message || "Material updated successfully", {
        description: "Stock inventory refreshed",
        duration: 4000,
      })
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Failed to update material", {
        description: "Consistency check failed",
        duration: 5000,
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white">
           <Warehouse className="h-8 w-8 mb-4 text-teal-300" />
           <DialogTitle className="text-2xl font-black">Edit Inventory Item</DialogTitle>
           <p className="text-teal-100/60 text-xs font-medium mt-1 uppercase tracking-widest">Adjust stock levels & specifications</p>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
           <div className="space-y-4">
              <div className="grid gap-2">
                <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Item Description</Label>
                <Input 
                  placeholder="e.g. Steel Plate 12mm x 1500 x 6000" 
                  required 
                  className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="grid gap-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Standard / Spec</Label>
                   <Input 
                    placeholder="ASTM A36" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold uppercase"
                    value={formData.specification}
                    onChange={e => setFormData({...formData, specification: e.target.value})}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Heat Number</Label>
                   <Input 
                    placeholder="HT-XXXXX" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-mono font-bold"
                    value={formData.heatNumber}
                    onChange={e => setFormData({...formData, heatNumber: e.target.value})}
                   />
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Quantity</Label>
                   <Input 
                    type="number"
                    placeholder="0" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.quantity}
                    onChange={e => setFormData({...formData, quantity: parseFloat(e.target.value)})}
                   />
                 </div>
                 <div className="grid gap-2">
                   <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Unit</Label>
                   <Input 
                    placeholder="pcs / kg / length" 
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold"
                    value={formData.unit}
                    onChange={e => setFormData({...formData, unit: e.target.value})}
                   />
                 </div>
              </div>
           </div>
           <DialogFooter className="mt-8">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20">
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify & Commit"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
