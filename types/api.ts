// api/moralis/networth/
export interface ChainNetworth {
  id: number;
  chain: string;
  nativeBalance: number;
  nativeBalanceUsd: number;
  tokenBalanceUsd: number;
  networthUsd: number;
  networthId: number;
}

// net worth
export interface Networth {
  id: number;
  address: string;
  totalNetworthUsd: number;
  createdAt: string;
  updatedAt: string;
  chainNetworths: ChainNetworth[];
}

// api/moralis/tokens

export interface Token {
  id: number;
  address: string;
  value: number;
  tokenId: number;
  updatedAt: string;
  tokenDetails: TokenDetails;
}

export interface TokenDetails {
  id: number;
  contractAddress: string;
  chain: string;
  name: string;
  symbol: string;
  decimals: number;
  logo: string;
  thumbnail: string;
  possibleSpam: boolean;
  createdAt: string;
  updatedAt: string;
  usdPrice: number;
}

// api/moralis/nfts

export interface NFT {
  id: string;
  chain: string;
  contractType: string;
  tokenAddress: string;
  tokenId: string;
  tokenUri: string;
  name: string;
  symbol: string;
  amount: number;
  blockNumber: string;
  ownerOf: string;
  tokenHash: string;
  lastMetadataSync: string;
  lastTokenUriSync: string;
  possibleSpam: boolean;
}


