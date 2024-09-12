"use client";

import { useEffect, useState } from "react";
import Link from "next/link";



import { Networth } from "@/types/api";
import { siteConfig } from "@/config/site";
import { buttonVariants } from "@/components/ui/button";
import Wallet from "@/components/wallet"

const wallets = ["0x28C6c06298d514Db089934071355E5743bf21d60"]


export default function IndexPage() {
  // wallets

  // Also get all networths from api endpoint
  const [networths, setNetworths] = useState<Networth[]>([])

  // get networth from api
  useEffect(() => {
    const fetchNetworth = async ({ address }: { address: string }) => {
      try {
        const response = await fetch(
          `https://d4og4sw4sgogskkc8o0okk8k.keke.ceo/api/moralis/networth/${address}`
        )
        if (!response.ok) {
          throw new Error("Failed to fetch net worth")
        }
        const data = await response.json()
        // append to networths
        setNetworths((prev) => [...prev, data])
      } catch (err) {
        console.error(err)
      }
    }

    wallets.forEach((address) => fetchNetworth({ address }))
  }, [wallets])

  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="grid gap-6 md:grid-cols-2">
        {wallets.map((address, index) => {
        const networth = networths.find((n) => n.address === address);

        if (!networth) {
          return null
        }

        return <Wallet key={address} address={address} networth={networth} />
      })}
      </div>
    </section>
  )
}
