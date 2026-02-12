"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function getClients() {
  try {
    return await db.client.findMany({
      include: {
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { createdAt: "desc" }
    })
  } catch (error) {
    console.error("Failed to fetch clients:", error)
    return []
  }
}

export async function createClient(data: { name: string, email?: string, contact?: string, address?: string }) {
  try {
    const client = await db.client.create({
      data: {
        name: data.name,
        email: data.email,
        contact: data.contact,
        address: data.address,
      }
    })
    revalidatePath("/dashboard/master/clients")
    return { 
      success: true, 
      message: `✓ Client "${client.name}" berhasil ditambahkan ke database`,
      data: client 
    }
  } catch (error: any) {
    console.error("Failed to create client:", error)
    return { 
      success: false, 
      message: `✗ Gagal menambahkan client: ${error.message || 'Database error'}` 
    }
  }
}

export async function deleteClient(id: string) {
  try {
    const client = await db.client.findUnique({ where: { id } })
    if (!client) {
      return { success: false, message: "✗ Client tidak ditemukan" }
    }
    
    await db.client.delete({ where: { id } })
    revalidatePath("/dashboard/master/clients")
    return { 
      success: true, 
      message: `✓ Client "${client.name}" berhasil dihapus dari sistem` 
    }
  } catch (error: any) {
    console.error("Failed to delete client:", error)
    return { 
      success: false, 
      message: "✗ Gagal menghapus client. Client mungkin masih memiliki project aktif." 
    }
  }
}

export async function updateClient(id: string, data: { name: string, email?: string, contact?: string, address?: string }) {
  try {
    const client = await db.client.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        contact: data.contact,
        address: data.address,
      }
    })
    revalidatePath("/dashboard/master/clients")
    return { 
      success: true, 
      message: `✓ Client "${client.name}" berhasil diupdate`,
      data: client 
    }
  } catch (error: any) {
    console.error("Failed to update client:", error)
    return { 
      success: false, 
      message: `✗ Gagal mengupdate client: ${error.message || 'Database error'}` 
    }
  }
}

