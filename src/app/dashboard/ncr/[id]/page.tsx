import { getNCRById } from "@/app/actions/qc-actions"
import { NCRDetailView } from "./NCRDetailView"
import { Button } from "@/components/ui/button"
import { AlertTriangle, ChevronLeft } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"
import NCRDetailLoading from "./loading"

// Enable dynamic rendering for real-time data
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function NCRContent({ id }: { id: string }) {
  const ncr = await getNCRById(id)
  
  if (!ncr) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#f8fafa] relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center max-w-md text-center px-6">
          <div className="w-24 h-24 bg-red-50 rounded-4xl flex items-center justify-center mb-8 shadow-xl shadow-red-500/10 border border-red-100/50">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-black text-slate-800 tracking-tight mb-4">NCR Registry Breach</h1>
          <p className="text-slate-500 font-medium leading-relaxed mb-10">
            The Non-Conformance Report you are looking for has either been relocated, purged, or the ID is invalid in the central database.
          </p>
          <div className="flex flex-col w-full gap-3">
            <Button asChild className="bg-[#1a4d4a] hover:bg-teal-900 h-14 rounded-2xl font-black shadow-xl shadow-teal-900/10 transition-all active:scale-95">
              <Link href="/dashboard/ncr">Back to NCR Registry</Link>
            </Button>
            <Button asChild variant="ghost" className="h-14 rounded-2xl font-bold text-slate-400 hover:text-slate-600">
              <Link href="/dashboard">Return to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return <NCRDetailView initialData={ncr} />
}

export default function NCRDetailPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={<NCRDetailLoading />}>
      <NCRContent id={params.id} />
    </Suspense>
  )
}
