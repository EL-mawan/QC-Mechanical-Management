"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"

const data = [
  { name: "Scissors", value: 40, color: "#1a4d4a" },
  { name: "Forceps", value: 10, color: "#5eb5a6" },
  { name: "Socks", value: 25, color: "#a7d7cf" },
  { name: "Wounds", value: 20, color: "#d1e9e5" },
]

export function MostSalesChart() {
  return (
    <Card className="border-none shadow-sm rounded-2xl w-full lg:w-80">
      <CardHeader className="flex flex-row items-center justify-between pb-0">
        <CardTitle className="text-xl font-bold">Most Sales</CardTitle>
        <select className="bg-transparent text-sm text-muted-foreground border-none focus:ring-0">
          <option>This Month</option>
          <option>Last Month</option>
        </select>
      </CardHeader>
      <CardContent className="h-[280px] pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '10px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
