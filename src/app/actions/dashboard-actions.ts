'use server'

import { db } from "@/lib/db"

export async function getDashboardMetrics() {
  try {
    const [
      inspectionStats,
      weldStats,
      materialReceived,
      materialHold,
      missingMTC,
      hydroStats
    ] = await Promise.all([
      // A. Summary Progress (IR / Inspection)
      db.inspection.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      // B. Welding Status
      db.weldLog.groupBy({
        by: ['status'],
        _count: { id: true }
      }),
      // C. Material Status
      db.material.count(),
      db.material.count({
        where: { status: 'HOLD' }
      }),
      db.material.count({
        where: { mtcReceived: false }
      }),
      // D. Hydrotest Status
      db.hydrotestPackage.groupBy({
        by: ['status'],
        _count: { id: true }
      })
    ])

    const irTotal = inspectionStats.reduce((acc, curr) => acc + curr._count.id, 0)
    const irApproved = inspectionStats.find(s => s.status === 'Passed')?._count.id || 0
    const irPending = inspectionStats.find(s => s.status === 'Pending')?._count.id || 0
    const irRejected = inspectionStats.find(s => s.status === 'Rejected')?._count.id || 0

    const totalWelds = weldStats.reduce((acc, curr) => acc + curr._count.id, 0)
    const weldsPassed = weldStats.find(s => s.status === 'PASS')?._count.id || 0
    const weldsRejected = weldStats.find(s => s.status === 'REJECT')?._count.id || 0
    
    // NDT Passed % (Proxied by Weld Pass Rate for now)
    const ndtPassedRate = totalWelds > 0 ? (weldsPassed / totalWelds) * 100 : 0
    
    // Repair Rate %
    const repairRate = totalWelds > 0 ? (weldsRejected / totalWelds) * 100 : 0

    const lineReady = hydroStats.find(s => s.status === 'READY')?._count.id || 0
    const lineTested = hydroStats.find(s => s.status === 'TESTED')?._count.id || 0
    const lineFailed = hydroStats.find(s => s.status === 'FAILED')?._count.id || 0
    const lineApproved = hydroStats.find(s => s.status === 'APPROVED')?._count.id || 0

    return {
      ir: {
        total: irTotal,
        approved: irApproved,
        pending: irPending,
        rejected: irRejected
      },
      welding: {
        total: totalWelds,
        completed: weldsPassed,
        ndtPassed: ndtPassedRate.toFixed(1),
        repairRate: repairRate.toFixed(1)
      },
      material: {
        received: materialReceived,
        hold: materialHold,
        missingMTC: missingMTC
      },
      hydrotest: {
        ready: lineReady,
        tested: lineTested,
        failed: lineFailed,
        approved: lineApproved
      }
    }

  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error)
    return {
      ir: { total: 0, approved: 0, pending: 0, rejected: 0 },
      welding: { total: 0, completed: 0, ndtPassed: "0.0", repairRate: "0.0" },
      material: { received: 0, hold: 0, missingMTC: 0 },
      hydrotest: { ready: 0, tested: 0, failed: 0, approved: 0 }
    }
  }
}
