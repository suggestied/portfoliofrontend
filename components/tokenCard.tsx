"use client"

import { useState } from "react"
import Image from "next/image"
import { notFound } from "next/navigation"
import {
  AlertTriangleIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  InfoIcon,
} from "lucide-react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { TokenDetails } from "@/types/api"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip as UITooltip,
} from "@/components/ui/tooltip"

export default function TokenCard({ tokenData }: { tokenData: TokenDetails }) {
  const [timeRange, setTimeRange] = useState<"1D" | "1W" | "1M" | "1Y">("1W")

  if (!tokenData) {
    notFound()
  }

  // Simulated historical data for different time ranges
  const historicalData: {
    [key in "1D" | "1W" | "1M" | "1Y"]: { time: string; price: number }[]
  } = {
    "1D": Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      price: tokenData.usdPrice * (1 + (Math.random() - 0.5) * 0.02),
    })),
    "1W": Array.from({ length: 7 }, (_, i) => ({
      time: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      price: tokenData.usdPrice * (1 + (Math.random() - 0.5) * 0.05),
    })),
    "1M": Array.from({ length: 30 }, (_, i) => ({
      time: `Day ${i + 1}`,
      price: tokenData.usdPrice * (1 + (Math.random() - 0.5) * 0.1),
    })),
    "1Y": Array.from({ length: 12 }, (_, i) => ({
      time: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ][i],
      price: tokenData.usdPrice * (1 + (Math.random() - 0.5) * 0.2),
    })),
  }

  const currentPrice = tokenData.usdPrice
  const previousPrice = historicalData[timeRange][0].price
  const priceChange = currentPrice - previousPrice
  const priceChangePercentage = (priceChange / previousPrice) * 100

  return (
    <div className="container mx-auto my-4">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative h-12 w-12">
              <Image
                src={tokenData.logo || "/placeholder.svg?height=48&width=48"}
                alt={`${tokenData.name} logo`}
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <div>
              <CardTitle className="text-2xl flex items-center">
                {tokenData.name} ({tokenData.symbol})
                {tokenData.possibleSpam && (
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <AlertTriangleIcon className="h-5 w-5 text-yellow-500 ml-2" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>This token is flagged as possible spam</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Chain: {tokenData.chain}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CardTitle className="text-3xl font-bold">
              ${currentPrice > 0 ? currentPrice.toFixed(2) : "N/A"}
            </CardTitle>
            <Badge variant={priceChange >= 0 ? "default" : "destructive"}>
              {priceChange >= 0 ? (
                <ArrowUpIcon className="mr-1 h-3 w-3" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3" />
              )}
              {Math.abs(priceChange).toFixed(2)} (
              {Math.abs(priceChangePercentage).toFixed(2)}%)
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="1W" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="1D" onClick={() => setTimeRange("1D")}>
                1D
              </TabsTrigger>
              <TabsTrigger value="1W" onClick={() => setTimeRange("1W")}>
                1W
              </TabsTrigger>
              <TabsTrigger value="1M" onClick={() => setTimeRange("1M")}>
                1M
              </TabsTrigger>
              <TabsTrigger value="1Y" onClick={() => setTimeRange("1Y")}>
                1Y
              </TabsTrigger>
            </TabsList>
            {Object.entries(historicalData).map(([range, data]) => (
              <TabsContent key={range} value={range}>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={data}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <XAxis dataKey="time" />
                    <YAxis />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            ))}
          </Tabs>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contract Address
                </CardTitle>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        The unique address of the token contract on the
                        blockchain
                      </p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-sm font-mono break-all">
                  {tokenData.contractAddress}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Decimals</CardTitle>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The number of decimal places used by the token</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tokenData.decimals}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Created At
                </CardTitle>
                <TooltipProvider>
                  <UITooltip>
                    <TooltipTrigger>
                      <InfoIcon className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The date when this token was added to our database</p>
                    </TooltipContent>
                  </UITooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {new Date(tokenData.createdAt).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
