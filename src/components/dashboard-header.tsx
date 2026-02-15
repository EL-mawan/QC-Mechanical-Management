"use client"

import { LogOut, Bell, Search, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { signOut, useSession } from "next-auth/react"
import { LogoutModal } from "@/components/modals/LogoutModal"
import { useState } from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function DashboardHeader() {
  const { data: session } = useSession()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between px-4 sm:px-6 bg-[#fcfdfe]/70 backdrop-blur-xl border-b border-white/20 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <div className="hidden md:block">
           <SidebarTrigger className="h-10 w-10 rounded-xl bg-white shadow-sm hover:bg-slate-50 border-none" />
        </div>
        <div className="relative w-full max-w-[24rem]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search Matrix..."
            className="pl-10 bg-white border-none shadow-sm h-10 rounded-2xl sm:rounded-4xl text-xs sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        <Button variant="ghost" size="icon" className="relative h-9 w-9 sm:h-10 sm:w-10 bg-white shadow-sm rounded-xl">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-red-500 border-2 border-white" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#1a4d4a]">{session?.user?.name || "Loading..."}</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{session?.user?.role || "User"}</span>
          </div>
          <Avatar className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border-2 border-white shadow-sm">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${session?.user?.name}&top=shortHair&facialHair=beard`} />
            <AvatarFallback className="bg-teal-50 text-teal-600 font-black text-[10px]">QC</AvatarFallback>
          </Avatar>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </div>
      <LogoutModal 
        open={showLogoutModal} 
        onOpenChange={setShowLogoutModal} 
      />
    </header>
  )
}
