"use client"

import React, { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Networth } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface WalletProps {
  address: string
  networth: Networth
}

export default function Wallet({ address, networth }: WalletProps) {
  const [copied, setCopied] = useState(false)

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getProgressColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-red-500",
      "bg-purple-500",
      "bg-pink-500",
    ]
    return colors[index % colors.length]
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Wallet</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          aria-label="Copy wallet address"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-sm font-medium truncate">{address}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Networth</p>
            <p className="text-2xl font-bold">
              {formatCurrency(networth.totalNetworthUsd)}
            </p>
          </div>
          {
            networth.chainNetworths && <div className="space-y-2">
            <p className="text-xs font-medium">Chain Distribution</p>
            {networth.chainNetworths.map((chainNetworth, index) => (
              <div key={chainNetworth.chain} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{chainNetworth.chain}</span>
                  <span>{formatCurrency(chainNetworth.networthUsd)}</span>
                </div>
                <Progress
                  value={
                    (chainNetworth.networthUsd / networth.totalNetworthUsd) *
                    100
                  }
                  className={`h-2 ${getProgressColor(index)}`}
                />
              </div>
            ))}
          </div>
          }
        </div>
      </CardContent>
    </Card>
  )
}
