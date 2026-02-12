"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { month: "Jan", ncr: 12 },
  { month: "Feb", ncr: 15 },
  { month: "Mar", ncr: 8 },
  { month: "Apr", ncr: 10 },
  { month: "May", ncr: 5 },
  { month: "Jun", ncr: 7 },
  { month: "Jul", ncr: 3 },
]

export function NCRTrendChart() {
  return (
    <Card className="border-none shadow-sm rounded-2xl flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">NCR Trend per Month</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1a4d4a] text-white p-2 rounded-lg shadow-lg text-xs font-semibold">
                      <p>{`${payload[0].value} NCRs`}</p>
                    </div>
                  )
                }
                return null;
              }}
            />
            <Line 
              type="monotone" 
              dataKey="ncr" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ r: 4, fill: "#ef4444", strokeWidth: 2, stroke: "#fff" }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
