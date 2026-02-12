"use client"

import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FileText, Camera, CheckCircle2, XCircle } from "lucide-react"
import { Input } from "@/components/ui/input"

const mockReports = [
  { 
    id: "1", 
    project: "Offshore Platform X", 
    drawing: "DWG-2024-001", 
    inspector: "QC Inspector 1", 
    status: "PASS", 
    date: "2024-02-10",
    evidence: true 
  },
  { 
    id: "2", 
    project: "Pipeline Installation", 
    drawing: "DWG-2024-005", 
    inspector: "QC Inspector 2", 
    status: "REJECT", 
    date: "2024-02-11",
    evidence: false 
  },
]

export default function MDRPage() {
  const params = useParams()
  const type = params.type as string
  
  const title = (type?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') || "MDR") + " Module"

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4">
           <div className="bg-[#1a4d4a] p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl shadow-teal-900/10 text-white shrink-0">
              <FileText className="h-6 w-6 sm:h-7 sm:w-7" />
           </div>
           <div>
             <h1 className="text-2xl sm:text-3xl font-black text-[#1a4d4a] tracking-tight leading-tight">{title}</h1>
             <p className="text-muted-foreground text-xs sm:text-sm font-medium">Manufacturing Data Report - Centralized Logs</p>
           </div>
        </div>
        <Button className="bg-[#1a4d4a] hover:bg-[#1a4d4a]/90 rounded-xl px-6 sm:px-8 h-10 sm:h-12 flex items-center justify-center gap-2 shadow-lg shadow-teal-900/20 font-bold transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-sm sm:text-base cursor-pointer">
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" /> Create Report
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:-translate-y-1 transition-all border border-white/50 hover:shadow-md">
          <div className="bg-blue-50 text-blue-600 p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-6 shadow-inner">
            <FileText className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none truncate">Total Reports</p>
            <p className="text-lg sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 truncate">124</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:-translate-y-1 transition-all border border-white/50 hover:shadow-md">
          <div className="bg-emerald-50 text-emerald-600 p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-6 shadow-inner">
            <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none truncate">Passed Items</p>
            <p className="text-lg sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 truncate">112</p>
          </div>
        </Card>
        <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:-translate-y-1 transition-all border border-white/50 hover:shadow-md">
          <div className="bg-rose-50 text-rose-600 p-2 sm:p-4 rounded-xl sm:rounded-2xl transition-all group-hover:scale-110 group-hover:rotate-6 shadow-inner">
            <XCircle className="h-4 w-4 sm:h-6 sm:w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none truncate">Rejected</p>
            <p className="text-lg sm:text-3xl font-black text-slate-800 mt-1 sm:mt-2 truncate">12</p>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/80 backdrop-blur-md border border-white/20">
         <CardHeader className="p-4 sm:p-8 border-b border-slate-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
               <div className="h-8 sm:h-10 w-1 flex bg-teal-600 rounded-full" />
               <CardTitle className="text-xl font-black text-slate-800 tracking-tight">Record Database</CardTitle>
            </div>
            <div className="relative w-full sm:w-80">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               <Input placeholder="Search reports..." className="pl-11 h-11 sm:h-12 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white transition-all text-sm shadow-inner" />
            </div>
         </CardHeader>
         <CardContent className="p-0">
            {/* Desktop View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-none whitespace-nowrap">
                    <TableHead className="font-black text-slate-400 pl-8 h-14 uppercase text-[10px] tracking-widest leading-none">Project Info</TableHead>
                    <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Drawing Reference</TableHead>
                    <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">QC Authority</TableHead>
                    <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest leading-none">Timestamp</TableHead>
                    <TableHead className="font-black text-slate-400 h-14 uppercase text-[10px] tracking-widest text-center leading-none">Status</TableHead>
                    <TableHead className="text-right pr-8 h-14 font-black text-slate-400 uppercase text-[10px] tracking-widest leading-none">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReports.map((report) => (
                    <TableRow key={report.id} className="border-b border-slate-50 hover:bg-teal-50/10 transition-colors group whitespace-nowrap">
                      <TableCell className="pl-8 py-5">
                         <div className="flex flex-col">
                            <span className="font-bold text-slate-800 text-base">{report.project}</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">MDR Record {report.id}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-[#1a4d4a] bg-teal-50 px-2 py-1 rounded truncate max-w-[150px]">{report.drawing}</span>
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center gap-2">
                            <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                               {report.inspector.substring(0, 2).toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-600">{report.inspector}</span>
                         </div>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-400 font-mono italic">{report.date}</TableCell>
                      <TableCell className="text-center">
                        <Badge className={`rounded-full px-5 py-1 text-[10px] font-black tracking-widest border-none shadow-md ${
                           report.status === "PASS" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                        }`}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex justify-end gap-2">
                          {report.evidence && (
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all cursor-pointer">
                              <Camera className="h-4 w-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-teal-600 font-bold bg-teal-50/50 hover:bg-teal-50 active:scale-95 transition-all text-xs border border-teal-100/50 hover:border-teal-200">
                            Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-4 p-4">
              {mockReports.map((report) => (
                <Card key={report.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-4">
                      <div className="min-w-0 pr-2">
                         <div className="flex items-center gap-2 mb-1">
                           <span className="text-[10px] font-mono font-black text-teal-600 bg-teal-50 px-2 py-0.5 rounded uppercase">MDR-{report.id}</span>
                           <Badge className={`rounded-full px-2 py-0.5 text-[9px] font-bold border-none ${
                             report.status === "PASS" ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                           }`}>
                             {report.status}
                           </Badge>
                         </div>
                         <h3 className="text-base font-black text-slate-800 leading-tight truncate">{report.project}</h3>
                         <p className="text-[10px] font-bold text-teal-600 uppercase tracking-tight mt-1 truncate">{report.drawing}</p>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-slate-50 text-slate-400 shrink-0">
                         <FileText className="h-3.5 w-3.5" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 mb-4">
                       <div>
                          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">QC Authority</p>
                          <div className="flex items-center gap-2">
                             <div className="h-5 w-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-black text-slate-500">
                                {report.inspector.substring(0, 2).toUpperCase()}
                             </div>
                             <p className="text-xs font-bold text-slate-600 truncate">{report.inspector}</p>
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-1">Entry Date</p>
                          <p className="text-xs font-bold text-slate-700 font-mono italic">{report.date}</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                       <div className="flex items-center gap-2">
                          {report.evidence ? (
                            <Badge className="bg-blue-50 text-blue-600 font-black text-[9px] border-none px-2 py-0.5 flex items-center gap-1">
                              <Camera className="h-2.5 w-2.5" /> ATTACHED
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-50 text-slate-400 font-bold text-[9px] border-none px-2 py-0.5 italic">NO EVIDENCE</Badge>
                          )}
                       </div>
                       <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-teal-600 font-bold bg-teal-50/50 hover:bg-teal-50 gap-2 active:scale-95 transition-all text-[11px]">
                          View Full Record
                       </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
         </CardContent>
      </Card>
    </main>
  )
}
