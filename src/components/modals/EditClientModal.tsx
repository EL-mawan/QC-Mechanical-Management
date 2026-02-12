"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Building2 } from "lucide-react"
import { updateClient } from "@/app/actions/client-actions"
import { toast } from "sonner"

interface EditClientModalProps {
  client: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditClientModal({ client, open, onOpenChange, onSuccess }: EditClientModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: client?.name || "",
    email: client?.email || "",
    contact: client?.contact || "",
    address: client?.address || ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const result = await updateClient(client.id, formData)
    
    if (result.success) {
      toast.success(result.message || "Client berhasil diupdate", {
        description: "Data telah tersimpan ke database",
        duration: 4000,
      })
      onOpenChange(false)
      onSuccess()
    } else {
      toast.error(result.message || "Gagal mengupdate client", {
        description: "Silakan periksa data dan coba lagi",
        duration: 5000,
      })
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#1a4d4a] p-8 text-white relative">
          <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4">
            <Building2 className="h-6 w-6" />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tight">Edit Client</DialogTitle>
          <p className="text-teal-100/60 text-xs font-medium mt-1">Update client information</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-slate-600 font-bold text-xs uppercase tracking-widest pl-1">
                Company Name
              </Label>
              <Input 
                id="name" 
                required 
                className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-inner px-4 border-2 focus:border-teal-500" 
                placeholder="e.g. PT Energy Persada"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-slate-600 font-bold text-xs uppercase tracking-widest pl-1">
                Primary Email
              </Label>
              <Input 
                id="email" 
                type="email"
                className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-inner px-4 border-2 focus:border-teal-500" 
                placeholder="contact@company.com"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="contact" className="text-slate-600 font-bold text-xs uppercase tracking-widest pl-1">
                Contact Person
              </Label>
              <Input 
                id="contact" 
                className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-inner px-4 border-2 focus:border-teal-500" 
                placeholder="Personal name"
                value={formData.contact}
                onChange={e => setFormData({...formData, contact: e.target.value})}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address" className="text-slate-600 font-bold text-xs uppercase tracking-widest pl-1">
                Address
              </Label>
              <Input 
                id="address" 
                className="h-12 rounded-2xl border-slate-100 bg-slate-50 focus:bg-white transition-all shadow-inner px-4 border-2 focus:border-teal-500" 
                placeholder="Company address"
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-8">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)} 
              className="rounded-2xl h-12 px-6 font-bold text-slate-400"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting} 
              className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-600/20 text-white"
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Client"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
