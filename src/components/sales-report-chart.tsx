"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

const data = [
  { name: "Jan", sales: 25 },
  { name: "Feb", sales: 20 },
  { name: "Mar", sales: 40 },
  { name: "Apr", sales: 35 },
  { name: "May", sales: 55 },
  { name: "Jun", sales: 45 },
  { name: "Jul", sales: 52 },
  { name: "Aug", sales: 42 },
  { name: "Sep", sales: 38 },
  { name: "Oct", sales: 38 },
  { name: "Nov", sales: 35 },
  { name: "Dec", sales: 45 },
]

export function SalesReportChart() {
  return (
    <Card className="border-none shadow-sm rounded-2xl flex-1">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold">Sales Report</CardTitle>
        <select className="bg-transparent text-sm text-muted-foreground border-none focus:ring-0">
          <option>Monthly</option>
          <option>Weekly</option>
        </select>
      </CardHeader>
      <CardContent className="h-[300px] w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1a4d4a" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#1a4d4a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickFormatter={(value) => `${value}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1a4d4a] text-white p-2 rounded-lg shadow-lg text-xs font-semibold">
                      <p>{`$${payload[0].value},640`}</p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#1a4d4a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSales)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
