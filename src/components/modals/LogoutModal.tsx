"use client"

import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { LogOut, AlertCircle } from "lucide-react"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"

interface LogoutModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LogoutModal({ open, onOpenChange }: LogoutModalProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: "/login" })
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-4xl border-none shadow-2xl p-0 overflow-hidden bg-white">
        <div className="bg-rose-500 p-8 flex flex-col items-center text-white relative">
           <motion.div 
             initial={{ scale: 0.5, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ type: "spring", stiffness: 300, damping: 20 }}
             className="bg-white/20 p-4 rounded-3xl mb-4"
           >
              <LogOut className="h-10 w-10 text-white" />
           </motion.div>
           <AlertDialogTitle className="text-2xl font-black tracking-tight text-white mb-1">
             Confirm Logout
           </AlertDialogTitle>
           <p className="text-rose-100 text-sm font-medium opacity-80 uppercase tracking-widest text-[10px]">
             QC Mechanical Management System
           </p>
        </div>
        
        <div className="p-8 space-y-6">
           <AlertDialogDescription className="text-slate-600 font-medium text-center text-base leading-relaxed">
             Are you sure you want to end your session? You will need to sign in again to access the dashboard.
           </AlertDialogDescription>

           <div className="flex gap-3">
              <AlertDialogCancel asChild>
                <Button variant="ghost" className="flex-1 h-14 rounded-2xl font-black text-slate-400 hover:bg-slate-50 border-none transition-all active:scale-95">
                  KEEP WORKING
                </Button>
              </AlertDialogCancel>
              
              <AlertDialogAction asChild onClick={handleLogout}>
                <Button className="flex-1 h-14 bg-rose-500 hover:bg-rose-600 rounded-2xl font-black shadow-xl shadow-rose-500/20 text-white transition-all active:scale-95">
                  LOGOUT NOW
                </Button>
              </AlertDialogAction>
           </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}
