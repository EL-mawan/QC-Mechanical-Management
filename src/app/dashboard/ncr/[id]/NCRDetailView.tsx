"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Camera, FileText, History, MessageSquare, Link as LinkIcon, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"
import { uploadEvidence } from "@/app/actions/qc-actions"
import { UpdateNCRStatusModal } from "@/components/modals/UpdateNCRStatusModal"
import { toast } from "sonner"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { useRouter } from "next/navigation"

export function NCRDetailView({ initialData }: { initialData: any }) {
  const router = useRouter()
  const [ncr, setNcr] = useState<any>(initialData)
  const [isExporting, setIsExporting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showStatusModal, setShowStatusModal] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportPDF = async () => {
    if (!ncr) return
    setIsExporting(true)
    const toastId = toast.loading("Generating NCR Analysis Report...")

    try {
       const doc = new jsPDF()
       
       // Header
       doc.setFontSize(22)
       doc.setTextColor(153, 27, 27) // Red-800
       doc.text("NON-CONFORMANCE REPORT", 14, 22)
       doc.setFontSize(10)
       doc.setTextColor(100)
       doc.text(`Reference: ${ncr.ncrNumber}`, 14, 30)
       doc.text(`Issued: ${new Date(ncr.createdAt).toLocaleDateString()}`, 140, 30)

       // Basic Info Table
       autoTable(doc, {
          startY: 40,
          head: [['Category', 'Details']],
          body: [
             ['Project', ncr.inspection?.project?.name || 'N/A'],
             ['Site Location', ncr.inspection?.project?.location || 'N/A'],
             ['Inspector', ncr.inspection?.inspector?.name || 'N/A'],
             ['Status', ncr.status],
             ['Severity', ncr.severity || 'Medium'],
          ],
          headStyles: { fillColor: [153, 27, 27] },
          theme: 'striped',
       })

       // Content Sections
       const finalY = (doc as any).lastAutoTable.finalY + 10
       doc.setFontSize(12)
       doc.setTextColor(0)
       doc.text("Description of Non-Conformance:", 14, finalY)
       doc.setFontSize(10)
       doc.setTextColor(60)
       const splitDesc = doc.splitTextToSize(ncr.description || "N/A", 180)
       doc.text(splitDesc, 14, finalY + 7)

       const rcY = finalY + 7 + (splitDesc.length * 5) + 10
       doc.setFontSize(12)
       doc.setTextColor(0)
       doc.text("Root Cause Analysis:", 14, rcY)
       doc.setFontSize(10)
       doc.setTextColor(60)
       const splitRC = doc.splitTextToSize(ncr.rootCause || "N/A", 180)
       doc.text(splitRC, 14, rcY + 7)

       const caY = rcY + 7 + (splitRC.length * 5) + 10
       doc.setFontSize(12)
       doc.setTextColor(0)
       doc.text("Corrective Action Plan:", 14, caY)
       doc.setFontSize(10)
       doc.setTextColor(60)
       const splitCA = doc.splitTextToSize(ncr.correctiveAction || "N/A", 180)
       doc.text(splitCA, 14, caY + 7)

       doc.save(`NCR_${ncr.ncrNumber}.pdf`)
       toast.success("NCR Analysis exported", { id: toastId })
    } catch (err) {
       console.error(err)
       toast.error("Failed to generate PDF", { id: toastId })
    } finally {
       setIsExporting(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0]
     if (!file) return

     setIsUploading(true)
     const toastId = toast.loading(`Uploading ${file.name}...`)

     try {
        const mockUrl = `/uploads/${Date.now()}_${file.name}`
        const result = await uploadEvidence({
           url: mockUrl,
           fileName: file.name,
           fileType: file.type.split('/')[0],
           ncrId: ncr.id
        })

        if (result.success) {
           toast.success("Evidence attached to NCR registry", { id: toastId })
           router.refresh()
        } else {
           toast.error(result.message, { id: toastId })
        }
     } catch (err) {
        toast.error("Upload failed", { id: toastId })
     } finally {
        setIsUploading(false)
        if (fileInputRef.current) fileInputRef.current.value = ''
     }
  }

  return (
    <main className="flex-1 p-6">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileUpload}
            accept="image/*,application/pdf"
          />

          <div className="mb-6 flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" asChild className="rounded-full bg-white shadow-sm hover:bg-slate-50 transition-colors shrink-0">
                  <Link href="/dashboard/ncr"><ChevronLeft className="h-4 w-4" /></Link>
                </Button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-red-50 text-red-600 border-red-200 font-mono font-bold text-xs sm:text-sm">{ncr.ncrNumber}</Badge>
                    <h1 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight">Non-Conformance Report</h1>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground flex items-center gap-2 mt-1 font-medium truncate">
                    <LinkIcon className="h-3 w-3 shrink-0" /> 
                    <span className="hidden sm:inline">Linked to Inspection ID:</span>
                    <span className="sm:hidden">Insp:</span>
                    <span className="font-mono text-xs truncate">{ncr.inspectionId}</span>
                  </p>
                </div>
            </div>
            
            {/* Action Buttons - Responsive Layout */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
               <Button 
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  variant="outline" 
                  className="rounded-xl px-4 sm:px-6 h-10 sm:h-auto font-bold flex items-center justify-center gap-2 border-slate-200 text-sm"
               >
                  {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileText className="h-4 w-4" />} 
                  <span className="hidden sm:inline">Export PDF</span>
                  <span className="sm:hidden">Export</span>
               </Button>
               
               <div className="flex items-center gap-2 sm:gap-3">
                 <Badge className={`rounded-lg border px-3 py-1.5 font-bold text-xs sm:text-sm flex-1 sm:flex-none text-center ${
                    ncr.status === "OPEN" ? "bg-red-50 text-red-600 border-red-100" :
                    ncr.status === "ON_PROGRESS" ? "bg-amber-50 text-amber-600 border-amber-100" :
                    "bg-emerald-50 text-emerald-600 border-emerald-100"
                 }`}>
                   {ncr.status}
                 </Badge>
                 <Button 
                   onClick={() => setShowStatusModal(true)}
                   className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-4 sm:px-6 h-10 sm:h-auto font-bold shadow-lg shadow-teal-900/10 transition-transform active:scale-95 text-sm flex-1 sm:flex-none"
                 >
                   <span className="hidden sm:inline">Update Status</span>
                   <span className="sm:hidden">Update</span>
                 </Button>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
             <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white/80 backdrop-blur-md">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-black flex items-center gap-3 text-slate-800">
                       <FileText className="h-5 w-5 text-red-600" /> Description & Defect
                    </CardTitle>
                  </CardHeader>
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-slate-700 font-medium leading-relaxed">
                      {ncr.description || "No description provided."}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                      <div className="bg-white p-4 rounded-xl border border-slate-50">
                        <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Project Site</p>
                        <p className="font-bold text-slate-800">{ncr.inspection?.project?.name || 'N/A'}</p>
                        <p className="text-xs text-slate-400 font-medium">{ncr.inspection?.project?.location || ''}</p>
                      </div>
                      <div className="bg-white p-4 rounded-xl border border-slate-50">
                        <p className="text-muted-foreground text-[10px] uppercase font-black tracking-widest mb-1">Reporting Inspector</p>
                        <p className="font-bold text-slate-800">{ncr.inspection?.inspector?.name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400 font-medium">{ncr.inspection?.inspector?.email || ''}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white/80 backdrop-blur-md">
                   <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-black flex items-center gap-3 text-slate-800">
                       <History className="h-5 w-5 text-blue-600" /> Root Cause & Disposition
                    </CardTitle>
                  </CardHeader>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-3">Root Cause Analysis</h4>
                      <p className="text-sm font-medium text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100 leading-relaxed italic">
                        {ncr.rootCause || "No root cause analysis logged yet."}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] uppercase font-black text-emerald-600 tracking-widest mb-3">Corrective & Preventive Action</h4>
                      <p className="text-sm font-bold text-emerald-700 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100 leading-relaxed shadow-sm">
                        {ncr.correctiveAction || "Pending corrective action plan."}
                      </p>
                    </div>
                  </div>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-lg font-black flex items-center gap-3 text-slate-800">
                      <Camera className="h-5 w-5 text-teal-600" /> Evidence (Photos)
                    </CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-3">
                    {ncr.evidence && ncr.evidence.map((ev: any) => (
                       <div key={ev.id} className="aspect-square bg-slate-100 rounded-2xl relative group overflow-hidden border border-slate-50">
                          <img src={ev.url} className="object-cover w-full h-full" alt={ev.fileName} />
                          <div className="absolute inset-x-0 bottom-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <p className="text-[8px] text-white font-bold truncate">{ev.fileName}</p>
                          </div>
                       </div>
                    ))}
                    <Button 
                       disabled={isUploading}
                       onClick={() => fileInputRef.current?.click()}
                       variant="outline" 
                       className="aspect-square flex flex-col items-center justify-center border-dashed border-2 rounded-2xl hover:bg-slate-50 transition-colors border-slate-200"
                    >
                       {isUploading ? <Loader2 className="h-6 w-6 animate-spin text-teal-600" /> : <Plus className="h-6 w-6 text-slate-400" />}
                       <span className="text-[10px] mt-2 font-black text-slate-400 uppercase tracking-tighter">
                          {isUploading ? "Uploading..." : "Add Evidence"}
                       </span>
                    </Button>
                  </div>
                </Card>

                <Card className="border-none shadow-sm rounded-3xl p-8 bg-white overflow-hidden relative">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -mr-12 -mt-12" />
                  <CardHeader className="px-0 pt-0 relative z-10">
                    <CardTitle className="text-lg font-black flex items-center gap-3 text-slate-800">
                      <MessageSquare className="h-5 w-5 text-indigo-600" /> Timeline Logs
                    </CardTitle>
                  </CardHeader>
                  <div className="space-y-6 relative z-10">
                    <div className="flex gap-4 relative">
                      <div className="absolute left-[3px] top-[18px] bottom-0 w-[2px] bg-slate-100" />
                      <div className="h-2 w-2 rounded-full bg-red-500 mt-2.5 shrink-0 z-10 ring-4 ring-white" />
                      <div>
                        <p className="text-xs font-black text-slate-800">NCR Issued</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(ncr.createdAt).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="h-2 w-2 rounded-full bg-slate-300 mt-2.5 shrink-0 z-10 ring-4 ring-white" />
                      <div>
                        <p className="text-xs font-black text-slate-400 italic">Last Updated</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">{new Date(ncr.updatedAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {ncr.closedDate && (
                        <div className="flex gap-4">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 mt-2.5 shrink-0 z-10 ring-4 ring-white" />
                            <div>
                                <p className="text-xs font-black text-emerald-600 uppercase">NCR Closed</p>
                                <p className="text-[10px] text-emerald-400 font-bold mt-0.5">{new Date(ncr.closedDate).toLocaleString()}</p>
                            </div>
                        </div>
                    )}
                  </div>
                </Card>
             </div>
          </div>
          
          <UpdateNCRStatusModal 
             open={showStatusModal}
             onOpenChange={setShowStatusModal}
             ncrId={ncr.id}
             currentStatus={ncr.status}
             onSuccess={() => router.refresh()}
          />
    </main>
  )
}
