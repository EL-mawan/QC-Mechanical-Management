"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronLeft, Camera, CheckCircle2, 
  FileText, Info, Target, Plus, 
  Loader2, ListChecks 
} from "lucide-react"
import Link from "next/link"
import { useRef, useState } from "react"
import { uploadEvidence } from "@/app/actions/qc-actions"
import { AddITPItemModal } from "@/components/modals/AddITPItemModal"
import { UpdateITPItemStatusModal } from "@/components/modals/UpdateITPItemStatusModal"
import { toast } from "sonner"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { useRouter } from "next/navigation"

export function ITPDetailView({ initialData }: { initialData: any }) {
  const router = useRouter()
  const [itp, setItp] = useState<any>(initialData)
  const [isExporting, setIsExporting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<{id: string, status: string} | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExportPDF = async () => {
    if (!itp) return
    setIsExporting(true)
    const toastId = toast.loading("Generating ITP Matrix PDF...")

    try {
       const doc = new jsPDF()
       
       // Header
       doc.setFontSize(20)
       doc.setTextColor(26, 77, 74) // #1a4d4a
       doc.text(itp.title, 14, 22)
       
       doc.setFontSize(10)
       doc.setTextColor(100)
       doc.text(`Project: ${itp.project?.name || 'N/A'}`, 14, 30)
       doc.text(`Status: ${itp.status}`, 14, 35)
       doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 140, 30)

       // Matrix Table
       const tableData = itp.itpItems?.map((item: any, idx: number) => [
          String(idx + 1).padStart(2, '0'),
          item.stage,
          item.description,
          item.holdPoint ? 'HOLD' : item.witnessPoint ? 'WITNESS' : 'SURVEILLANCE',
          item.approvalStatus
       ]) || []

       autoTable(doc, {
          startY: 45,
          head: [['#', 'Phase', 'Description', 'Control Point', 'Status']],
          body: tableData,
          headStyles: { fillColor: [26, 77, 74] },
          alternateRowStyles: { fillColor: [248, 250, 250] },
          margin: { top: 45 },
       })

       doc.save(`ITP_${itp.title.replace(/\s+/g, '_')}.pdf`)
       toast.success("ITP Document exported successfully", { id: toastId })
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
           itpId: itp.id
        })

        if (result.success) {
           toast.success("Evidence attached to framework", { id: toastId })
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

          <div className="mb-6 sm:mb-8 flex flex-col gap-4">
            <div className="flex items-center gap-3 sm:gap-5">
                <Button variant="ghost" size="icon" asChild className="rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-slate-50 border border-slate-100 h-10 w-10 sm:h-12 sm:w-12 transition-all active:scale-90 shrink-0">
                   <Link href="/dashboard/itp"><ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" /></Link>
                </Button>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                     <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1a4d4a] tracking-tight truncate">{itp.title}</h1>
                     <Badge className={`rounded-xl px-3 sm:px-4 py-1 text-[9px] sm:text-[10px] font-black tracking-widest border-2 shrink-0 ${
                        itp.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                     }`}>
                        {itp.status}
                     </Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-500 font-bold flex items-center gap-2 mt-1 uppercase tracking-widest truncate">
                     <Target className="h-3 w-3 sm:h-4 sm:w-4 text-teal-600 shrink-0" /> 
                     <span className="truncate">{itp.project?.name || 'Unassigned Framework'}</span>
                     <span className="hidden sm:inline">| REV 00</span>
                  </p>
                </div>
            </div>
            
            {/* Action Buttons - Responsive */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
               <Button 
                  onClick={() => setShowAddItemModal(true)}
                  className="bg-teal-600 hover:bg-teal-700 text-white rounded-2xl px-4 sm:px-8 h-10 sm:h-12 font-black shadow-xl shadow-teal-600/20 flex items-center justify-center gap-2 transition-transform active:scale-95 text-sm sm:text-base"
               >
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> 
                  <span className="hidden sm:inline">Append Phase</span>
                  <span className="sm:hidden">Add Phase</span>
               </Button>
               <Button className="bg-[#1a4d4a] hover:bg-teal-900 text-white rounded-2xl px-4 sm:px-6 h-10 sm:h-12 font-black shadow-xl shadow-teal-900/10 transition-transform active:scale-95 text-sm sm:text-base">
                  <span className="hidden sm:inline">Update Plan</span>
                  <span className="sm:hidden">Update</span>
               </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
             <Card className="border-none shadow-sm rounded-4xl p-0 col-span-1 lg:col-span-2 bg-white overflow-hidden ring-1 ring-slate-100/50">
                <CardHeader className="p-6 sm:p-8 border-b border-slate-50 bg-slate-50/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                     <div className="bg-teal-600/10 p-2 sm:p-2.5 rounded-xl shadow-inner">
                        <ListChecks className="h-5 w-5 text-teal-600" />
                     </div>
                     <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Inspection Matrix</CardTitle>
                  </div>
                  <Badge className="bg-white text-slate-400 border-slate-100 text-[10px] py-1 px-4 rounded-full font-black uppercase tracking-widest shadow-sm">
                     {itp.itpItems?.length || 0} Total Stages
                  </Badge>
                </CardHeader>
                <div className="p-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block">
                    <Table>
                      <TableHeader className="bg-white border-none">
                        <TableRow className="hover:bg-transparent border-b border-slate-50 whitespace-nowrap">
                          <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">#</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Activity / Inspection Phase</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none text-center">Point</TableHead>
                          <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Comp. Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {(!itp.itpItems || itp.itpItems.length === 0) ? (
                           <TableRow>
                              <TableCell colSpan={4} className="py-20 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">No phases defined in matrix</TableCell>
                           </TableRow>
                        ) : itp.itpItems.map((step: any, idx: number) => (
                          <TableRow 
                             key={step.id} 
                             onClick={() => setSelectedItem({ id: step.id, status: step.approvalStatus })}
                             className="hover:bg-teal-50/10 border-b border-slate-50 group cursor-pointer transition-colors whitespace-nowrap"
                          >
                            <TableCell className="pl-8 py-6 text-sm font-black text-slate-300 font-mono italic">{String(idx + 1).padStart(2, '0')}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-black text-slate-800 text-lg group-hover:text-teal-700 transition-colors leading-tight">{step.stage}</span>
                                <div className="flex flex-col gap-1 mt-1">
                                   <span className="text-[11px] font-bold text-slate-400 leading-relaxed truncate max-w-[400px]">{step.description}</span>
                                   {step.evidence && step.evidence.length > 0 && (
                                      <div className="flex gap-2 mt-2">
                                         {step.evidence.map((ev: any) => (
                                            <Badge key={ev.id} variant="secondary" className="bg-teal-50/50 text-teal-600 border-teal-100 text-[9px] font-bold rounded-lg px-2 py-0">
                                               <Camera className="h-3 w-3 mr-1" /> {ev.fileName}
                                            </Badge>
                                         ))}
                                      </div>
                                   )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex flex-col gap-1 items-center">
                                 {step.holdPoint && (
                                    <Badge className="rounded-lg text-[9px] font-black tracking-widest bg-rose-50 text-rose-600 border-rose-100 py-0.5 px-3 uppercase border shadow-sm">Hold</Badge>
                                 )}
                                 {step.witnessPoint && (
                                    <Badge className="rounded-lg text-[9px] font-black tracking-widest bg-blue-50 text-blue-600 border-blue-100 py-0.5 px-3 uppercase border shadow-sm">Witness</Badge>
                                 )}
                                 {!step.holdPoint && !step.witnessPoint && <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Surv.</span>}
                              </div>
                            </TableCell>
                            <TableCell>
                               <Badge 
                                 className={`rounded-xl px-4 py-1 text-[10px] font-black tracking-widest border-none shadow-md ${
                                    step.approvalStatus === "PASS" ? "bg-emerald-500 text-white" : 
                                    step.approvalStatus === "REJECT" ? "bg-rose-500 text-white" : 
                                    "bg-slate-50 text-slate-300 shadow-none border border-slate-100"
                                 }`}
                               >
                                 {step.approvalStatus}
                               </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* Mobile Mobile View */}
                  <div className="md:hidden space-y-4 p-4">
                    {(!itp.itpItems || itp.itpItems.length === 0) ? (
                       <div className="py-12 text-center text-slate-300 font-bold uppercase text-[10px] tracking-widest">No phases defined in matrix</div>
                    ) : itp.itpItems.map((step: any, idx: number) => (
                      <Card 
                         key={step.id} 
                         onClick={() => setSelectedItem({ id: step.id, status: step.approvalStatus })}
                         className="border-none shadow-sm rounded-2xl p-5 bg-white ring-1 ring-slate-100 hover:ring-teal-200 transition-all cursor-pointer active:scale-[0.98]"
                      >
                         <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 min-w-0 pr-4">
                               <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px] font-mono font-black text-slate-300">#{String(idx + 1).padStart(2, '0')}</span>
                                  <Badge 
                                    className={`rounded-lg px-2 py-0.5 text-[9px] font-black border-none ${
                                       step.approvalStatus === "PASS" ? "bg-emerald-500 text-white" : 
                                       step.approvalStatus === "REJECT" ? "bg-rose-500 text-white" : 
                                       "bg-slate-100 text-slate-400"
                                    }`}
                                  >
                                    {step.approvalStatus}
                                  </Badge>
                               </div>
                               <h3 className="font-black text-slate-800 text-base leading-tight">{step.stage}</h3>
                            </div>
                            <div className="flex flex-col gap-1 items-end">
                               {step.holdPoint && (
                                  <Badge className="rounded-lg text-[8px] font-black bg-rose-50 text-rose-600 border-rose-100 px-2 py-0.5 uppercase border whitespace-nowrap">Hold</Badge>
                               )}
                               {step.witnessPoint && (
                                  <Badge className="rounded-lg text-[8px] font-black bg-blue-50 text-blue-600 border-blue-100 px-2 py-0.5 uppercase border whitespace-nowrap">Witness</Badge>
                               )}
                            </div>
                         </div>
                         
                         <p className="text-xs font-bold text-slate-400 mb-4 line-clamp-2 leading-relaxed">{step.description}</p>
                         
                         <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                            <div className="flex gap-2">
                               {step.evidence && step.evidence.length > 0 ? (
                                  <Badge variant="secondary" className="bg-teal-50 text-teal-600 border-teal-100 text-[8px] font-black rounded-lg px-2 py-0.5">
                                     <Camera className="h-2.5 w-2.5 mr-1" /> {step.evidence.length} FILES
                                  </Badge>
                               ) : (
                                  <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">No Evidence</span>
                               )}
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 px-4 rounded-xl text-teal-600 font-black bg-teal-50/50 hover:bg-teal-50 transition-all text-[9px] uppercase tracking-wider">
                               Update Status
                            </Button>
                         </div>
                      </Card>
                    ))}
                  </div>
                </div>
             </Card>

             <div className="flex flex-col gap-8">
                <Card className="border-none shadow-sm rounded-4xl p-8 bg-[#1a4d4a] text-white overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-700" />
                  <CardHeader className="px-0 pt-0 flex flex-row items-center justify-between relative z-10">
                    <CardTitle className="text-xl font-black tracking-tight">Project Context</CardTitle>
                    <div className="bg-white/10 p-2 rounded-xl">
                       <Info className="h-5 w-5 text-teal-300" />
                    </div>
                  </CardHeader>
                  <div className="space-y-6 relative z-10 pt-4">
                    <div className="flex flex-col border-b border-white/10 pb-4">
                       <span className="text-[10px] font-black text-teal-300/60 uppercase tracking-widest mb-1 leading-none">Contract Owner</span>
                       <span className="font-bold text-lg">{itp.project?.client?.name || 'Global Energy Corp'}</span>
                    </div>
                    <div className="flex flex-col border-b border-white/10 pb-4">
                       <span className="text-[10px] font-black text-teal-300/60 uppercase tracking-widest mb-1 leading-none">Operating Site</span>
                       <span className="font-bold text-lg">{itp.project?.location || 'Main Shipyard Yard - Block B'}</span>
                    </div>
                    <div className="flex flex-col border-b border-white/10 pb-4">
                       <span className="text-[10px] font-black text-teal-300/60 uppercase tracking-widest mb-1 leading-none">ITP Discipline</span>
                       <span className="font-bold text-lg text-teal-200">Mechanical & Structure</span>
                    </div>
                    {itp.evidence && itp.evidence.length > 0 && (
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-teal-300/60 uppercase tracking-widest mb-2 leading-none">Framework Attachments</span>
                          <div className="flex flex-wrap gap-2">
                             {itp.evidence.map((ev: any) => (
                                <Badge key={ev.id} className="bg-white/10 text-white border-white/10 text-[9px]">
                                   {ev.fileName}
                                </Badge>
                             ))}
                          </div>
                       </div>
                    )}
                  </div>
                </Card>

                <Card className="border-none shadow-sm rounded-4xl p-8 bg-white border border-slate-50">
                  <CardHeader className="px-0 pt-0">
                    <CardTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                       <div className="bg-emerald-600/10 p-2 rounded-xl">
                          <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                       </div>
                       Quick Operations
                    </CardTitle>
                  </CardHeader>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button 
                       disabled={isUploading}
                       onClick={() => fileInputRef.current?.click()}
                       variant="outline" 
                       className="h-24 flex flex-col gap-3 rounded-3xl border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all group active:scale-95 disabled:opacity-50"
                    >
                       <div className="bg-teal-100 p-2 rounded-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                          {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-teal-700">Add Evidence</span>
                    </Button>
                    <Button 
                       disabled={isExporting}
                       onClick={handleExportPDF}
                       variant="outline" 
                       className="h-24 flex flex-col gap-3 rounded-3xl border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group active:scale-95 disabled:opacity-50"
                    >
                       <div className="bg-blue-100 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
                          {isExporting ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                       </div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-blue-700">Export PDF</span>
                    </Button>
                  </div>
                </Card>
             </div>
          </div>

          <AddITPItemModal 
             open={showAddItemModal}
             onOpenChange={setShowAddItemModal}
             itpId={itp.id}
             onSuccess={() => router.refresh()}
          />

          {selectedItem && (
            <UpdateITPItemStatusModal
                open={!!selectedItem}
                onOpenChange={(open) => !open && setSelectedItem(null)}
                itemId={selectedItem.id}
                currentStatus={selectedItem.status}
                onSuccess={() => router.refresh()}
            />
          )}
    </main>
  )
}
