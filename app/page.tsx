"use client"

import { useEffect, useState } from "react"
import { Plus } from "lucide-react"

import { Networth } from "@/types/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Wallet from "@/components/wallet"

type Wallet = {
  address: string
  category: string
}

export default function WalletManager() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [networths, setNetworths] = useState<Networth[]>([])
  const [newAddress, setNewAddress] = useState("")
  const [newCategory, setNewCategory] = useState("Personal")

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets")
    if (storedWallets) {
      setWallets(JSON.parse(storedWallets))
    }
  }, [])

  useEffect(() => {
    const fetchNetworth = async (address: string) => {
      try {
        const response = await fetch(
          `https://d4og4sw4sgogskkc8o0okk8k.keke.ceo/api/moralis/networth/${address}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch net worth")
        }
        const data = await response.json()
        setNetworths((prev) => [
          ...prev.filter((n) => n.address !== address),
          data,
        ])
      } catch (err) {
        console.error(err)
      }
    }

    wallets.forEach((wallet) => fetchNetworth(wallet.address))
  }, [wallets])

  const addWallet = () => {
    if (newAddress && !wallets.some((w) => w.address === newAddress)) {
      const updatedWallets = [
        ...wallets,
        { address: newAddress, category: newCategory },
      ]
      setWallets(updatedWallets)
      localStorage.setItem("wallets", JSON.stringify(updatedWallets))
      setNewAddress("")
    }
  }

  const deleteWallet = (address: string) => {
    const updatedWallets = wallets.filter((w) => w.address !== address)
    setWallets(updatedWallets)
    localStorage.setItem("wallets", JSON.stringify(updatedWallets))
    setNetworths((prevNetworths) =>
      prevNetworths.filter((n) => n.address !== address)
    )
  }

  const groupedWallets = wallets.reduce((acc, wallet) => {
    if (!acc[wallet.category]) {
      acc[wallet.category] = []
    }
    acc[wallet.category].push(wallet)
    return acc
  }, {} as Record<string, Wallet[]>)

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add New Wallet</CardTitle>
          <CardDescription>
            Enter a wallet address and select a category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Wallet Address"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
            />
            <Select value={newCategory} onValueChange={setNewCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Personal">Personal</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Savings">Savings</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addWallet}>
              <Plus className="mr-2 h-4 w-4" /> Add Wallet
            </Button>
          </div>
        </CardContent>
      </Card>

      {Object.entries(groupedWallets).map(([category, categoryWallets]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle>{category} Wallets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {categoryWallets.map((wallet) => {
                const networth = networths.find(
                  (n) => n.address === wallet.address
                )
                return (
                  <Wallet
                    key={wallet.address}
                    address={wallet.address}
                    networth={networth}
                  />
                )
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}
