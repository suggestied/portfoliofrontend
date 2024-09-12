import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface WalletLayoutProps {
  children: React.ReactNode,
  params: {
    address: string
  }
}

export default function WalletLayout({ children, params: { address } }: WalletLayoutProps) {
  const ens = "suggestied.eth"
  return <div className="flex flex-col">
    <div className="flex-1 p-2">
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">{ens}</h2>
          <p className="text-sm text-gray-500">{address}</p>
        </CardHeader>

      </Card>
    </div>
    <div>
      {children}
    </div>
  </div>
}
