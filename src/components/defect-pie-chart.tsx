"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Cell, Pie, PieChart, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Crack", value: 15, color: "#ef4444" },
  { name: "Porosity", value: 45, color: "#1a4d4a" },
  { name: "Undercut", value: 30, color: "#f59e0b" },
  { name: "Slag", value: 20, color: "#64748b" },
]

export function DefectCategoryChart() {
  return (
    <Card className="border-none shadow-sm rounded-2xl w-full lg:w-80">
      <CardHeader className="pb-0">
        <CardTitle className="text-lg font-bold">Defect Category</CardTitle>
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
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-2 rounded-lg shadow-lg border border-muted text-xs font-semibold">
                      <p className="text-foreground">{`${payload[0].name}: ${payload[0].value}%`}</p>
                    </div>
                  )
                }
                return null;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36} 
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
