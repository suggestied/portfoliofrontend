import { notFound } from "next/navigation"
import TokenCard from "@/components/tokenCard"

async function getTokenData(token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tokens/${token}?chain=1`
  )
  if (!response.ok) {
    return null
  }
  return response.json()
}

interface TokenPageProps {
  params: {
    token: string
  }
}

export default async function TokenPage({ params }: TokenPageProps) {
  const tokenData = await getTokenData(params.token)

  if (!tokenData) {
    notFound()
  }


  return (
    <div className="container mx-auto my-4">
      <TokenCard tokenData={tokenData} />
    </div>
  )
}
