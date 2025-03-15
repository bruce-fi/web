"use client"

import { useAccount } from 'wagmi'
import GenerateComponent from './_components/GenerateComponent'
import WalletConnection from '@/components/wallet-connection';

export default function Page() {
  const { isConnected } = useAccount();

  return (
    <section id='chat' className='flex-grow flex flex-col items-center justify-center relative'>
      {isConnected ? <GenerateComponent /> : <WalletConnection />}
    </section>
  )
}