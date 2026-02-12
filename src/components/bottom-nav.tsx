"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Package, 
  FileText, 
  AlertTriangle, 
  ClipboardList 
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Master",
    url: "/dashboard/master",
    icon: Package,
    activeRoot: "/dashboard/master"
  },
  {
    title: "MDR",
    url: "/dashboard/mdr",
    icon: FileText,
    activeRoot: "/dashboard/mdr"
  },
  {
    title: "ITP",
    url: "/dashboard/itp",
    icon: ClipboardList,
    activeRoot: "/dashboard/itp"
  },
  {
    title: "NCR",
    url: "/dashboard/ncr",
    icon: AlertTriangle,
    activeRoot: "/dashboard/ncr"
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-teal-100/95 backdrop-blur-xl border border-teal-200 px-2 py-3 z-50 rounded-[2.5rem] shadow-[0_8px_32px_rgba(20,184,166,0.25)]">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = item.activeRoot 
            ? pathname.startsWith(item.activeRoot)
            : pathname === item.url

          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                "relative flex flex-col items-center gap-1.5 transition-all duration-300 px-4 py-2 rounded-2xl",
                isActive 
                  ? "text-teal-600 after:content-[''] after:absolute after:-bottom-1 after:w-1 after:h-1 after:bg-teal-600 after:rounded-full" 
                  : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn(
                "h-6 w-6 transition-all duration-300",
                isActive ? "scale-110 stroke-[2.5px]" : "scale-100 stroke-[1.5px]"
              )} />
              <span className={cn(
                "text-[9px] font-black uppercase tracking-widest transition-all mt-0.5",
                isActive ? "text-teal-800 scale-100" : "text-slate-500 scale-90"
              )}>
                {item.title}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
