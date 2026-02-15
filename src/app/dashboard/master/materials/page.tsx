"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Box, Tag, FileText, Warehouse, Loader2, Scale, Maximize, MoreVertical, Edit2, Trash2, FileUp, Filter, Download } from "lucide-react"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { Input } from "@/components/ui/input"
import { getMaterials, createMaterial, deleteMaterial } from "@/app/actions/master-actions"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { EditMaterialModal } from "@/components/modals/EditMaterialModal"
import { UploadMaterialExcelModal } from "@/components/modals/UploadMaterialExcelModal"
import { toast } from "sonner"
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null)
  const [materialToDelete, setMaterialToDelete] = useState<{ id: string, name: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRows, setFilterRows] = useState([{ dwgNo: "", markNo: "", markSpec: "" }])
  const [showFilters, setShowFilters] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    specification: "",
    heatNumber: "",
    quantity: 0,
    unit: "pcs"
  })

  const loadMaterials = async () => {
    setIsLoading(true)
    const data = await getMaterials()
    setMaterials(data)
    setIsLoading(false)
  }

  useEffect(() => {
    loadMaterials()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await createMaterial(formData)
    if (res.success) {
      toast.success("Material stock updated")
      setShowAddModal(false)
      loadMaterials()
      setFormData({ name: "", specification: "", heatNumber: "", quantity: 0, unit: "pcs" })
    }
    setIsSubmitting(false)
  }

  const handleEdit = (material: any) => {
    setSelectedMaterial(material)
    setShowEditModal(true)
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF("l", "mm", "a4")
    
    // Header
    doc.setFontSize(20)
    doc.setTextColor(26, 77, 74) // #1a4d4a
    doc.text("Material Inventory Report", 14, 15)
    
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22)
    doc.text(`Total Records: ${filteredMaterials.length}`, 14, 27)

    const totalWeight = filteredMaterials.reduce((acc, m) => acc + (m.tWeight || 0), 0) / 1000
    const totalArea = filteredMaterials.reduce((acc, m) => acc + (m.tArea || 0), 0)
    doc.text(`Total Weight: ${totalWeight.toFixed(2)} T`, 14, 32)
    doc.text(`Total Area: ${totalArea.toFixed(2)} m²`, 14, 37)

    const tableColumn = ["DWG_NO", "ITEM_NO", "MARK_NO", "MARK_SPEC", "MAT_SPEC", "QTY_MARK", "L / W / H (mm)", "T_WEIGHT (kg)", "T_AREA (m²)"]
    const tableRows = filteredMaterials.map(m => [
      m.dwgNo || "-",
      m.itemNo || "-",
      m.markNo || "-",
      m.markSpec || m.name || "-",
      m.matSpecMemberRefNo || m.specification || "-",
      m.qtyMark || m.quantity || "0",
      `${m.maxLength || "-"}/${m.maxWidth || "-"}/${m.maxHeight || "-"}`,
      m.tWeight?.toFixed(2) || "0.00",
      m.tArea?.toFixed(2) || "0.00"
    ])

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: 'grid',
      headStyles: { 
        fillColor: [26, 77, 74], 
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold'
      },
      styles: { fontSize: 7, cellPadding: 2 },
      columnStyles: {
        5: { halign: 'center' }, // QTY_MARK
        6: { halign: 'center' }, // L/W/H
        7: { halign: 'right' },  // T_WEIGHT
        8: { halign: 'right' },  // T_AREA
      }
    })

    doc.save(`material_inventory_${new Date().getTime()}.pdf`)
    toast.success("PDF Report generated successfully")
  }

  const confirmDelete = async () => {
    if (!materialToDelete) return

    setIsSubmitting(true)
    try {
      const result = await deleteMaterial(materialToDelete.id)
      
      if (result.success) {
        toast.success("Berhasil Terhapus Permanen", { 
          description: `Data material "${materialToDelete.name}" telah dihapus selamanya dari database Turso.`,
          duration: 4000,
          className: "bg-red-50 border-red-200 text-red-800 font-bold shadow-lg"
        })
        loadMaterials()
      } else {
        toast.error("Gagal Menghapus Data", { 
          description: result.message || "Gagal menghubungi server database", 
          duration: 5000 
        })
      }
    } catch (error) {
      toast.error("Error Sistem", { description: "Terjadi kesalahan koneksi saat menghapus data." })
    } finally {
      setIsSubmitting(false)
      setMaterialToDelete(null)
    }
  }

  const handleDelete = (id: string, name: string) => {
    setMaterialToDelete({ id, name })
  }

  // Filtered materials based on search and filters
  const filteredMaterials = materials.filter(m => {
    const matchesSearch = searchTerm === "" || 
      m.markNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.dwgNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.itemNo?.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Check if item matches any of the filter rows
    // An item matches a row if it matches all non-empty fields in that row
    const activeRows = filterRows.filter(row => row.dwgNo || row.markNo || row.markSpec)
    
    if (activeRows.length === 0) return matchesSearch

    const matchesAnyRow = activeRows.some(row => {
      const rowDwgMatch = !row.dwgNo || m.dwgNo?.toLowerCase().includes(row.dwgNo.toLowerCase())
      const rowMarkNoMatch = !row.markNo || m.markNo?.toLowerCase().includes(row.markNo.toLowerCase())
      const rowMarkSpecMatch = !row.markSpec || m.markSpec?.toLowerCase().includes(row.markSpec.toLowerCase())
      return rowDwgMatch && rowMarkNoMatch && rowMarkSpecMatch
    })
    
    return matchesSearch && matchesAnyRow
  })

  return (
    <main className="flex-1 p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div className="flex items-center gap-4">
               <div className="bg-[#1a4d4a] p-3 rounded-2xl shadow-xl shadow-teal-900/10 text-white">
                  <Warehouse className="h-7 w-7" />
               </div>
               <div>
                  <h1 className="text-3xl font-black text-[#1a4d4a] tracking-tight">Material Inventory</h1>
                  <p className="text-muted-foreground text-sm font-medium">Traceable stock management for MDR compliance</p>
               </div>
             </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleDownloadPDF}
                  variant="outline"
                  className="rounded-2xl px-6 h-12 flex items-center gap-2 border-slate-200 shadow-sm font-bold text-slate-600 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Download className="h-5 w-5" /> Download PDF
                </Button>
                <Button 
                  onClick={() => setShowUploadModal(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 rounded-2xl px-6 h-12 flex items-center gap-2 shadow-xl shadow-emerald-600/20 font-bold transition-all transform hover:scale-105 cursor-pointer"
                >
                  <FileUp className="h-5 w-5" /> Upload Excel
                </Button>
              </div>
           </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
             <MetricCard label="Stock Categories" value={filteredMaterials.length.toString()} icon={Tag} color="text-teal-600" bg="bg-teal-50" />
             <MetricCard label="Total Units" value={filteredMaterials.reduce((acc, m) => acc + (m.qtyMark || m.quantity || 0), 0).toString()} icon={Box} color="bg-blue-600" bg="bg-blue-50" />
             <MetricCard 
               label="Total Weight" 
               value={`${(filteredMaterials.reduce((acc, m) => acc + (m.tWeight || 0), 0) / 1000).toFixed(2)} T`} 
               icon={Scale} 
               color="text-emerald-600" 
               bg="bg-emerald-50" 
             />
             <MetricCard 
               label="Total Area" 
               value={`${filteredMaterials.reduce((acc, m) => acc + (m.tArea || 0), 0).toFixed(2)} m²`} 
               icon={Maximize} 
               color="text-amber-600" 
               bg="bg-amber-50" 
             />
          </div>

          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white/70 backdrop-blur-md">
             <CardHeader className="p-8 border-b border-slate-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <CardTitle className="text-xl font-black text-slate-800">Warehouse Directory</CardTitle>
                <div className="flex items-center gap-3 w-full md:w-auto">
                   <div className="relative w-full md:w-80">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input 
                        placeholder="Search Mark No or Item..." 
                        className="pl-11 h-12 rounded-2xl border-slate-100 bg-slate-50/50" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                   </div>
                   <Button 
                      variant="outline" 
                      onClick={() => setShowFilters(!showFilters)}
                      className={`h-12 rounded-2xl border-slate-100 gap-2 font-bold px-6 cursor-pointer ${showFilters ? 'bg-teal-50 text-teal-600 border-teal-200' : 'bg-white'}`}
                   >
                      <Filter className="h-4 w-4" />
                      Filter
                   </Button>
                </div>
             </CardHeader>
             
             {showFilters && (
                <div className="border-b border-slate-50 bg-slate-50/30">
                  {filterRows.map((row, index) => (
                    <div key={index} className={`px-8 pb-4 pt-4 grid grid-cols-1 md:grid-cols-4 gap-4 ${index > 0 ? 'border-t border-slate-100/50' : 'pt-2'}`}>
                      <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Drawing No (DWG_NO)</Label>
                          <Input 
                            placeholder="Dwg No..." 
                            className="h-10 rounded-xl border-slate-100 bg-white font-medium shadow-sm focus:ring-teal-500/20" 
                            value={row.dwgNo}
                            onChange={(e) => {
                              const newRows = [...filterRows]
                              newRows[index].dwgNo = e.target.value
                              setFilterRows(newRows)
                            }}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Mark Number (MARK_NO)</Label>
                          <Input 
                            placeholder="Mark No..." 
                            className="h-10 rounded-xl border-slate-100 bg-white font-medium shadow-sm focus:ring-teal-500/20" 
                            value={row.markNo}
                            onChange={(e) => {
                              const newRows = [...filterRows]
                              newRows[index].markNo = e.target.value
                              setFilterRows(newRows)
                            }}
                          />
                      </div>
                      <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-slate-400 pl-1">Mark Specification (MARK_SPEC)</Label>
                          <Input 
                            placeholder="Mark Spec..." 
                            className="h-10 rounded-xl border-slate-100 bg-white font-medium shadow-sm focus:ring-teal-500/20" 
                            value={row.markSpec}
                            onChange={(e) => {
                              const newRows = [...filterRows]
                              newRows[index].markSpec = e.target.value
                              setFilterRows(newRows)
                            }}
                          />
                      </div>
                      <div className="flex items-end gap-2">
                        {index === 0 ? (
                          <>
                            <Button 
                              variant="ghost" 
                              className="h-10 flex-1 rounded-xl text-slate-400 font-bold hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                              onClick={() => {
                                setFilterRows([{ dwgNo: "", markNo: "", markSpec: "" }])
                                setSearchTerm("")
                              }}
                            >
                               Reset
                            </Button>
                            <Button 
                              variant="outline" 
                              className="h-10 flex-1 rounded-xl font-bold gap-2 border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-600 hover:border-teal-200 cursor-pointer transition-all active:scale-95"
                              onClick={() => setFilterRows([...filterRows, { dwgNo: "", markNo: "", markSpec: "" }])}
                            >
                               <Plus className="h-3.5 w-3.5" />
                               Add Filter
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost" 
                            className="h-10 w-full rounded-xl text-slate-300 font-bold hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                            onClick={() => {
                              const newRows = [...filterRows]
                              newRows.splice(index, 1)
                              setFilterRows(newRows)
                            }}
                          >
                             Remove Row
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
             )}

             <CardContent className="p-0">
                {isLoading ? (
                  <div className="py-24 flex flex-col items-center gap-4">
                     <Loader2 className="h-10 w-10 text-teal-600 animate-spin" />
                     <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Auditing Warehouse Assets...</p>
                  </div>
                ) : (
                  <>
                    {/* Desktop View */}
                    <div className="hidden md:block overflow-x-auto">
                      <Table>
                        <TableHeader className="bg-slate-50/50">
                          <TableRow className="border-none whitespace-nowrap">
                              <TableHead className="pl-10 h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">DWG_NO</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">ITEM_NO</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">MARK_NO</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">MARK_SPEC</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">MAT_SPEC</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-center">QTY_MARK</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-center">L / W / H (mm)</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-right">T_WEIGHT (kg)</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-right">T_AREA (m²)</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">E_DWG</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">REMARK</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest">PAINT_SYS</TableHead>
                              <TableHead className="h-14 font-black uppercase text-[10px] text-slate-400 tracking-widest text-right pr-12">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredMaterials.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={13} className="h-32 text-center text-slate-400 font-medium">
                                No materials found matching your criteria.
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredMaterials.map((m) => (
                              <TableRow key={m.id} className="group border-b border-slate-50 hover:bg-teal-50/10 cursor-pointer whitespace-nowrap text-xs">
                                <TableCell className="pl-10 py-6 font-bold text-slate-600">
                                  {m.dwgNo || "-"}
                                </TableCell>
                                <TableCell className="font-medium text-slate-600">
                                  {m.itemNo || "-"}
                                </TableCell>
                                <TableCell className="py-6">
                                    <div className="flex flex-col">
                                      <span className="text-sm font-black text-slate-800 group-hover:text-teal-700 transition-colors">{m.markNo || "-"}</span>
                                      {m.assyMark && <span className="text-[9px] font-bold text-teal-600/70">ASSY: {m.assyMark}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-600">
                                  {m.markSpec || m.name || "-"}
                                </TableCell>
                                <TableCell className="text-slate-600 max-w-[150px] truncate">
                                  {m.matSpecMemberRefNo || m.specification || "-"}
                                </TableCell>
                                <TableCell className="text-center font-black text-slate-800 text-sm">
                                  {m.qtyMark || m.quantity || "0"}
                                </TableCell>
                                <TableCell className="text-center font-mono text-slate-500">
                                  {m.maxLength || "-"}/{m.maxWidth || "-"}/{m.maxHeight || "-"}
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-700 text-sm">
                                  {m.tWeight?.toFixed(2) || "0.00"}
                                </TableCell>
                                <TableCell className="text-right font-bold text-slate-700 text-sm">
                                  {m.tArea?.toFixed(2) || "0.00"}
                                </TableCell>
                                <TableCell className="text-slate-600">
                                  {m.eDwg || "-"}
                                </TableCell>
                                <TableCell className="text-slate-500 max-w-[100px] truncate">
                                  {m.remark || "-"}
                                </TableCell>
                                <TableCell>
                                  <Badge className="bg-slate-100 text-slate-600 font-bold text-[9px] border-none px-2 py-0.5">
                                      {m.paintSys || "N/A"}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right pr-12">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-white text-slate-300 hover:text-teal-600 transition-all shadow-none hover:shadow-md cursor-pointer">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end" className="rounded-2xl border-none shadow-2xl p-2 bg-white ring-1 ring-slate-100">
                                        <DropdownMenuItem onClick={() => handleEdit(m)} className="rounded-xl flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-slate-600 focus:bg-teal-50 focus:text-teal-700 text-xs">
                                            <Edit2 className="h-4 w-4" /> Edit Mark
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleDelete(m.id, m.markNo || m.name)} className="rounded-xl flex items-center gap-3 px-4 py-2.5 cursor-pointer font-bold text-rose-600 focus:bg-rose-50 focus:text-rose-700 text-xs">
                                            <Trash2 className="h-4 w-4" /> Delete Mark
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Mobile View */}
                    <div className="md:hidden space-y-4 p-4">
                      {filteredMaterials.length === 0 ? (
                        <div className="py-12 text-center text-slate-400 font-medium">No materials found matching your criteria.</div>
                      ) : (
                        filteredMaterials.map((m) => (
                          <Card key={m.id} className="border border-slate-100 shadow-sm rounded-2xl overflow-hidden bg-white">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div className="min-w-0 flex-1 pr-2">
                                  <h3 className="font-black text-slate-800 text-base truncate">{m.markNo || m.name || "-"}</h3>
                                  <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest">{m.dwgNo || "No DWG"}</p>
                                </div>
                                <div className="flex gap-1">
                                  <Button onClick={() => handleEdit(m)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400">
                                    <Edit2 className="h-3.5 w-3.5" />
                                  </Button>
                                  <Button onClick={() => handleDelete(m.id, m.markNo || m.name)} variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-rose-400">
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-50 pt-3 mb-3">
                                <div>
                                  <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Quantity</p>
                                  <p className="text-xs font-bold text-slate-700">{m.qtyMark || m.quantity || "0"} {m.unit || 'pcs'}</p>
                                </div>
                                <div>
                                  <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Spec</p>
                                  <p className="text-xs font-bold text-slate-700 truncate">{m.markSpec || m.specification || "-"}</p>
                                </div>
                                <div>
                                  <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Weight (kg)</p>
                                  <p className="text-xs font-bold text-slate-700">{m.tWeight?.toFixed(2) || "0.00"}</p>
                                </div>
                                <div>
                                  <p className="text-[8px] uppercase font-black text-slate-400 tracking-widest mb-0.5">Dimensions</p>
                                  <p className="text-[10px] font-mono text-slate-500">{m.maxLength || "-"}/{m.maxWidth || "-"}/{m.maxHeight || "-"}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                                <Badge className="bg-slate-100 text-slate-600 font-bold text-[8px] border-none px-2 py-0.5">
                                  {m.paintSys || "No Paint Sys"}
                                </Badge>
                                <span className="text-[9px] font-bold text-slate-400 italic truncate max-w-[150px]">
                                  {m.remark || "No remarks"}
                                </span>
                              </div>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </>
                )}
             </CardContent>
          </Card>
          {selectedMaterial && (
            <EditMaterialModal 
              key={selectedMaterial.id}
              material={selectedMaterial} 
              open={showEditModal} 
              onOpenChange={setShowEditModal} 
              onSuccess={loadMaterials}
            />
          )}
          
          <UploadMaterialExcelModal 
            open={showUploadModal}
            onOpenChange={setShowUploadModal}
            onSuccess={loadMaterials}
          />

          <AlertDialog open={!!materialToDelete} onOpenChange={(open) => !open && setMaterialToDelete(null)}>
            <AlertDialogContent className="rounded-3xl border-none shadow-2xl bg-white/95 backdrop-blur-xl p-0 overflow-hidden">
              <div className="bg-rose-50 p-6 border-b border-rose-100 flex items-center gap-4">
                <div className="bg-rose-100 p-3 rounded-full">
                  <Trash2 className="h-6 w-6 text-rose-600" />
                </div>
                <div>
                  <AlertDialogTitle className="text-xl font-black text-rose-900">Hapus Permanen?</AlertDialogTitle>
                  <AlertDialogDescription className="text-rose-700 font-medium mt-1">
                    Konfirmasi penghapusan data material dari database.
                  </AlertDialogDescription>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-slate-600 font-medium mb-4">
                  Anda akan menghapus material <span className="font-black text-slate-800">"{materialToDelete?.name}"</span>.
                  <br />
                  Data yang dihapus <span className="text-rose-600 font-bold">TIDAK DAPAT</span> dikembalikan.
                </p>
                
                <AlertDialogFooter>
                  <AlertDialogCancel className="rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-600 h-11 px-6">
                    Batal
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.preventDefault()
                      confirmDelete()
                    }}
                    className="bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-lg shadow-rose-600/20 h-11 px-6 transition-transform hover:scale-105"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Menghapus...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Ya, Hapus Sekarang
                      </>
                    )}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </div>
            </AlertDialogContent>
          </AlertDialog>
    </main>
  )
}

function MetricCard({ label, value, icon: Icon, color, bg }) {
  return (
    <Card className="border-none shadow-sm rounded-2xl sm:rounded-3xl p-3 sm:p-6 bg-white flex items-center gap-3 sm:gap-5 group hover:shadow-lg transition-transform hover:-translate-y-2">
       <div className={`${bg} ${color} p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-inner transition-transform group-hover:scale-110`}>
          <Icon className="h-4 w-4 sm:h-6 sm:w-6" />
       </div>
       <div className="min-w-0">
          <p className="text-[8px] sm:text-[10px] uppercase font-black text-slate-400 tracking-widest leading-none mb-1 sm:mb-2 truncate">{label}</p>
          <p className="text-sm sm:text-xl font-black text-slate-800 tracking-tight truncate">{value}</p>
       </div>
    </Card>
  )
}


