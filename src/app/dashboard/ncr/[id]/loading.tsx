import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function NCRDetailLoading() {
  return (
    <main className="flex-1 p-6">
          {/* Header Skeleton */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-4 w-64 mt-2" />
              </div>
            </div>
            <div className="md:ml-auto flex items-center gap-3">
              <Skeleton className="h-12 w-32 rounded-xl" />
              <Skeleton className="h-8 w-24 rounded-lg" />
              <Skeleton className="h-12 w-36 rounded-xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content Skeleton */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white/80">
                <CardHeader className="px-0 pt-0">
                  <Skeleton className="h-6 w-48" />
                </CardHeader>
                <div className="space-y-6">
                  <Skeleton className="h-32 w-full rounded-2xl" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                  </div>
                </div>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white/80">
                <CardHeader className="px-0 pt-0">
                  <Skeleton className="h-6 w-56" />
                </CardHeader>
                <div className="space-y-6">
                  <Skeleton className="h-24 rounded-2xl" />
                  <Skeleton className="h-24 rounded-2xl" />
                </div>
              </Card>
            </div>

            {/* Sidebar Skeleton */}
            <div className="space-y-6">
              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                <CardHeader className="px-0 pt-0">
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="aspect-square rounded-2xl" />
                  <Skeleton className="aspect-square rounded-2xl" />
                </div>
              </Card>

              <Card className="border-none shadow-sm rounded-3xl p-8 bg-white">
                <CardHeader className="px-0 pt-0">
                  <Skeleton className="h-6 w-32" />
                </CardHeader>
                <div className="space-y-6">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              </Card>
            </div>
          </div>
    </main>
  )
}
