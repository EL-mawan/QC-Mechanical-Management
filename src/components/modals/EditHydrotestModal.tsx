"use client"

import { useState, useEffect } from "react"
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
import { Loader2, Droplets } from "lucide-react"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { getProjects } from "@/app/actions/master-actions"
import { updateHydrotestPackage } from "@/app/actions/qc-actions"
import { toast } from "sonner"

interface EditHydrotestModalProps {
  packageData: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function EditHydrotestModal({ packageData, open, onOpenChange, onSuccess }: EditHydrotestModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  
  const [formData, setFormData] = useState({
    projectId: "",
    testPackNumber: "",
    status: "READY",
    result: "",
    testDate: ""
  })

  useEffect(() => {
    if (open) {
      const loadInitialData = async () => {
        const data = await getProjects()
        setProjects(data)
      }
      loadInitialData()
    }
  }, [open])

  useEffect(() => {
    if (packageData) {
      setFormData({
        projectId: packageData.projectId || "",
        testPackNumber: packageData.testPackNumber || "",
        status: packageData.status || "READY",
        result: packageData.result || "",
        testDate: packageData.testDate ? new Date(packageData.testDate).toISOString().split('T')[0] : ""
      })
    }
  }, [packageData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload: any = {
        projectId: formData.projectId,
        testPackNumber: formData.testPackNumber,
        status: formData.status,
        result: formData.result || null,
        testDate: formData.testDate ? new Date(formData.testDate) : null
      }

      const result = await updateHydrotestPackage(packageData.id, payload)

      if (result.success) {
        toast.success("Hydrotest Package updated successfully")
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to update package")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-lg">
        <div className="bg-[#00acc1] p-8 text-white relative">
           <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4">
              <Droplets className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight">Edit Test Package</DialogTitle>
           <p className="text-cyan-100/80 text-[10px] uppercase font-bold mt-1 tracking-widest">Update pressure test registry & results</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Target Project *</Label>
                 <Select 
                   value={formData.projectId} 
                   onValueChange={(val) => setFormData({...formData, projectId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       {projects.map(p => (
                          <SelectItem key={p.id} value={p.id} className="rounded-xl font-bold py-3 hover:bg-cyan-50">
                             {p.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Test Pack Number *</Label>
                 <Input 
                    required 
                    placeholder="e.g. TP-001-A"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-mono tracking-widest uppercase font-bold focus:bg-white transition-all"
                    value={formData.testPackNumber}
                    onChange={e => setFormData({...formData, testPackNumber: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Process Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       <SelectItem value="READY" className="font-bold text-slate-600 rounded-xl hover:bg-slate-50">Ready</SelectItem>
                       <SelectItem value="TESTED" className="font-bold text-blue-600 rounded-xl hover:bg-blue-50">Tested</SelectItem>
                       <SelectItem value="APPROVED" className="font-bold text-emerald-600 rounded-xl hover:bg-emerald-50">Approved</SelectItem>
                       <SelectItem value="FAILED" className="font-bold text-rose-600 rounded-xl hover:bg-rose-50">Failed</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              
              <div className="space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Final Result</Label>
                 <Select 
                   value={formData.result || "none"} 
                   onValueChange={(val) => setFormData({...formData, result: val === "none" ? "" : val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold">
                       <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-none shadow-2xl bg-white p-2">
                       <SelectItem value="none" className="font-bold text-slate-400 rounded-xl hover:bg-slate-50">Unset</SelectItem>
                       <SelectItem value="PASS" className="font-bold text-emerald-600 rounded-xl hover:bg-emerald-50">PASS</SelectItem>
                       <SelectItem value="FAIL" className="font-bold text-rose-600 rounded-xl hover:bg-rose-50">FAIL</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Test Execution Date</Label>
                 <Input 
                    type="date"
                    className="h-12 rounded-2xl border-slate-100 bg-slate-50 font-bold focus:bg-white transition-all shadow-inner"
                    value={formData.testDate}
                    onChange={e => setFormData({...formData, testDate: e.target.value})}
                 />
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-2xl h-12 px-10 font-black shadow-lg shadow-teal-900/20 text-white flex-1 transition-all active:scale-95">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Package"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
