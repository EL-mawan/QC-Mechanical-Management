"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import { Lock, Mail, ArrowRight, Loader2, CheckCircle2, ShieldCheck, Cpu, Globe, Database } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isFocused, setIsFocused] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Access Denied", {
          description: "Secret key or identity mismatch.",
          className: "rounded-3xl border-none shadow-2xl bg-white/90 backdrop-blur-xl",
        })
      } else {
        setIsSuccess(true)
        toast.success("Security Cleared", {
          description: "Welcome to the Mechanical Management Core.",
          className: "rounded-3xl border-none shadow-2xl bg-white/90 backdrop-blur-xl",
        })
        setTimeout(() => {
          router.push("/dashboard")
        }, 1800)
      }
    } catch (error) {
      toast.error("System Override Error", {
        description: "An unexpected breach in the protocol occurred.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0f0f] relative overflow-hidden font-sans">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-teal-500/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            x: [0, -50, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -left-[10%] w-[60%] h-[60%] bg-[#1a4d4a]/30 rounded-full blur-[120px]" 
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] mix-blend-overlay" />
      </div>

      {/* Floating UI Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden hidden lg:block">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-[15%] left-[10%] text-teal-500/30 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
        >
          <Cpu className="h-4 w-4" /> System_Active // Node_01
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
          className="absolute bottom-[20%] right-[12%] text-emerald-500/30 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"
        >
          <Database className="h-4 w-4" /> Secure_Vault // DB_SYNC
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="login-interface"
            initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md px-6 z-10"
          >
            <div className="relative group">
              {/* Card Glow Effect */}
              <div className="absolute -inset-1 bg-linear-to-r from-teal-500/20 via-emerald-500/20 to-teal-500/20 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                            <div className="relative bg-white/5 backdrop-blur-2xl rounded-[2.8rem] border border-white/10 shadow-2xl overflow-hidden p-1">
                <div className="bg-linear-to-b from-white/10 to-transparent rounded-[2.6rem] p-8 md:p-10">
                  
                  {/* Branding Header */}
                  <div className="text-center mb-10">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="inline-flex relative"
                    >
                      <div className="h-32 w-32 relative flex items-center justify-center">
                        <Image 
                          src="/ar-logo.svg" 
                          alt="AR Logo" 
                          fill
                          className="object-contain"
                          priority
                        />
                      </div>
                    </motion.div>
                    <h1 className="text-5xl font-black mt-6 tracking-tight font-display bg-linear-to-b from-white to-white/60 bg-clip-text text-transparent drop-shadow-lg">
                      AR SYSTEM
                    </h1>
                    <div className="flex items-center justify-center gap-3 mt-4">
                       <div className="h-px w-10 bg-linear-to-r from-transparent to-teal-500/50" />
                       <p className="text-teal-400/80 text-[10px] font-bold uppercase tracking-[0.4em]">QC Management Plan</p>
                       <div className="h-px w-10 bg-linear-to-l from-transparent to-teal-500/50" />
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Input Field: Email */}
                    <div className="space-y-2 group/input">
                      <Label htmlFor="email" className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-4 transition-colors group-focus-within/input:text-teal-400">
                        Personnel Identity
                      </Label>
                      <div className="relative group/field">
                        <div className={`absolute inset-0 bg-teal-500/5 rounded-2xl transition-all duration-300 ${isFocused === 'email' ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} />
                        <Mail className={`absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 z-20 pointer-events-none ${isFocused === 'email' ? 'text-teal-400' : 'text-slate-600'}`} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="admin@qc.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          onFocus={() => setIsFocused('email')}
                          onBlur={() => setIsFocused(null)}
                          required
                          className="relative z-10 rounded-2xl border-white/5 bg-white/5 h-16 pl-14 pr-6 text-slate-200 text-sm focus:bg-white/10 focus:border-teal-500/40 transition-all font-medium placeholder:text-slate-600 border-2"
                        />
                      </div>
                    </div>
                    
                    {/* Input Field: Password */}
                    <div className="space-y-2 group/input">
                      <div className="flex justify-between items-center ml-4 mr-1">
                        <Label htmlFor="password" title="Password secret" className="text-[10px] font-black uppercase text-slate-500 tracking-widest transition-colors group-focus-within/input:text-teal-400">
                          Encryption Key
                        </Label>
                      </div>
                      <div className="relative group/field">
                        <div className={`absolute inset-0 bg-teal-500/5 rounded-2xl transition-all duration-300 ${isFocused === 'password' ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`} />
                        <Lock className={`absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors duration-300 z-20 pointer-events-none ${isFocused === 'password' ? 'text-teal-400' : 'text-slate-600'}`} />
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setIsFocused('password')}
                          onBlur={() => setIsFocused(null)}
                          required
                          className="relative z-10 rounded-2xl border-white/5 bg-white/5 h-16 pl-14 pr-6 text-slate-200 text-sm focus:bg-white/10 focus:border-teal-500/40 transition-all font-medium placeholder:text-slate-600 border-2"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="pt-4"
                    >
                      <Button
                        type="submit"
                        className="w-full relative h-16 rounded-2xl overflow-hidden group/btn shadow-2xl shadow-teal-500/20 flex items-center justify-center p-0 border-none"
                        disabled={isLoading}
                      >
                        <div className="absolute inset-0 bg-linear-to-r from-teal-500 to-emerald-600 group-hover/btn:from-teal-400 group-hover/btn:to-emerald-500 transition-all duration-500" />
                        <div className="relative z-10 flex items-center gap-3 font-black text-white uppercase tracking-widest text-xs">
                          {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                          ) : (
                            <>
                              Login 
                              <motion.div
                                animate={{ x: [0, 5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                              >
                                <ArrowRight className="h-5 w-5" />
                              </motion.div>
                            </>
                          )}
                        </div>
                      </Button>
                    </motion.div>
                    
                    
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-sequence"
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            className="flex flex-col items-center gap-8 relative z-10"
          >
            <div className="relative">
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 border-2 border-dashed border-teal-500/30 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 10, stiffness: 100 }}
                  className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/50 relative overflow-hidden"
                >
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-white" />
                  </motion.div>
                  <motion.div 
                    animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 rounded-full bg-white/30"
                  />
                </motion.div>
              </div>
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black text-white tracking-tight">Access Granted</h2>
              <div className="flex items-center justify-center gap-3">
                 <div className="h-1 w-1 rounded-full bg-emerald-500 animate-ping" />
                 <p className="text-emerald-400 font-bold uppercase text-[10px] tracking-[0.5em]">Synchronizing Environment...</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-slate-600 font-mono text-[9px] uppercase tracking-[0.3em] flex items-center gap-4 opacity-50">
        <span className="flex items-center gap-1.5"><Globe className="h-3 w-3" /> Secure Node Node_Main</span>
        <span className="h-px w-px bg-slate-800" />
        <span>v0.2.0-stable</span>
      </div>
    </div>
  )
}

