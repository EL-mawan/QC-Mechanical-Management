"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

// ==================== PROJECTS ====================
export async function getProjects() {
  try {
    return await db.project.findMany({
      include: { client: true, _count: { select: { reports: true } } },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return []
  }
}

export async function createProject(data: any) {
  try {
    const project = await db.project.create({ data })
    revalidatePath("/dashboard/master/projects")
    return { 
      success: true, 
      message: `✓ Project "${project.name}" berhasil diluncurkan`,
      data: project 
    }
  } catch (error: any) {
    console.error("Error creating project:", error)
    return { 
      success: false, 
      message: `✗ Gagal membuat project: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateProject(id: string, data: any) {
  try {
    const project = await db.project.update({ where: { id }, data })
    revalidatePath("/dashboard/master/projects")
    return { 
      success: true, 
      message: `✓ Project "${project.name}" berhasil diupdate`,
      data: project 
    }
  } catch (error: any) {
    console.error("Error updating project:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate project: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteProject(id: string) {
  try {
    const project = await db.project.findUnique({ where: { id } })
    if (!project) {
      return { success: false, message: "✗ Project tidak ditemukan" }
    }
    
    await db.project.delete({ where: { id } })
    revalidatePath("/dashboard/master/projects")
    return { 
      success: true, 
      message: `✓ Project "${project.name}" berhasil dihapus dari sistem` 
    }
  } catch (error: any) {
    console.error("Error deleting project:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus project. Project mungkin masih memiliki data terkait." 
    }
  }
}

// ==================== WELDERS ====================
export async function getWelders() {
  try {
    return await db.welder.findMany({ orderBy: { performance: "desc" } })
  } catch (error) {
    console.error("Error fetching welders:", error)
    return []
  }
}

export async function createWelder(data: any) {
  try {
    const welder = await db.welder.create({ data })
    revalidatePath("/dashboard/master/welders")
    return { 
      success: true, 
      message: `✓ Welder "${welder.name}" berhasil terdaftar dengan ID ${welder.idNumber}`,
      data: welder 
    }
  } catch (error: any) {
    console.error("Error creating welder:", error)
    return { 
      success: false, 
      message: `✗ Gagal mendaftarkan welder: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateWelder(id: string, data: any) {
  try {
    const welder = await db.welder.update({ where: { id }, data })
    revalidatePath("/dashboard/master/welders")
    return { 
      success: true, 
      message: `✓ Data welder "${welder.name}" berhasil diupdate`,
      data: welder 
    }
  } catch (error: any) {
    console.error("Error updating welder:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate welder: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteWelder(id: string) {
  try {
    const welder = await db.welder.findUnique({ where: { id } })
    if (!welder) {
      return { success: false, message: "✗ Welder tidak ditemukan" }
    }
    
    await db.welder.delete({ where: { id } })
    revalidatePath("/dashboard/master/welders")
    return { 
      success: true, 
      message: `✓ Welder "${welder.name}" berhasil dihapus dari registry` 
    }
  } catch (error: any) {
    console.error("Error deleting welder:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus welder. Welder mungkin masih memiliki weld log aktif." 
    }
  }
}

// ==================== MATERIALS ====================
export async function getMaterials() {
  try {
    return await db.material.findMany({ orderBy: { createdAt: "desc" } })
  } catch (error) {
    console.error("Error fetching materials:", error)
    return []
  }
}

export async function createMaterial(data: any) {
  try {
    const material = await db.material.create({ data })
    revalidatePath("/dashboard/master/materials")
    return { 
      success: true, 
      message: `✓ Material "${material.name}" berhasil dicatat (${material.quantity} ${material.unit})`,
      data: material 
    }
  } catch (error: any) {
    console.error("Error creating material:", error)
    return { 
      success: false, 
      message: `✗ Gagal mencatat material: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateMaterial(id: string, data: any) {
  try {
    const material = await db.material.update({ where: { id }, data })
    revalidatePath("/dashboard/master/materials")
    return { 
      success: true, 
      message: `✓ Material "${material.name}" berhasil diupdate`,
      data: material 
    }
  } catch (error: any) {
    console.error("Error updating material:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate material: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteMaterial(id: string) {
  try {
    const material = await db.material.findUnique({ where: { id } })
    if (!material) {
      return { success: false, message: "✗ Material tidak ditemukan" }
    }
    
    await db.material.delete({ where: { id } })
    revalidatePath("/dashboard/master/materials")
    return { 
      success: true, 
      message: `✓ Material "${material.name}" berhasil dihapus dari inventory` 
    }
  } catch (error: any) {
    console.error("Error deleting material:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus material dari inventory." 
    }
  }
}

export async function uploadMaterialExcel(formData: FormData) {
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, message: "✗ No file provided" }
    }

    // Read file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Import XLSX dynamically (server-side)
    const XLSX = await import('xlsx')
    const workbook = XLSX.read(buffer, { type: 'buffer' })
    const worksheet = workbook.Sheets[workbook.SheetNames[0]]
    const jsonData = XLSX.utils.sheet_to_json(worksheet)

    if (!jsonData || jsonData.length === 0) {
      return { success: false, message: "✗ Excel file is empty" }
    }

    // Map and validate data
    const materials = jsonData.map((row: any) => {
      return {
        name: row['Material Description'] || row['Description'] || row['Item'] || row['MARK_SPEC'] || '',
        specification: row['Specification'] || row['Spec'] || row['Grade'] || row['MAT_SPEC_MEMBER_REF_NO'] || '',
        heatNumber: row['Heat Number'] || row['Heat No'] || row['Heat'] || row['MARK_NO'] || '',
        quantity: parseFloat(row['Quantity'] || row['Qty'] || row['QTY_MARK'] || '0'),
        unit: row['Unit'] || row['UOM'] || 'pcs',
        status: 'RECEIVED',
        mtcReceived: true,
        
        // Markmas Extended Fields
        dwgNo: row['DWG_NO'] || row['Drawing No'] || null,
        itemNo: row['ITEM_NO'] || row['Item No'] || null,
        markNo: row['MARK_NO'] || row['Mark No'] || null,
        markSpec: row['MARK_SPEC'] || row['Mark Spec'] || null,
        matSpecMemberRefNo: row['MAT_SPEC_MEMBER_REF_NO'] || row['Material Spec'] || null,
        qtyMark: parseFloat(row['QTY_MARK'] || row['Qty Mark'] || '0') || null,
        maxLength: parseFloat(row['MAX_LENGTH'] || row['Max Length'] || '0') || null,
        maxWidth: parseFloat(row['MAX_WIDTH'] || row['Max Width'] || '0') || null,
        maxHeight: parseFloat(row['MAX_HEIGHT'] || row['Max Height'] || '0') || null,
        tWeight: parseFloat(row['T_WEIGHT'] || row['Total Weight'] || row['Weight'] || '0') || null,
        tArea: parseFloat(row['T_AREA'] || row['Total Area'] || row['Area'] || '0') || null,
        remark: row['REMARK'] || row['Remark'] || row['Remarks'] || null,
        countNo: row['COUNT_NO'] || row['Count No'] || null,
        diInch: row['DI_INCH'] || row['Diameter'] || null,
        eDwg: row['E_DWG'] || row['Engineering Drawing'] || null,
        paintSys: row['PAINT_SYS'] || row['Paint System'] || null,
        assyMark: row['ASSY_MARK'] || row['Assembly Mark'] || null,
      }
    }).filter((m: any) => (m.markNo || m.name) && m.quantity > 0)

    if (materials.length === 0) {
      return { 
        success: false, 
        message: "✗ No valid materials found in Excel file" 
      }
    }

    // Batch insert materials to avoid timeout
    let successCount = 0
    let failureCount = 0
    const BATCH_SIZE = 50 // Process 50 records at a time
    
    // Split into batches
    for (let i = 0; i < materials.length; i += BATCH_SIZE) {
      const batch = materials.slice(i, i + BATCH_SIZE);
      
      // Process batch in parallel
      const results = await Promise.all(
        batch.map(async (material) => {
          try {
            await db.material.create({ data: material as any })
            return true
          } catch (error: any) {
            // Check for specific database errors
            if (error.code === 'SQLITE_READONLY' || error.message?.includes('readonly')) {
              throw new Error("Database is in READ-ONLY mode. Please update your Turso token with write permissions.")
            }
            // Skip duplicates (P2002) or other validation errors
            // console.log(`Skipped material: ${material.name} - ${error.message}`)
            return false
          }
        })
      )
      
      successCount += results.filter(Boolean).length
      failureCount += results.length - results.filter(Boolean).length
    }

    if (successCount === 0) {
      if (failureCount > 0) {
        return {
          success: false,
          message: "✗ No materials imported. They might already exist or data is invalid."
        }
      }
      return {
        success: false,
        message: "✗ No valid materials to import"
      }
    }

    revalidatePath("/dashboard/master/materials")
    
    return { 
      success: true, 
      message: `✓ Successfully imported ${successCount} materials` + (failureCount > 0 ? ` (${failureCount} skipped)` : ""),
      count: successCount
    }
  } catch (error: any) {
    console.error("Error uploading material Excel:", error)
    return { 
      success: false, 
      message: `✗ Failed to import materials: ${error.message || 'Unknown error'}` 
    }
  }
}


// ==================== WPS ====================
export async function getWPS() {
  try {
    return await db.wPS.findMany({ orderBy: { number: "asc" } })
  } catch (error) {
    console.error("Error fetching WPS:", error)
    return []
  }
}

export async function createWPS(data: any) {
  try {
    const wps = await db.wPS.create({ data })
    revalidatePath("/dashboard/master/wps")
    return { 
      success: true, 
      message: `✓ WPS "${wps.number}" berhasil didaftarkan`,
      data: wps 
    }
  } catch (error: any) {
    console.error("Error creating WPS:", error)
    return { 
      success: false, 
      message: `✗ Gagal mendaftarkan WPS: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateWPS(id: string, data: any) {
  try {
    const wps = await db.wPS.update({ where: { id }, data })
    revalidatePath("/dashboard/master/wps")
    return { 
      success: true, 
      message: `✓ WPS "${wps.number}" berhasil diupdate`,
      data: wps 
    }
  } catch (error: any) {
    console.error("Error updating WPS:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate WPS: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteWPS(id: string) {
  try {
    const wps = await db.wPS.findUnique({ where: { id } })
    if (!wps) {
      return { success: false, message: "✗ WPS tidak ditemukan" }
    }
    
    await db.wPS.delete({ where: { id } })
    revalidatePath("/dashboard/master/wps")
    return { 
      success: true, 
      message: `✓ WPS "${wps.number}" berhasil dihapus` 
    }
  } catch (error: any) {
    console.error("Error deleting WPS:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus WPS. WPS mungkin masih digunakan di weld log." 
    }
  }
}

// ==================== DRAWINGS ====================
export async function getDrawings() {
  try {
    return await db.drawing.findMany({ 
      include: { project: true }, 
      orderBy: { createdAt: "desc" } 
    })
  } catch (error) {
    console.error("Error fetching drawings:", error)
    return []
  }
}

export async function createDrawing(data: any) {
  try {
    const drawing = await db.drawing.create({ data })
    revalidatePath("/dashboard/master/drawings")
    return { 
      success: true, 
      message: `✓ Drawing "${drawing.number}" berhasil diupload`,
      data: drawing 
    }
  } catch (error: any) {
    console.error("Error creating drawing:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupload drawing: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateDrawing(id: string, data: any) {
  try {
    const drawing = await db.drawing.update({ where: { id }, data })
    revalidatePath("/dashboard/master/drawings")
    return { 
      success: true, 
      message: `✓ Drawing "${drawing.number}" berhasil diupdate`,
      data: drawing 
    }
  } catch (error: any) {
    console.error("Error updating drawing:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate drawing: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteDrawing(id: string) {
  try {
    const drawing = await db.drawing.findUnique({ where: { id } })
    if (!drawing) {
      return { success: false, message: "✗ Drawing tidak ditemukan" }
    }
    
    await db.drawing.delete({ where: { id } })
    revalidatePath("/dashboard/master/drawings")
    return { 
      success: true, 
      message: `✓ Drawing "${drawing.number}" berhasil dihapus` 
    }
  } catch (error: any) {
    console.error("Error deleting drawing:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus drawing." 
    }
  }
}

// ==================== MDR REPORTS ====================
export async function getMDRReports(type?: string) {
  try {
    return await db.mDRReport.findMany({
      where: type ? { type } : {},
      include: { 
        project: true, 
        inspector: { select: { name: true, email: true } }, 
        material: true,
        drawing: true
      },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching MDR reports:", error)
    return []
  }
}

export async function createMDRReport(data: any) {
  try {
    const report = await db.mDRReport.create({ data })
    revalidatePath("/dashboard/mdr")
    revalidatePath("/dashboard/mdr/incoming")
    revalidatePath("/dashboard/mdr/cutting")
    revalidatePath("/dashboard/mdr/welding")
    revalidatePath("/dashboard/mdr/ndt")
    revalidatePath("/dashboard/mdr/final")
    return { 
      success: true, 
      message: `✓ MDR Report berhasil dicatat`,
      data: report 
    }
  } catch (error: any) {
    console.error("Error creating MDR report:", error)
    return { 
      success: false, 
      message: `✗ Gagal mencatat MDR report: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateMDRReport(id: string, data: any) {
  try {
    const report = await db.mDRReport.update({ where: { id }, data })
    revalidatePath("/dashboard/mdr")
    return { 
      success: true, 
      message: `✓ MDR Report berhasil diupdate`,
      data: report 
    }
  } catch (error: any) {
    console.error("Error updating MDR report:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate MDR report: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteMDRReport(id: string) {
  try {
    const report = await db.mDRReport.findUnique({ where: { id } })
    if (!report) {
      return { success: false, message: "✗ MDR Report tidak ditemukan" }
    }
    
    await db.mDRReport.delete({ where: { id } })
    revalidatePath("/dashboard/mdr")
    return { 
      success: true, 
      message: `✓ MDR Report berhasil dihapus` 
    }
  } catch (error: any) {
    console.error("Error deleting MDR report:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus MDR report." 
    }
  }
}
// ==================== USERS / INSPECTORS ====================
export async function getInspectors() {
  try {
    return await db.user.findMany({
      where: {
        role: {
          name: { contains: "Inspector" }
        }
      },
      include: { role: true },
      orderBy: { name: "asc" }
    })
  } catch (error) {
    console.error("Error fetching inspectors:", error)
    return []
  }
}

export async function createInspector(data: any) {
  try {
    // Find inspector role
    const role = await db.role.findFirst({
      where: { name: { contains: "Inspector" } }
    })

    if (!role) {
      return { success: false, message: "✗ Inspector role not found in system" }
    }

    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: "password", // Default password
        roleId: role.id
      }
    })

    revalidatePath("/dashboard/master/inspectors")
    return {
      success: true,
      message: `✓ Inspector "${user.name}" invited successfully`,
      data: user
    }
  } catch (error: any) {
    console.error("Error creating inspector:", error)
    if (error.code === 'P2002') {
      return { success: false, message: "✗ Email already registered" }
    }
    return {
      success: false,
      message: `✗ Failed to invite inspector: ${error.message || 'Database error'}`
    }
  }
}

export async function updateInspector(id: string, data: any) {
  try {
    // Note: This updates the user record. roleName is used to find/create role if needed
    // For now we assume the role exists or we just update the basic info.
    const user = await db.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        // Optional: Update role if roleName provided and different
      }
    })
    revalidatePath("/dashboard/master/inspectors")
    return {
      success: true,
      message: `✓ Inspector "${user.name}" updated successfully`,
      data: user
    }
  } catch (error: any) {
    console.error("Error updating inspector:", error)
    return {
      success: false,
      message: `✗ Failed to update inspector: ${error.message || 'Database error'}`
    }
  }
}

export async function deleteInspector(id: string) {
  try {
    const user = await db.user.findUnique({ where: { id } })
    if (!user) {
      return { success: false, message: "✗ Inspector not found" }
    }
    
    await db.user.delete({ where: { id } })
    revalidatePath("/dashboard/master/inspectors")
    return {
      success: true,
      message: `✓ Inspector "${user.name}" removed from system`
    }
  } catch (error: any) {
    console.error("Error deleting inspector:", error)
    return {
      success: false,
      message: "✗ Failed to remove inspector. User may have associated reports or inspections."
    }
  }
}
