"use client"
import Link from "next/link"

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"

interface WalletNavigationProps {
  address: string
}

export default function WalletNavigation({ address }: WalletNavigationProps) {
  const navItems = [
    { href: `/${address}`, label: "Overview" },
    { href: `/${address}/tokens`, label: "Tokens" },
    { href: `/${address}/nfts`, label: "NFTs" },
    { href: `/${address}/transactions`, label: "Transactions" },
  ]

  return (
    <NavigationMenu>
      <NavigationMenuList className="flex space-x-4">
        {navItems.map((item) => (
          <NavigationMenuItem key={item.href}>
            <Link href={item.href} passHref legacyBehavior>
              <NavigationMenuLink className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground">
                {item.label}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}
