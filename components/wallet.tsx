"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Check, Copy, ExternalLink } from "lucide-react"

import { Networth } from "@/types/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { BrandBinance, CurrencyEthereum, Polygon } from "tabler-icons-react"

interface WalletProps {
  address: string
  networth: Networth | null | undefined
}


// function to get network icon
function getNetworkIcon(chain: string) {
  switch (chain) {
    case "eth":
      return <CurrencyEthereum />
    case "bsc":
      return <BrandBinance />
    case "matic":
      return <Polygon />
  }
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

  const isLoading = networth === null || networth === undefined

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Wallet</CardTitle>
        <div className="flex space-x-2">
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
          <Link href={`/${address}`} passHref>
            <Button
              variant="ghost"
              size="icon"
              aria-label="View wallet details"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-xs text-muted-foreground">Address</p>
            <p className="text-sm font-medium truncate">{address}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total Networth</p>
            {isLoading ? (
              <Skeleton className="h-8 w-32" />
            ) : (
              <p className="text-2xl font-bold">
                {formatCurrency(networth.totalNetworthUsd)}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium">Chain Distribution</p>
            {isLoading ? (
              <>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </>
            ) : (
              networth.chainNetworths &&
              networth.chainNetworths.map((chainNetworth, index) => (
                <div key={chainNetworth.chain} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="flex items-center space-x-1">

                      <div className="bg-blue-500/10 p-1 rounded-full mr-1">
                        {
                          getNetworkIcon(chainNetworth.chain)

                      }
                      </div>
                      {chainNetworth.chain}

                    </span>
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
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
