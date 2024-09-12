import { Suspense } from "react"
import Image from "next/image"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Transaction } from "@/types/api"


async function fetchTransactions(address: string, page: number = 1) {
  const response = await fetch(
    `https://d4og4sw4sgogskkc8o0okk8k.keke.ceo/api/moralis/transactions/${address}/${page}`,
    { next: { revalidate: 60 } } // Revalidate every 60 seconds
  )
  if (!response.ok) {
    throw new Error("Failed to fetch transactions")
  }
  return response.json()
}

// transaction details
function TransactionDetails({ hash }: { hash: string }) {
  return (
    <a
      href={`https://etherscan.io/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      className="text-blue-600 hover:underline"
    >
      {hash}
    </a>
  )
}

export default async function TransactionsPage({
  params,
}: {
  params: { address: string }
}) {
  const transactions = await fetchTransactions(params.address)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <div className="grid grid-cols-1 gap-4">
        <Suspense fallback={<TransactionsSkeleton />}>
          {transactions.map((transaction: Transaction) => (
            <TransactionCard key={transaction.hash} transaction={transaction} />
          ))}
        </Suspense>
      </div>
      {transactions.length === 0 && (
        <p className="text-center text-muted-foreground mt-8">
          No transactions found for this address.
        </p>
      )}
    </div>
  )
}

function TransactionCard({ transaction }: { transaction: Transaction }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold truncate">
            <Suspense fallback={<Skeleton className="h-4 w-24" />}>
              <TransactionDetails hash={transaction.hash} />
            </Suspense>
          </h3>
          <Badge
            variant={
              transaction.receiptStatus === 1 ? "default" : "destructive"
            }
          >
            {transaction.receiptStatus === 1 ? "Success" : "Failed"}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-2">
          From: {transaction.from}
        </p>
        <p className="text-sm text-muted-foreground truncate">
          To: {transaction.to}
        </p>
        <div className="flex justify-between items-center mt-2">
          <Badge variant="outline">{transaction.chain}</Badge>
          <p className="text-sm font-medium">
            {parseFloat(transaction.value) / 1e18} ETH
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function TransactionsSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex justify-between items-center mt-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
