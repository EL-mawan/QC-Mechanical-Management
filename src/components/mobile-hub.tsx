"use client"

import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"

interface HubItem {
  title: string
  subtitle?: string
  icon: LucideIcon
  url?: string
  onClick?: () => void
  color: string
  lightColor: string
}

interface MobileHubProps {
  title: string
  description?: string
  items: HubItem[]
}

export function MobileHub({ title, description, items }: MobileHubProps) {
  return (
    <div className="md:hidden space-y-6 p-4 pb-24">
      <div className="px-2">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">{title}</h1>
        {description && <p className="text-slate-500 text-xs font-medium uppercase tracking-widest mt-1">{description}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {items.map((item) => {
          const Content = (
            <Card className="py-3 px-1 flex flex-col items-center justify-center text-center gap-1.5 border-none rounded-2xl bg-white aspect-square shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 transition-all">
              <div className={`${item.lightColor} p-2.5 rounded-xl mb-1`}>
                <item.icon className={`h-5 w-5 ${item.color.replace('bg-', 'text-')}`} />
              </div>
              <div className="w-full px-1">
                <h3 className="text-[10px] font-bold text-slate-800 leading-tight">{item.title}</h3>
                {item.subtitle && <p className="text-[7px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 truncate">{item.subtitle}</p>}
              </div>
            </Card>
          )

          if (item.onClick) {
            return (
              <button key={item.title} onClick={item.onClick} className="text-left">
                {Content}
              </button>
            )
          }

          return (
            <Link key={item.title} href={item.url || "#"} className="block">
              {Content}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
