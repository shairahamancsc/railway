
"use client"

import * as React from "react"
import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface DesignationChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#3F51B5", "#FF9800", "#4CAF50", "#9C27B0", "#2196F3", "#F44336"];

export function DesignationChart({ data }: DesignationChartProps) {
  if (data.length === 0) {
    return (
        <div className="flex h-[250px] w-full items-center justify-center">
            <p className="text-muted-foreground">No worker data to display.</p>
        </div>
    )
  }

  const chartConfig = data.reduce((acc, item, index) => {
    acc[item.name] = {
      label: item.name,
      color: COLORS[index % COLORS.length]
    }
    return acc
  }, {} as any);

  return (
      <div className="h-[250px] w-full">
         <ChartContainer config={chartConfig} className="min-h-[200px]">
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Tooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={50}
                        strokeWidth={5}
                    >
                         {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
      </div>
  )
}
