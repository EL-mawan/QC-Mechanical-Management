"use client"

import * as React from "react"
import {
  BarChart3,
  FileText,
  HelpCircle,
  LayoutDashboard,
  Package,
  Settings,
  AlertTriangle,
  ChevronRight,
} from "lucide-react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Master Data",
      url: "#",
      icon: Package,
      items: [
        { title: "Clients", url: "/dashboard/master/clients" },
        { title: "Projects", url: "/dashboard/master/projects" },
        { title: "Drawings", url: "/dashboard/master/drawings" },
        { title: "Materials", url: "/dashboard/master/materials" },
        { title: "Welders", url: "/dashboard/master/welders" },
        { title: "WPS", url: "/dashboard/master/wps" },
        { title: "Inspectors", url: "/dashboard/master/inspectors" },
      ],
    },
    {
      title: "MDR Reports",
      url: "#",
      icon: FileText,
      items: [
        { title: "Incoming Material", url: "/dashboard/mdr/incoming" },
        { title: "Cutting Report", url: "/dashboard/mdr/cutting" },
        { title: "Fit-up Report", url: "/dashboard/mdr/fitup" },
        { title: "Welding Log", url: "/dashboard/mdr/welding" },
        { title: "NDT Report", url: "/dashboard/mdr/ndt" },
        { title: "Dimensional", url: "/dashboard/mdr/dimensional" },
        { title: "Painting Report", url: "/dashboard/mdr/painting" },
        { title: "Final Inspection", url: "/dashboard/mdr/final" },
        { title: "Hydrotest Report", url: "/dashboard/mdr/hydrotest" },
      ],
    },
    {
      title: "ITP (Inspection Plan)",
      url: "#",
      icon: FileText,
      items: [
        { title: "ITP List", url: "/dashboard/itp" },
      ],
    },
    {
      title: "NCR Reports",
      url: "#",
      icon: AlertTriangle,
      items: [
        { title: "Open NCR", url: "/dashboard/ncr" },
        { title: "On Progress", url: "/dashboard/ncr" },
        { title: "Closed NCR", url: "/dashboard/ncr" },
      ],
    },
  ],
  secondary: [
    {
      title: "Analytics",
      url: "#",
      icon: BarChart3,
    },
    {
      title: "Help & Support",
      url: "#",
      icon: HelpCircle,
    },
    {
      title: "Setting",
      url: "#",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  const renderedNavMain = React.useMemo(() => (
    data.navMain.map((item) => {
      const isChildActive = item.items?.some(sub => pathname === sub.url)
      const isActive = pathname === item.url || isChildActive

      if (!item.items) {
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              asChild
              tooltip={item.title}
              className={
                isActive
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-md transform scale-[1.02]"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }
            >
              <Link href={item.url}>
                {item.icon && <item.icon className="h-4 w-4" />}
                <span className="font-bold tracking-tight">{item.title}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      }

      return (
        <Collapsible
          key={item.title}
          asChild
          defaultOpen={isActive}
          className="group/collapsible"
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton
                tooltip={item.title}
                className={
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                <span className="font-bold tracking-tight">{item.title}</span>
                <ChevronRight className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 opacity-50" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="border-white/10 ml-4 pl-2 space-y-1 mt-1">
                {item.items?.map((subItem) => {
                  const isSubActive = pathname === subItem.url
                  return (
                    <SidebarMenuSubItem key={subItem.title}>
                      <SidebarMenuSubButton asChild>
                        <Link 
                          href={subItem.url} 
                          className={cn(
                            "transition-all duration-200 py-1.5 h-auto",
                            isSubActive 
                            ? "text-white font-black translate-x-1" 
                            : "text-white/50 hover:text-white hover:translate-x-1"
                          )}
                        >
                          <span className="text-xs uppercase tracking-widest">{subItem.title}</span>
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )
                })}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      )
    })
  ), [pathname])

  const renderedSecondary = React.useMemo(() => (
    data.secondary.map((item) => (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          tooltip={item.title}
          className="text-white/60 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Link href={item.url} className="flex items-center gap-3">
            <item.icon className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-widest">{item.title}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))
  ), [])

  return (
    <Sidebar collapsible="icon" {...props} className="border-none bg-[#0a2e2c]">
      <SidebarHeader className="h-24 flex items-center justify-center border-b border-white/5 mx-4">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 flex items-center justify-center transition-transform">
            <Image 
              src="/ar-logo.svg" 
              alt="AR Logo" 
              width={48} 
              height={48} 
              className="object-contain"
            />
          </div>
          <div className="flex flex-col group-hover:translate-x-1 transition-transform">
             <span className="text-white font-black text-lg tracking-tighter leading-none">MATRIX</span>
             <span className="text-teal-500 font-bold text-[10px] uppercase tracking-[0.2em] mt-1">Mechanical</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6 gap-6">
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2">Main Navigation</SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            {renderedNavMain}
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2">Operational</SidebarGroupLabel>
          <SidebarMenu className="gap-2">
            {renderedSecondary}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}


