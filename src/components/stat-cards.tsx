"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ClipboardCheck, ShieldCheck, ShieldAlert, FileWarning, TrendingDown, LayoutPanelLeft } from "lucide-react"

const stats = [
  {
    title: "Total Project",
    value: "12",
    change: "+2",
    trend: "up",
    icon: LayoutPanelLeft,
    color: "bg-blue-100 text-blue-600",
    desc: "Active projects current month"
  },
  {
    title: "Total Inspection",
    value: "458",
    change: "+84",
    trend: "up",
    icon: ClipboardCheck,
    color: "bg-purple-100 text-purple-600",
    desc: "Total reports submitted"
  },
  {
    title: "Passed",
    value: "412",
    change: "90%",
    trend: "up",
    icon: ShieldCheck,
    color: "bg-emerald-100 text-emerald-600",
    desc: "Quality standard met"
  },
  {
    title: "Rejected",
    value: "46",
    change: "10%",
    trend: "down",
    icon: ShieldAlert,
    color: "bg-red-100 text-red-600",
    desc: "Requires rectification"
  },
  {
    title: "NCR Open",
    value: "18",
    change: "-4",
    trend: "up", // up meaning improvement (less NCR)
    icon: FileWarning,
    color: "bg-orange-100 text-orange-600",
    desc: "Pending resolution"
  },
  {
    title: "Repair Rate",
    value: "5.2%",
    change: "-0.8%",
    trend: "up", // up meaning improvement
    icon: TrendingDown,
    color: "bg-cyan-100 text-cyan-600",
    desc: "Target: < 3.0%"
  },
]

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 p-6 pt-0">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-none shadow-sm rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                stat.trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold">{stat.value}</span>
              <span className="text-xs font-semibold text-foreground mt-1">{stat.title}</span>
              <span className="text-[10px] text-muted-foreground mt-0.5">{stat.desc}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
