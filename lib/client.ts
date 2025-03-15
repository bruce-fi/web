import { http, createPublicClient, custom } from 'viem';
import { createWalletClient } from 'viem'

import { baseSepolia } from 'viem/chains';

export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(process.env.NEXT_PUBLIC_RPC_URL_BASE_SEPOLIA),
});

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: custom(window.ethereum)
})