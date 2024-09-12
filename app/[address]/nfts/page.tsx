"use client"

import { useEffect, useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface NFT {
  id: string
  chain: string
  contractType: string
  tokenAddress: string
  tokenId: string
  tokenUri: string
  name: string
  symbol: string
  amount: number
  blockNumber: string
  ownerOf: string
  tokenHash: string
  lastMetadataSync: string
  lastTokenUriSync: string
  possibleSpam: boolean
}

export default function NFTsPage({ params }: { params: { address: string } }) {
  const [nfts, setNFTs] = useState<NFT[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const response = await fetch(
          `https://d4og4sw4sgogskkc8o0okk8k.keke.ceo/api/moralis/nfts/${params.address}/1`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch NFTs")
        }
        const data = await response.json()
        setNFTs(data)
      } catch (err) {
        setError("Failed to load NFTs. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchNFTs()
  }, [params.address])

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <Skeleton className="h-48 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">NFTs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {nfts.map((nft) => (
          <Card key={nft.id}>
            <CardContent className="p-4">
              <div className="aspect-square mb-2 overflow-hidden rounded-lg">
                <img
                  src={nft.tokenUri || "/placeholder.svg"}
                  alt={nft.name || "NFT"}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg"
                  }}
                />
              </div>
              <h3 className="font-semibold truncate">
                {nft.name || "Unnamed NFT"}
              </h3>
              <p className="text-sm text-muted-foreground truncate">
                {nft.symbol}
              </p>
              <div className="flex justify-between items-center mt-2">
                <Badge variant="outline">{nft.chain}</Badge>
                {nft.possibleSpam && (
                  <Badge variant="destructive">Possible Spam</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {nfts.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No NFTs found for this address.
        </p>
      )}
    </div>
  )
}
