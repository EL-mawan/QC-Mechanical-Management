"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, Upload, FileSpreadsheet, CheckCircle2, AlertCircle, X } from "lucide-react"
import { toast } from "sonner"
import { uploadMaterialExcel } from "@/app/actions/master-actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import * as XLSX from 'xlsx'

interface UploadMaterialExcelModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function UploadMaterialExcelModal({ open, onOpenChange, onSuccess }: UploadMaterialExcelModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewData, setPreviewData] = useState<any[]>([])
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validate file type
    if (!selectedFile.name.match(/\.(xlsx|xls)$/)) {
      toast.error("Invalid file type", { description: "Please upload an Excel file (.xlsx or .xls)" })
      return
    }

    setFile(selectedFile)
    setValidationErrors([])

    // Read and preview Excel file
    try {
      const data = await selectedFile.arrayBuffer()
      const workbook = XLSX.read(data)
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)

      // Validate and map data
      const errors: string[] = []
      const mappedData = jsonData.map((row: any, index) => {
        // Expected columns based on Markmas format
        const material = {
          name: row['Material Description'] || row['Description'] || row['Item'] || '',
          specification: row['Specification'] || row['Spec'] || row['Grade'] || row['MAT_SPEC_MEMBER_REF_NO'] || '',
          heatNumber: row['Heat Number'] || row['Heat No'] || row['Heat'] || '',
          quantity: parseFloat(row['Quantity'] || row['Qty'] || row['QTY_MARK'] || '0'),
          unit: row['Unit'] || row['UOM'] || 'pcs',
          
          // Markmas Extended Fields
          dwgNo: row['DWG_NO'] || row['Drawing No'] || '',
          itemNo: row['ITEM_NO'] || row['Item No'] || '',
          markNo: row['MARK_NO'] || row['Mark No'] || '',
          markSpec: row['MARK_SPEC'] || row['Mark Spec'] || '',
          matSpecMemberRefNo: row['MAT_SPEC_MEMBER_REF_NO'] || row['Material Spec'] || '',
          qtyMark: parseFloat(row['QTY_MARK'] || row['Qty Mark'] || '0') || null,
          maxLength: parseFloat(row['MAX_LENGTH'] || row['Max Length'] || '0') || null,
          maxWidth: parseFloat(row['MAX_WIDTH'] || row['Max Width'] || '0') || null,
          maxHeight: parseFloat(row['MAX_HEIGHT'] || row['Max Height'] || '0') || null,
          tWeight: parseFloat(row['T_WEIGHT'] || row['Total Weight'] || row['Weight'] || '0') || null,
          tArea: parseFloat(row['T_AREA'] || row['Total Area'] || row['Area'] || '0') || null,
          remark: row['REMARK'] || row['Remark'] || row['Remarks'] || '',
          countNo: row['COUNT_NO'] || row['Count No'] || '',
          diInch: row['DI_INCH'] || row['Diameter'] || '',
          eDwg: row['E_DWG'] || row['Engineering Drawing'] || '',
          paintSys: row['PAINT_SYS'] || row['Paint System'] || '',
          assyMark: row['ASSY_MARK'] || row['Assembly Mark'] || '',
        }

        // Validate required fields
        if (!material.markNo && !material.name) {
          errors.push(`Row ${index + 2}: Missing MARK_NO or material description`)
        }
        if (material.quantity <= 0) {
          errors.push(`Row ${index + 2}: Invalid quantity`)
        }

        return material
      })

      setPreviewData(mappedData.slice(0, 10)) // Show first 10 rows
      setValidationErrors(errors)

      if (errors.length > 0) {
        toast.warning("Validation issues found", { 
          description: `${errors.length} issue(s) detected. Please review.` 
        })
      } else {
        toast.success("File validated", { 
          description: `${mappedData.length} materials ready to import` 
        })
      }
    } catch (error) {
      console.error("Error reading Excel file:", error)
      toast.error("Failed to read Excel file", { 
        description: "Please check the file format" 
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!file) {
      toast.error("No file selected")
      return
    }

    if (validationErrors.length > 0) {
      toast.error("Please fix validation errors first")
      return
    }

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const result = await uploadMaterialExcel(formData)

      if (result.success) {
        toast.success(result.message || "Materials imported successfully", {
          description: `${result.count || 0} materials added to inventory`
        })
        onSuccess()
        onOpenChange(false)
        resetForm()
      } else {
        toast.error(result.message || "Failed to import materials")
      }
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setFile(null)
    setPreviewData([])
    setValidationErrors([])
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      onOpenChange(isOpen)
      if (!isOpen) resetForm()
    }}>
      <DialogContent className="rounded-3xl border-none shadow-2xl p-0 overflow-hidden bg-white max-w-5xl max-h-[90vh] flex flex-col">
        <div className="bg-linear-to-br from-[#1a4d4a] to-teal-700 p-8 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
           <div className="bg-white/10 p-3 rounded-2xl w-fit mb-4 relative z-10">
              <FileSpreadsheet className="h-6 w-6" />
           </div>
           <DialogTitle className="text-2xl font-black tracking-tight relative z-10">Upload Material Excel</DialogTitle>
           <p className="text-teal-100/80 text-sm font-medium mt-2 relative z-10">Import Markmas (Material Master) data from Excel spreadsheet</p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex-1 overflow-hidden flex flex-col">
           <div className="p-8 space-y-6 flex-1 overflow-y-auto">
              <div className="space-y-3">
                 <Label className="text-xs font-black uppercase text-slate-500">Excel File (.xlsx, .xls)</Label>
                 <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-teal-400 transition-colors bg-slate-50/50">
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="hidden"
                      id="excel-upload"
                    />
                    <label 
                      htmlFor="excel-upload" 
                      className="flex flex-col items-center justify-center cursor-pointer"
                    >
                      <Upload className="h-12 w-12 text-teal-600 mb-4" />
                      <p className="text-sm font-bold text-slate-700 mb-1">
                        {file ? file.name : "Click to upload or drag and drop"}
                      </p>
                      <p className="text-xs text-slate-400 font-medium">
                        Excel files only (MAX. 10MB)
                      </p>
                    </label>
                 </div>
              </div>

              {validationErrors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-bold text-red-900 text-sm mb-2">Validation Errors</h4>
                      <ul className="space-y-1 text-xs text-red-700">
                        {validationErrors.slice(0, 5).map((error, idx) => (
                          <li key={idx}>• {error}</li>
                        ))}
                        {validationErrors.length > 5 && (
                          <li className="font-bold">... and {validationErrors.length - 5} more</li>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {previewData.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-black uppercase text-slate-500">Preview (First 10 rows)</Label>
                    <Badge className="bg-teal-100 text-teal-700 border-none font-bold">
                      {previewData.length} rows shown
                    </Badge>
                  </div>
                  <div className="border border-slate-200 rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto max-h-96">
                      <Table>
                        <TableHeader className="bg-slate-50 sticky top-0">
                          <TableRow>
                            <TableHead className="font-black text-[10px] uppercase">Material</TableHead>
                            <TableHead className="font-black text-[10px] uppercase">Spec</TableHead>
                            <TableHead className="font-black text-[10px] uppercase">Heat No</TableHead>
                            <TableHead className="font-black text-[10px] uppercase text-right">Qty</TableHead>
                            <TableHead className="font-black text-[10px] uppercase">Unit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {previewData.map((item, idx) => (
                            <TableRow key={idx} className="hover:bg-teal-50/30">
                              <TableCell className="font-medium text-xs">{item.name}</TableCell>
                              <TableCell className="text-xs">{item.specification}</TableCell>
                              <TableCell className="font-mono text-xs">{item.heatNumber}</TableCell>
                              <TableCell className="text-right font-bold text-xs">{item.quantity}</TableCell>
                              <TableCell className="text-xs">{item.unit}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 text-sm mb-2">Expected Excel Columns</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-blue-700">
                      <div>• Material Description</div>
                      <div>• Specification</div>
                      <div>• Heat Number</div>
                      <div>• Quantity</div>
                      <div>• Unit</div>
                      <div>• Size (optional)</div>
                    </div>
                  </div>
                </div>
              </div>
           </div>

           <DialogFooter className="p-6 border-t border-slate-100 bg-slate-50/50">
             <Button 
               type="button" 
               variant="ghost" 
               onClick={() => onOpenChange(false)} 
               className="rounded-2xl h-12 px-6 font-bold text-slate-500"
             >
               Cancel
             </Button>
             <Button 
               type="submit" 
               disabled={isSubmitting || !file || validationErrors.length > 0} 
               className="bg-teal-600 hover:bg-teal-700 rounded-2xl h-12 px-8 font-black shadow-lg shadow-teal-600/20 text-white"
             >
               {isSubmitting ? (
                 <>
                   <Loader2 className="h-4 w-4 animate-spin mr-2" />
                   Importing...
                 </>
               ) : (
                 <>
                   <Upload className="h-4 w-4 mr-2" />
                   Import Materials
                 </>
               )}
             </Button>
           </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
