"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Cell } from "recharts"

const data = [
  { name: "Project A", progress: 85 },
  { name: "Project B", progress: 62 },
  { name: "Project C", progress: 45 },
  { name: "Project D", progress: 92 },
  { name: "Project E", progress: 30 },
  { name: "Project F", progress: 78 },
]

export function ProjectProgressChart() {
  return (
    <Card className="border-none shadow-sm rounded-2xl flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold">Progress per Project</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: -20, right: 20 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              axisLine={false} 
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              width={80}
            />
            <Tooltip
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#1a4d4a] text-white p-2 rounded-lg shadow-lg text-xs font-semibold">
                      <p>{`${payload[0].value}% Complete`}</p>
                    </div>
                  )
                }
                return null;
              }}
            />
            <Bar 
              dataKey="progress" 
              radius={[0, 4, 4, 0]} 
              barSize={20}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.progress > 80 ? "#10b981" : entry.progress > 50 ? "#1a4d4a" : "#f59e0b"} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
