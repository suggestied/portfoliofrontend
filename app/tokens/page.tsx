import { notFound } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table"
import Link from "next/link"
import { TokenDetails } from "@/types/api"


async function getTokensData(): Promise<TokenDetails[] | null> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/tokens`
  )
  if (!response.ok) {
    return null
  }
  return response.json()
}

export default async function TokenPage() {
  const tokensData = await getTokensData()

  if (!tokensData) {
    notFound()
  }

  return (
    <div>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Possible Spam</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tokensData.map((token: TokenDetails) => (

                <TableRow key={token.contractAddress}>
                   <Link
              key={token.id}
              href={`/tokens/${token.contractAddress}`}
              >
              <TableCell>{token.name}</TableCell>
            </Link>

              <TableCell>{token.symbol}</TableCell>
              <TableCell>{token.possibleSpam ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
