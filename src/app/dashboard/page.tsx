import { getDashboardMetrics } from "@/app/actions/dashboard-actions"
import { DashboardView } from "../DashboardView"

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics()
  
  return <DashboardView metrics={metrics} />
}
