"use client"

import { useAccount } from 'wagmi'
import TransactionTabs from "./_components/TransactionTabs";
import WalletConnection from '@/components/wallet-connection';

export default function Page() {
  const { isConnected } = useAccount();

  return (
    <section id='chat' className='flex-grow flex flex-col items-center justify-center relative'>
      {isConnected ? <TransactionTabs /> : <WalletConnection />}
    </section>
  )
}