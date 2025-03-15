import { Avatar, Name } from '@coinbase/onchainkit/identity';
import { ConnectWallet } from '@coinbase/onchainkit/wallet';
import React from 'react'
import { useAccount } from 'wagmi'

export default function ButtonConnectWallet({
  children
}: {
  children?: React.ReactNode
}) {
  const { isConnected } = useAccount();

  return (
    <>
      {!isConnected ? (
        <>
          <ConnectWallet
            className='z-0 base custom_connect relative text-sm inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 gap-2 w-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover mt-2 rounded-[20px] h-12'
            data-testid="custom_connect_wallet_button"
          >
            <Avatar className="h-6 w-6" />
            <Name className={"text-black dark:text-white"} />
          </ConnectWallet>
        </>
      ) : (
        <>
          {children}
        </>
      )}
    </>
  )
}
