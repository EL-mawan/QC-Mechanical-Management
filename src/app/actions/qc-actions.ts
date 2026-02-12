"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getITPs() {
  try {
    const itps = await db.iTP.findMany({
      include: {
        project: { select: { name: true } },
        assignee: { select: { name: true, email: true } },
        itpItems: { select: { id: true } }
      },
      orderBy: { createdAt: "desc" },
    })
    return itps
  } catch (error) {
    console.error("Error fetching ITPs:", error)
    return []
  }
}

export async function getITPById(id: string) {
  try {
    return await db.iTP.findUnique({
      where: { id },
      select: {
        id: true,
        projectId: true,
        title: true,
        description: true,
        assigneeId: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        project: { 
          select: { 
            id: true,
            name: true,
            location: true,
            client: { 
              select: { 
                id: true, 
                name: true 
              } 
            }
          }
        },
        itpItems: { 
          select: {
            id: true,
            stage: true,
            description: true,
            holdPoint: true,
            witnessPoint: true,
            approvalStatus: true,
            createdAt: true,
            evidence: {
              select: {
                id: true,
                fileName: true,
                fileType: true
              },
              take: 5 // Limit evidence per item for faster loading
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        assignee: { 
          select: { 
            id: true, 
            name: true, 
            email: true 
          } 
        },
        evidence: {
          select: {
            id: true,
            fileName: true,
            fileType: true,
            url: true
          },
          take: 10 // Limit total evidence
        }
      }
    })
  } catch (error) {
    console.error("Error fetching ITP:", error)
    return null
  }
}

export async function createITP(data: any) {
  try {
    const itp = await db.iTP.create({ 
      data,
      include: { project: true }
    })
    revalidatePath("/dashboard/itp")
    return { 
      success: true, 
      message: `✓ ITP "${itp.title}" berhasil dibuat`,
      data: itp 
    }
  } catch (error: any) {
    console.error("Error creating ITP:", error)
    return { 
      success: false, 
      message: `✗ Gagal membuat ITP: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateITP(id: string, data: any) {
  try {
    const itp = await db.iTP.update({ 
      where: { id }, 
      data,
      include: { project: true }
    })
    revalidatePath("/dashboard/itp")
    return { 
      success: true, 
      message: `✓ ITP "${itp.title}" berhasil diupdate`,
      data: itp 
    }
  } catch (error: any) {
    console.error("Error updating ITP:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate ITP: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteITP(id: string) {
  try {
    const itp = await db.iTP.findUnique({ where: { id } })
    if (!itp) {
      return { success: false, message: "✗ ITP tidak ditemukan" }
    }
    
    await db.iTP.delete({ where: { id } })
    revalidatePath("/dashboard/itp")
    return { 
      success: true, 
      message: `✓ ITP "${itp.title}" berhasil dihapus` 
    }
  } catch (error: any) {
    console.error("Error deleting ITP:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus ITP." 
    }
  }
}

// ==================== NCR (Non-Conformance Report) ====================
export async function getNCRs() {
  try {
    return await db.nCR.findMany({
      include: { 
        inspection: { 
          include: { 
            project: { select: { name: true } },
            material: { select: { name: true, markNo: true } },
            inspector: { select: { name: true } }
          } 
        },
        material: { select: { name: true, markNo: true } }
      },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching NCRs:", error)
    return []
  }
}

export async function getNCRById(id: string) {
  try {
    return await db.nCR.findUnique({
      where: { id },
      select: {
        id: true,
        ncrNumber: true,
        inspectionId: true,
        materialId: true,
        title: true,
        description: true,
        rootCause: true,
        correctiveAction: true,
        status: true,
        category: true,
        severity: true,
        createdAt: true,
        updatedAt: true,
        closedDate: true,
        inspection: { 
          select: { 
            id: true,
            project: { 
              select: { 
                id: true, 
                name: true, 
                location: true 
              } 
            },
            material: { 
              select: { 
                id: true, 
                name: true, 
                markNo: true 
              } 
            },
            inspector: { 
              select: { 
                id: true, 
                name: true, 
                email: true 
              } 
            }
          } 
        },
        material: { 
          select: { 
            id: true, 
            name: true, 
            markNo: true 
          } 
        },
        evidence: {
          select: {
            id: true,
            url: true,
            fileName: true,
            fileType: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  } catch (error) {
    console.error("Error fetching NCR:", error)
    return null
  }
}

export async function createNCR(data: any) {
  try {
    const ncr = await db.nCR.create({ 
      data: {
        ...data,
        title: data.title || data.ncrNumber || "NCR Report"
      },
      include: { material: true }
    })
    revalidatePath("/dashboard/ncr")
    revalidatePath("/dashboard/qc")
    return { 
      success: true, 
      message: `✓ NCR "${ncr.ncrNumber}" berhasil dibuat`,
      data: ncr 
    }
  } catch (error: any) {
    console.error("Error creating NCR:", error)
    return { 
      success: false, 
      message: `✗ Gagal membuat NCR: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateNCR(id: string, data: any) {
  try {
    const ncr = await db.nCR.update({ 
      where: { id }, 
      data,
      include: { material: true }
    })
    revalidatePath("/dashboard/ncr")
    revalidatePath(`/dashboard/ncr/${id}`)
    revalidatePath("/dashboard/qc")
    return { 
      success: true, 
      message: `✓ NCR "${ncr.ncrNumber}" berhasil diupdate`,
      data: ncr 
    }
  } catch (error: any) {
    console.error("Error updating NCR:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate NCR: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateNCRStatus(id: string, status: string) {
  try {
    const ncr = await db.nCR.update({ 
      where: { id }, 
      data: { status },
      include: { inspection: { include: { project: true } } }
    })
    revalidatePath("/dashboard/ncr")
    revalidatePath(`/dashboard/ncr/${id}`)
    revalidatePath("/dashboard/qc")
    return { 
      success: true, 
      message: `✓ Status NCR "${ncr.ncrNumber}" diubah menjadi ${status}`,
      data: ncr 
    }
  } catch (error: any) {
    console.error("Error updating NCR status:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate status NCR: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteNCR(id: string) {
  try {
    const ncr = await db.nCR.findUnique({ where: { id } })
    if (!ncr) {
      return { success: false, message: "✗ NCR tidak ditemukan" }
    }
    
    await db.nCR.delete({ where: { id } })
    revalidatePath("/dashboard/ncr")
    return { 
      success: true, 
      message: `✓ NCR "${ncr.ncrNumber}" berhasil dihapus` 
    }
  } catch (error: any) {
    console.error("Error deleting NCR:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus NCR." 
    }
  }
}
// ==================== HYDROTEST PACKAGES ====================
export async function getHydrotestPackages() {
  try {
    return await db.hydrotestPackage.findMany({
      include: { 
        project: true 
      },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching Hydrotest Packages:", error)
    return []
  }
}

export async function createHydrotestPackage(data: any) {
  try {
    const hydrotest = await db.hydrotestPackage.create({ 
      data,
      include: { project: true }
    })
    revalidatePath("/dashboard/mdr/hydrotest")
    return { 
      success: true, 
      message: `✓ Hydrotest Package "${hydrotest.testPackNumber}" berhasil dibuat`,
      data: hydrotest 
    }
  } catch (error: any) {
    console.error("Error creating Hydrotest Package:", error)
    return { 
      success: false, 
      message: `✗ Gagal membuat Hydrotest Package: ${error.message || 'Database error'}` 
    }
  }
}

export async function updateHydrotestPackage(id: string, data: any) {
  try {
    const hydrotest = await db.hydrotestPackage.update({ 
      where: { id }, 
      data,
      include: { project: true }
    })
    revalidatePath("/dashboard/mdr/hydrotest")
    return { 
      success: true, 
      message: `✓ Hydrotest Package "${hydrotest.testPackNumber}" berhasil diupdate`,
      data: hydrotest 
    }
  } catch (error: any) {
    console.error("Error updating Hydrotest Package:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate Hydrotest Package: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteHydrotestPackage(id: string) {
  try {
    const hydrotest = await db.hydrotestPackage.findUnique({ where: { id } })
    if (!hydrotest) {
      return { success: false, message: "✗ Hydrotest Package tidak ditemukan" }
    }
    
    await db.hydrotestPackage.delete({ where: { id } })
    revalidatePath("/dashboard/mdr/hydrotest")
    return { 
      success: true, 
      message: `✓ Hydrotest Package "${hydrotest.testPackNumber}" berhasil dihapus` 
    }
  } catch (error: any) {
    console.error("Error deleting Hydrotest Package:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus Hydrotest Package." 
    }
  }
}

// ==================== INSPECTIONS (Helper for NCR/Dashboard) ====================
export async function getInspections() {
  try {
    return await db.inspection.findMany({
      include: { 
        project: true,
        inspector: { select: { name: true } },
        material: true,
        ncr: true
      },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Error fetching inspections:", error)
    return []
  }
}

// Fetch only inspections eligible for NCR (usually Rejected or Pending, and no existing NCR)
export async function getInspectionsForNCR() {
  try {
    const inspections = await db.inspection.findMany({
      where: {
        AND: [
          { ncr: null },
          { status: { in: ["Rejected", "REJECTED", "Fail", "FAIL"] } }
        ]
      },
      include: { 
        project: { select: { id: true, name: true } },
        inspector: { select: { id: true, name: true } },
        material: { select: { id: true, name: true, markNo: true } },
        evidence: true
      },
      orderBy: { createdAt: "desc" }
    })
    return inspections
  } catch (error) {
    console.error("Error fetching inspections for NCR:", error)
    return []
  }
}

export async function updateITPItemStatus(id: string, approvalStatus: string) {
  try {
    const item = await db.iTPItem.update({ 
      where: { id }, 
      data: { approvalStatus },
      include: { itp: true }
    })
    revalidatePath("/dashboard/itp")
    revalidatePath(`/dashboard/itp/${item.itpId}`)
    return { 
      success: true, 
      message: `✓ Status tahapan "${item.stage}" diubah menjadi ${approvalStatus}`,
      data: item
    }
  } catch (error: any) {
    console.error("Error updating ITP item status:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate status tahapan: ${error.message || 'Database error'}` 
    }
  }
}

export async function createITPItem(data: any) {
  try {
    const item = await db.iTPItem.create({ 
      data,
      include: { itp: true }
    })
    revalidatePath("/dashboard/itp")
    revalidatePath(`/dashboard/itp/${data.itpId}`)
    return { 
      success: true, 
      message: `✓ Tahapan "${item.stage}" berhasil ditambahkan ke ITP`,
      data: item
    }
  } catch (error: any) {
    console.error("Error creating ITP item:", error)
    return { 
      success: false, 
      message: `✗ Gagal menambahkan tahapan ITP: ${error.message || 'Database error'}` 
    }
  }
}

export async function createInspection(data: any) {
  try {
    // Standardize status for Inspection (Title Case based on schema comment)
    // Map from potential UI variations
    const status = data.status || data.result || "Pending"
    const cleanedData = { ...data }
    delete cleanedData.result // remove invalid field if present

    const inspection = await db.inspection.create({ 
      data: {
        ...cleanedData,
        status: status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      } 
    })
    revalidatePath("/dashboard/qc")
    return { 
      success: true, 
      message: "✓ Inspection created successfully",
      data: inspection
    }
  } catch (error: any) {
    console.error("Error creating inspection:", error)
    return { 
      success: false, 
      message: `✗ Failed to create inspection: ${error.message}` 
    }
  }
}
export async function uploadEvidence(data: { url: string, fileName: string, fileType: string, inspectionId?: string, ncrId?: string, itpItemId?: string, itpId?: string, reportId?: string }) {
  try {
    const evidence = await db.evidenceFile.create({ data })
    
    // Revalidate relevant paths
    if (data.ncrId) revalidatePath(`/dashboard/ncr/${data.ncrId}`)
    if (data.itpId) revalidatePath(`/dashboard/itp/${data.itpId}`)
    if (data.itpItemId) {
      const item = await db.iTPItem.findUnique({ where: { id: data.itpItemId }, select: { itpId: true } })
      if (item) revalidatePath(`/dashboard/itp/${item.itpId}`)
    }
    
    return { 
      success: true, 
      message: "✓ Evidence uploaded successfully",
      data: evidence
    }
  } catch (error: any) {
    console.error("Error uploading evidence:", error)
    return { 
      success: false, 
      message: `✗ Gagal upload evidence: ${error.message}` 
    }
  }
}
