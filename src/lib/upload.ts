"use server"

import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File
    if (!file) {
      return { success: false, message: "✗ No file provided" }
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return { 
        success: false, 
        message: "✗ File terlalu besar. Maksimal 10MB" 
      }
    }

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg", 
      "image/png",
      "image/webp",
      "application/pdf",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ]
    
    if (!allowedTypes.includes(file.type)) {
      return { 
        success: false, 
        message: "✗ Tipe file tidak didukung. Gunakan JPG, PNG, PDF, atau Excel" 
      }
    }

    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads")
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}_${originalName}`
    const filepath = join(uploadDir, filename)

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${filename}`
    
    return {
      success: true,
      message: `✓ File "${file.name}" berhasil diupload`,
      data: {
        filename,
        originalName: file.name,
        size: file.size,
        type: file.type,
        url: publicUrl
      }
    }
  } catch (error: any) {
    console.error("Error uploading file:", error)
    return {
      success: false,
      message: `✗ Gagal mengupload file: ${error.message || 'Server error'}`
    }
  }
}

export async function uploadMultipleFiles(formData: FormData) {
  try {
    const files = formData.getAll("files") as File[]
    if (!files || files.length === 0) {
      return { success: false, message: "✗ No files provided" }
    }

    // Validate max files (max 5 files at once)
    if (files.length > 5) {
      return {
        success: false,
        message: "✗ Maksimal 5 file sekaligus"
      }
    }

    const uploadedFiles: any[] = []
    const errors: any[] = []

    for (const file of files) {
      const singleFormData = new FormData()
      singleFormData.append("file", file)
      
      const result = await uploadFile(singleFormData)
      
      if (result.success) {
        uploadedFiles.push(result.data)
      } else {
        errors.push({ filename: file.name, error: result.message })
      }
    }

    if (uploadedFiles.length === 0) {
      return {
        success: false,
        message: "✗ Semua file gagal diupload",
        errors
      }
    }

    return {
      success: true,
      message: `✓ ${uploadedFiles.length} file berhasil diupload`,
      data: uploadedFiles,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error: any) {
    console.error("Error uploading multiple files:", error)
    return {
      success: false,
      message: `✗ Gagal mengupload files: ${error.message || 'Server error'}`
    }
  }
}

export async function deleteFile(filename: string) {
  try {
    const { unlink } = await import("fs/promises")
    const filepath = join(process.cwd(), "public", "uploads", filename)
    
    if (!existsSync(filepath)) {
      return {
        success: false,
        message: "✗ File tidak ditemukan"
      }
    }

    await unlink(filepath)
    
    return {
      success: true,
      message: `✓ File "${filename}" berhasil dihapus`
    }
  } catch (error: any) {
    console.error("Error deleting file:", error)
    return {
      success: false,
      message: `✗ Gagal menghapus file: ${error.message || 'Server error'}`
    }
  }
}
