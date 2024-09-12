"use client";

import { useEffect, useState } from "react";



import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";





interface Token {
  id: number
  address: string
  value: number
  tokenId: number
  updatedAt: string
  tokenDetails: TokenDetails
}

interface TokenDetails {
  id: number
  contractAddress: string
  chain: string
  name: string
  symbol: string
  decimals: number
  logo: string
  thumbnail: string
  possibleSpam: boolean
  createdAt: string
  updatedAt: string
  usdPrice: number
}

export default function TokensPage({
  params,
}: {
  params: { address: string }
}) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch(
          `https://d4og4sw4sgogskkc8o0okk8k.keke.ceo/api/moralis/tokens/${params.address}/1`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch tokens")
        }
        const data = await response.json()
        setTokens(data)
      } catch (err) {
        setError("Failed to load tokens. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTokens()
  }, [params.address])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  }

  const formatTokenAmount = (value: number, decimals: number): string => {
    return (value / Math.pow(10, decimals)).toFixed(4)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        Loading tokens...
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Token</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Chain</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token) => (
              <TableRow key={token.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={token.tokenDetails.thumbnail}
                        alt={token.tokenDetails.name}
                      />
                      <AvatarFallback>
                        {token.tokenDetails.symbol}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{token.tokenDetails.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {token.tokenDetails.symbol}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {formatTokenAmount(token.value, token.tokenDetails.decimals)}{" "}
                  {token.tokenDetails.symbol}
                </TableCell>
                <TableCell>
                  {formatCurrency(token.value * token.tokenDetails.usdPrice)}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{token.tokenDetails.chain}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
