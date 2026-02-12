import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ITPDetailLoading() {
  return (
    <main className="flex-1 p-6">
          {/* Header Skeleton */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-5">
              <Skeleton className="h-12 w-12 rounded-2xl" />
              <div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-9 w-64" />
                  <Skeleton className="h-7 w-24 rounded-xl" />
                </div>
                <Skeleton className="h-4 w-80 mt-2" />
              </div>
            </div>
            <div className="md:ml-auto flex items-center gap-3">
              <Skeleton className="h-12 w-40 rounded-2xl" />
              <Skeleton className="h-12 w-36 rounded-2xl" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Inspection Matrix Skeleton */}
            <Card className="border-none shadow-sm rounded-4xl p-0 col-span-2 bg-white overflow-hidden ring-1 ring-slate-100">
              <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30 flex flex-row items-center justify-between">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </CardHeader>
              <div className="p-0">
                <Table>
                  <TableHeader className="bg-white border-none">
                    <TableRow className="hover:bg-transparent border-b border-slate-50">
                      <TableHead className="pl-8 h-14"><Skeleton className="h-3 w-4" /></TableHead>
                      <TableHead className="h-14"><Skeleton className="h-3 w-48" /></TableHead>
                      <TableHead className="h-14"><Skeleton className="h-3 w-16" /></TableHead>
                      <TableHead className="h-14"><Skeleton className="h-3 w-24" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i} className="border-b border-slate-50">
                        <TableCell className="pl-8 py-6">
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-full mb-2" />
                          <Skeleton className="h-3 w-3/4" />
                        </TableCell>
                        <TableCell className="text-center">
                          <Skeleton className="h-6 w-20 mx-auto rounded-lg" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-7 w-24 rounded-xl" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>

            {/* Sidebar Skeleton */}
            <div className="flex flex-col gap-8">
              <Card className="border-none shadow-sm rounded-4xl p-8 bg-[#1a4d4a] text-white">
                <CardHeader className="px-0 pt-0">
                  <Skeleton className="h-7 w-40 bg-white/20" />
                </CardHeader>
                <div className="space-y-6 pt-4">
                  <Skeleton className="h-16 bg-white/10 rounded-lg" />
                  <Skeleton className="h-16 bg-white/10 rounded-lg" />
                  <Skeleton className="h-16 bg-white/10 rounded-lg" />
                </div>
              </Card>

              <Card className="border-none shadow-sm rounded-4xl p-8 bg-white">
                <CardHeader className="px-0 pt-0">
                  <Skeleton className="h-7 w-44" />
                </CardHeader>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Skeleton className="h-24 rounded-3xl" />
                  <Skeleton className="h-24 rounded-3xl" />
                </div>
              </Card>
            </div>
          </div>
    </main>
  )
}
