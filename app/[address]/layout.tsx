import { ethers } from "ethers"

import { Networth } from "@/types/api"

import NetworthCard from "./networth-card"
import WalletNavigation from "./wallet-navigation"

interface WalletLayoutProps {
  children: React.ReactNode
  params: {
    address: string
  }
}

// using env INFURA_API_KEY
const provider = new ethers.InfuraProvider(
  "mainnet",
  process.env.INFURA_API_KEY
)

async function fetchNetworth(address: string): Promise<Networth> {
  const response = await fetch(
    `https://d4og4sw4sgogskkc8o0okk8k.keke.ceo/api/moralis/networth/${address}`
  )
  if (!response.ok) {
    throw new Error("Failed to fetch net worth")
  }
  return response.json()
}

export default async function WalletLayout({
  children,
  params: { address },
}: WalletLayoutProps) {
  let ens = await provider.lookupAddress(address)
  const shortAddress = address.slice(0, 6) + "..." + address.slice(-4)

  const networth = await fetchNetworth(address)

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-4 space-y-4">
      <NetworthCard ens={
        ens ? ens : shortAddress
      } address={address} networth={networth} />
      <WalletNavigation address={address} />
      <div>{children}</div>
    </div>
  )
}
