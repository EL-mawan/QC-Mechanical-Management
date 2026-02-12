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
import { createHydrotestPackage } from "@/app/actions/qc-actions"
import { toast } from "sonner"

interface CreateHydrotestPackageModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateHydrotestPackageModal({ open, onOpenChange, onSuccess }: CreateHydrotestPackageModalProps) {
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
      const loadProjects = async () => {
        const data = await getProjects()
        setProjects(data)
      }
      loadProjects()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload: any = {
        projectId: formData.projectId,
        testPackNumber: formData.testPackNumber,
        status: formData.status,
      }
      
      if (formData.result) payload.result = formData.result
      if (formData.testDate) payload.testDate = new Date(formData.testDate)

      const result = await createHydrotestPackage(payload)

      if (result.success) {
        toast.success("Hydrotest Package created successfully")
        setFormData({
            projectId: "",
            testPackNumber: "",
            status: "READY",
            result: "",
            testDate: ""
        })
        onSuccess()
        onOpenChange(false)
      } else {
        toast.error(result.message || "Failed to create package")
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
           <DialogTitle className="text-2xl font-black tracking-tight">New Hydrotest Package</DialogTitle>
           <p className="text-cyan-100/80 text-xs font-medium mt-1">Register new pressure test package</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
           <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Project *</Label>
                 <Select 
                   value={formData.projectId} 
                   onValueChange={(val) => setFormData({...formData, projectId: val})}
                   required
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Select Project" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       {projects.map(p => (
                          <SelectItem key={p.id} value={p.id} className="font-bold cursor-pointer">
                             {p.name}
                          </SelectItem>
                       ))}
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Test Pack Number *</Label>
                 <Input 
                    required 
                    placeholder="e.g. TP-001-A"
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50 font-mono tracking-widest"
                    value={formData.testPackNumber}
                    onChange={e => setFormData({...formData, testPackNumber: e.target.value})}
                 />
              </div>

              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Status</Label>
                 <Select 
                   value={formData.status} 
                   onValueChange={(val) => setFormData({...formData, status: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       <SelectItem value="READY" className="font-bold text-slate-600">Ready</SelectItem>
                       <SelectItem value="TESTED" className="font-bold text-blue-600">Tested</SelectItem>
                       <SelectItem value="APPROVED" className="font-bold text-emerald-600">Approved</SelectItem>
                       <SelectItem value="FAILED" className="font-bold text-rose-600">Failed</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
              
              <div className="space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Result (Optional)</Label>
                 <Select 
                   value={formData.result} 
                   onValueChange={(val) => setFormData({...formData, result: val})}
                 >
                    <SelectTrigger className="h-12 rounded-2xl border-slate-200 bg-slate-50">
                       <SelectValue placeholder="Result" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-none shadow-xl">
                       <SelectItem value="PASS" className="font-bold text-emerald-600">PASS</SelectItem>
                       <SelectItem value="FAIL" className="font-bold text-rose-600">FAIL</SelectItem>
                    </SelectContent>
                 </Select>
              </div>

              <div className="col-span-2 space-y-2">
                 <Label className="text-xs font-bold uppercase text-slate-500">Test Date</Label>
                 <Input 
                    type="date"
                    className="h-12 rounded-2xl border-slate-200 bg-slate-50"
                    value={formData.testDate}
                    onChange={e => setFormData({...formData, testDate: e.target.value})}
                 />
              </div>
           </div>

           <DialogFooter className="mt-8 pt-4 border-t border-slate-100">
             <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl h-12 px-6 font-bold text-slate-400">Cancel</Button>
             <Button type="submit" disabled={isSubmitting} className="bg-cyan-600 hover:bg-cyan-700 rounded-2xl h-12 px-10 font-black shadow-lg shadow-cyan-600/20 text-white flex-1">
               {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Package"}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
