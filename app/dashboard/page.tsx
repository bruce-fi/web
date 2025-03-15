"use client"

import { useAccount } from 'wagmi'
import DashboardComponent from "./_components/DashboardComponent";
import WalletConnection from '@/components/wallet-connection';

export default function Page() {
  const { isConnected } = useAccount();

  return (
    <section id='chat' className='flex-grow flex flex-col items-center justify-center relative'>
      {isConnected ? <DashboardComponent /> : <WalletConnection />}
    </section>
  )
}