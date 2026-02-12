"use client"

import Link from "next/link"
import { 
  Building2, 
  FileImage, 
  ShieldCheck, 
  Box, 
  Briefcase, 
  UserCog, 
  ScrollText,
  ChevronRight
} from "lucide-react"
import { Card } from "@/components/ui/card"

import { MobileHub } from "@/components/mobile-hub"

const masterItems = [
  {
    title: "Projects",
    subtitle: "Management",
    icon: Briefcase,
    url: "/dashboard/master/projects",
    color: "bg-blue-500",
    lightColor: "bg-blue-50"
  },
  {
    title: "Welders",
    subtitle: "Personnel",
    icon: UserCog,
    url: "/dashboard/master/welders",
    color: "bg-orange-500",
    lightColor: "bg-orange-50"
  },
  {
    title: "Materials",
    subtitle: "Inventory",
    icon: Box,
    url: "/dashboard/master/materials",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50"
  },
  {
    title: "Inspectors",
    subtitle: "QC Team",
    icon: ShieldCheck,
    url: "/dashboard/master/inspectors",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50"
  },
  {
    title: "Clients",
    subtitle: "Stakeholders",
    icon: Building2,
    url: "/dashboard/master/clients",
    color: "bg-violet-500",
    lightColor: "bg-violet-50"
  },
  {
    title: "Drawings",
    subtitle: "Blueprints",
    icon: FileImage,
    url: "/dashboard/master/drawings",
    color: "bg-pink-500",
    lightColor: "bg-pink-50"
  },
  {
    title: "WPS",
    subtitle: "Standards",
    icon: ScrollText,
    url: "/dashboard/master/wps",
    color: "bg-teal-500",
    lightColor: "bg-teal-50"
  }
]

export default function MasterHubPage() {
  return (
    <main className="flex-1">
      {/* Mobile View */}
      <MobileHub 
        title="Master Menu" 
        description="Core Project Databases" 
        items={masterItems} 
      />

      {/* Desktop View */}
      <div className="hidden md:block p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-[#1a4d4a] tracking-tight">Master Data Management</h1>
            <p className="text-slate-500 font-medium">Configure and manage project-wide baseline information</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {masterItems.map((item) => (
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
