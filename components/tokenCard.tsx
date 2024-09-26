"use client";
import { notFound } from "next/navigation"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenDetails } from "@/types/api"

export default function tokenCard({ tokenData}: { tokenData: TokenDetails }) {
  const data = [
  { date: 'Jan', price: 279.99 },
  { date: 'Feb', price: 289.99 },
  { date: 'Mar', price: 299.99 },
  { date: 'Apr', price: 299.99 },
  { date: 'May', price: 289.99 },
  { date: 'Jun', price: 299.99 },
]
  return (
    <div className="container mx-auto my-4">
      <Card>
        <CardHeader className="flex flex-row justify-between">
          <CardTitle>
            {tokenData.name} ({tokenData.symbol})
          </CardTitle>

          {/* Price */}
          <CardTitle className="text-xl font-bold">
            ${tokenData.usdPrice ? tokenData.usdPrice : "0.00"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid stroke="#f5f5f5" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#ff7300"
                yAxisId={0}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
