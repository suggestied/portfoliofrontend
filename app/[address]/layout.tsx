"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Line, LineChart, ResponsiveContainer, Tooltip, TooltipProps, XAxis, YAxis } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";



import { Networth } from "@/types/api";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@/components/ui/navigation-menu";





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
  const pathname = usePathname()


// net worth state
  const [networth, setNetworth] = useState<Networth | null>(null)

  // get networth from api
  useEffect(() => {
    const fetchNetworth = async () => {
      try {
        const response = await fetch(
          `https://d4og4sw4sgogskkc8o0okk8k.keke.ceo/api/moralis/networth/${address}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch net worth")
        }
        const data = await response.json()
        setNetworth(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchNetworth()
  }
  , [address])

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

  const latestValue = networth?.totalNetworthUsd || 0
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

  const navItems = [
    { href: `/${address}`, label: "Overview" },
    { href: `/${address}/tokens`, label: "Tokens" },
    { href: `/${address}/nfts`, label: "NFTs" },
    { href: `/${address}/transactions`, label: "Transactions" },
  ]

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

      <NavigationMenu>
        <NavigationMenuList className="flex space-x-4">
          {navItems.map((item) => (
            <NavigationMenuItem key={item.href}>
              <Link href={item.href} passHref legacyBehavior>
                <NavigationMenuLink
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {item.label}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div>{children}</div>
    </div>
  )
}
