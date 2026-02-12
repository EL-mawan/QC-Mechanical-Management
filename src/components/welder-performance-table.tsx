"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

const welders = [
  {
    name: "John Doe",
    totalWelds: 150,
    rejectedWelds: 5,
    repairRate: 3.3,
    performance: 95,
  },
  {
    name: "Jane Smith",
    totalWelds: 120,
    rejectedWelds: 12,
    repairRate: 10.0,
    performance: 82,
  },
  {
    name: "Bob Wilson",
    totalWelds: 200,
    rejectedWelds: 2,
    repairRate: 1.0,
    performance: 98,
  },
  {
    name: "Alex Brown",
    totalWelds: 95,
    rejectedWelds: 8,
    repairRate: 8.4,
    performance: 85,
  },
]

export function WelderPerformanceTable() {
  return (
    <Card className="border-none shadow-sm rounded-2xl mx-6 mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold">Welder Performance</CardTitle>
        <Button variant="ghost" size="sm" asChild className="text-[#1a4d4a] font-bold">
          <a href="/dashboard/master/welders">View Management</a>
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Welder Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Total Welds</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Rejected</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Repair Rate</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase w-[200px]">Performance Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {welders.map((welder) => (
              <TableRow key={welder.name} className="hover:bg-muted/50 border-none">
                <TableCell className="font-medium">{welder.name}</TableCell>
                <TableCell>{welder.totalWelds}</TableCell>
                <TableCell className="text-red-500 font-medium">{welder.rejectedWelds}</TableCell>
                <TableCell className={welder.repairRate > 5 ? "text-orange-600 font-semibold" : "text-emerald-600 font-semibold"}>
                  {welder.repairRate}%
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={welder.performance} className="h-2 flex-1" />
                    <span className="text-xs font-bold">{welder.performance}%</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
