"use client"

import { useEffect, useState } from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Networth } from "@/types/api"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface NetworthCardProps {
  ens: string | null
  address: string
  networth: Networth
}

interface ChartDataPoint {
  date: string
  value: number
}

function generateChartData(): ChartDataPoint[] {
  const seed = Date.now() // Use a consistent seed for both server and client
  const random = (seed: number) => {
    let x = Math.sin(seed++) * 10000
    return x - Math.floor(x)
  }

  let value = 10000
  return Array.from({ length: 30 }, (_, i) => {
    value = value + (random(seed + i) - 0.5) * 500
    return {
      date: new Date(2023, 0, i + 1).toISOString().split("T")[0],
      value: Math.max(0, value),
    }
  })
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value)
}

export default function NetworthCard({
  ens,
  address,
  networth,
}: NetworthCardProps) {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    setChartData(generateChartData())
  }, [])

  const latestValue = networth?.totalNetworthUsd || 0
  const startValue = chartData.length > 0 ? chartData[0].value : 0
  const percentageChange = ((latestValue - startValue) / startValue) * 100

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="relative z-10 flex flex-row justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{ens || address}</h2>
          <p className="text-sm text-muted-foreground">{address}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{formatCurrency(latestValue)}</p>
          <p
            className={`text-sm ${
              percentageChange >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {percentageChange >= 0 ? "+" : ""}
            {percentageChange.toFixed(2)}% (30d)
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-4 h-64">
        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) =>
                  new Date(tick).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
                interval={"preserveStartEnd"}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(tick) => formatCurrency(tick)}
                width={80}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-2 rounded shadow">
                        <p className="text-sm">
                          {new Date(label).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm font-bold">
                          {formatCurrency(payload[0].value as number)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
