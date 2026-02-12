"use client"

import Link from "next/link"
import { 
  PackageCheck, 
  Scissors, 
  Compass, 
  Flame, 
  ScanLine, 
  Palette, 
  Droplets, 
  FileCheck
} from "lucide-react"
import { MobileHub } from "@/components/mobile-hub"
import { Card } from "@/components/ui/card"

const mdrItems = [
  {
    title: "Incoming",
    subtitle: "Receiving",
    icon: PackageCheck,
    url: "/dashboard/mdr/incoming",
    color: "bg-blue-500",
    lightColor: "bg-blue-50"
  },
  {
    title: "Cutting",
    subtitle: "Sizing",
    icon: Scissors,
    url: "/dashboard/mdr/cutting",
    color: "bg-orange-500",
    lightColor: "bg-orange-50"
  },
  {
    title: "Fit-up",
    subtitle: "Assembly",
    icon: Compass,
    url: "/dashboard/mdr/fitup",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50"
  },
  {
    title: "Welding",
    subtitle: "Joints",
    icon: Flame,
    url: "/dashboard/mdr/welding",
    color: "bg-red-500",
    lightColor: "bg-red-50"
  },
  {
    title: "NDT",
    subtitle: "Testing",
    icon: ScanLine,
    url: "/dashboard/mdr/ndt",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50"
  },
  {
    title: "Painting",
    subtitle: "Coating",
    icon: Palette,
    url: "/dashboard/mdr/painting",
    color: "bg-pink-500",
    lightColor: "bg-pink-50"
  },
  {
    title: "Hydrotest",
    subtitle: "Pressure",
    icon: Droplets,
    url: "/dashboard/mdr/hydrotest",
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50"
  },
  {
    title: "Final",
    subtitle: "Release",
    icon: FileCheck,
    url: "/dashboard/mdr/final",
    color: "bg-teal-500",
    lightColor: "bg-teal-50"
  }
]

export default function MDRHubPage() {
  return (
    <main className="flex-1">
      {/* Mobile View */}
      <MobileHub 
        title="MDR Records" 
        description="Material Data Record Tracking" 
        items={mdrItems} 
      />

      {/* Desktop View */}
      <div className="hidden md:block p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#1a4d4a] tracking-tight">MDR Dashboard</h1>
            <p className="text-slate-500 font-medium">Consolidated Material Data Record Management</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {mdrItems.map((item) => (
              <Link key={item.title} href={item.url} className="group">
                <Card className="p-8 flex flex-col items-center justify-center text-center gap-5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border-none rounded-[2.5rem] bg-white aspect-square shadow-sm">
                  <div className={`${item.lightColor} p-6 rounded-3xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <item.icon className={`h-10 w-10 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">{item.subtitle}</p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
