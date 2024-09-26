import { notFound } from "next/navigation"

import TokenDetails from "./token-details"

async function getTokenData(token: string) {
//  (PUBLIC_API_URL env)/api/tokens/0x906CC2Ad139eb6637e28605F908903C8aDCe566A?chain=1
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tokens/${token}&chain=1`
  )
  if (!response.ok) {
    return null
  }
  return response.json()
}

export default async function TokenPage({
  params,
}: {
  params: { token: string }
}) {
  const tokenData = await getTokenData(params.token)

  if (!tokenData) {
    notFound()
  }

  return (
    <div>
      test
      </div>
  )
}
