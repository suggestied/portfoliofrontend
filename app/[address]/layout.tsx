"use client"

import React, { useEffect, useState } from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
  XAxis,
  YAxis,
} from "recharts"
import {
  NameType,
  ValueType,
} from "recharts/types/component/DefaultTooltipContent"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface WalletLayoutProps {
  children: React.ReactNode
  params: {
    address: string
  }
}

interface ChartDataPoint {
  date: string
  value: number
}

export default function WalletLayout({
  children,
  params: { address },
}: WalletLayoutProps) {
  const ens = "suggestied.eth"
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])

  useEffect(() => {
    // Simulating more realistic net worth data over 30 days
    const generateData = (): ChartDataPoint[] => {
      let value = 10000
      return Array.from({ length: 30 }, (_, i) => {
        value = value + (Math.random() - 0.5) * 500
        return {
          date: new Date(2023, 0, i + 1).toISOString().split("T")[0],
          value: Math.max(0, value),
        }
      })
    }
    setChartData(generateData())
  }, [])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const latestValue =
    chartData.length > 0 ? chartData[chartData.length - 1].value : 0
  const startValue = chartData.length > 0 ? chartData[0].value : 0
  const percentageChange = ((latestValue - startValue) / startValue) * 100

  const CustomTooltip: React.FC<TooltipProps<ValueType, NameType>> = ({
    active,
    payload,
    label,
  }) => {
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
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-4 space-y-4">
      <Card className="w-full overflow-hidden">
        <CardHeader className="relative z-10 flex flex-row justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{ens}</h2>
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
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <div>{children}</div>
    </div>
  )
}
