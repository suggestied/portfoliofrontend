"use client"

import { useEffect, useState } from "react"
import { ArrowUpDown, Search, X } from "lucide-react"
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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

type SortKey = "name" | "value" | "price"
type SortOrder = "asc" | "desc"

export default function TokensPage({
  params,
}: {
  params: { address: string }
}) {
  const [tokens, setTokens] = useState<Token[]>([])
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortKey, setSortKey] = useState<SortKey>("value")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [chainFilter, setChainFilter] = useState<string>("all")

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
        setFilteredTokens(data)
      } catch (err) {
        setError("Failed to load tokens. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTokens()
  }, [params.address])

  useEffect(() => {
    const filtered = tokens.filter(
      (token) =>
        (token.tokenDetails.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
          token.tokenDetails.symbol
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) &&
        (chainFilter === "all" || token.tokenDetails.chain === chainFilter)
    )
    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === "name") {
        return sortOrder === "asc"
          ? a.tokenDetails.name.localeCompare(b.tokenDetails.name)
          : b.tokenDetails.name.localeCompare(a.tokenDetails.name)
      } else if (sortKey === "value") {
        const aValue = a.value * a.tokenDetails.usdPrice
        const bValue = b.value * b.tokenDetails.usdPrice
        return sortOrder === "asc" ? aValue - bValue : bValue - aValue
      } else {
        return sortOrder === "asc"
          ? a.tokenDetails.usdPrice - b.tokenDetails.usdPrice
          : b.tokenDetails.usdPrice - a.tokenDetails.usdPrice
      }
    })
    setFilteredTokens(sorted)
  }, [tokens, searchTerm, sortKey, sortOrder, chainFilter])

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)
  }

  const formatTokenAmount = (value: number, decimals: number): string => {
    const amount = value
    return amount.toLocaleString()
  }

  const pieChartData = tokens.map((token) => ({
    name: token.tokenDetails.symbol,
    value: token.value * token.tokenDetails.usdPrice,
  }))

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82CA9D",
    "#A4DE6C",
    "#D0ED57",
    "#FFA07A",
    "#20B2AA",
    "#B0C4DE",
    "#DDA0DD",
  ]

  const uniqueChains = Array.from(
    new Set(tokens.map((token) => token.tokenDetails.chain))
  )

  if (error) {
    return (
      <Card className="m-4">
        <CardContent className="pt-6">
          <div className="text-red-500 text-center">{error}</div>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col md:flex-row gap-4">
        <Card className="w-full md:w-1/2">
          <CardHeader>
            <CardTitle>Token Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-[200px] w-[200px] rounded-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value))}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="w-full md:w-1/2">
          <CardHeader className="h-min">
            <CardTitle>Token Search and Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Search className="text-muted-foreground" />
                <Input
                  placeholder="Search tokens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSearchTerm("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={sortKey}
                  onValueChange={(value: SortKey) => setSortKey(value)}
                >
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="value">Value</SelectItem>
                    <SelectItem value="price">Price</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  onClick={() =>
                    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                  }
                  className="flex-grow"
                >
                  <ArrowUpDown className="mr-2 h-4 w-4" />
                  {sortOrder === "asc" ? "Ascending" : "Descending"}
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={chainFilter}
                  onValueChange={(value: string) => setChainFilter(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Filter by chain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Chains</SelectItem>
                    {uniqueChains.map((chain) => (
                      <SelectItem key={chain} value={chain}>
                        {chain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tokens ({filteredTokens.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Chain</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div>
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-3 w-[60px] mt-1" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[80px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-6 w-[60px]" />
                      </TableCell>
                    </TableRow>
                  ))
                : filteredTokens.map((token) => (
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
                        {formatTokenAmount(
                          token.value,
                          token.tokenDetails.decimals
                        )}{" "}
                        {token.tokenDetails.symbol}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(token.tokenDetails.usdPrice)}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(
                          token.value * token.tokenDetails.usdPrice
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {token.tokenDetails.chain}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
