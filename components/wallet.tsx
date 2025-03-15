import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet';
import {
  Address,
  Avatar,
  Badge,
  EthBalance,
  Identity,
  Name,
  Socials,
} from '@coinbase/onchainkit/identity';
import { useAccount } from 'wagmi';
import { base } from 'viem/chains';

export function WalletComponents() {
  const { address } = useAccount()

  return (
    <header className="flex">
      <Wallet className='text-black dark:text-white'>
        <ConnectWallet className='bg-transparent border-gray-600 border-1 rounded-full text-sm font-normal p-2 hover:bg-foreground-100/10 duration-200 transition-all text-black dark:text-white'>
          <Avatar className="h-6 w-6" />
          <Name address={address} chain={base} className={"text-black dark:text-white"} />
        </ConnectWallet>
        <WalletDropdown className='ring-1 ring-gray-600'>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick address={address} chain={base}>
            <Avatar />
            <Name>
              <Badge />
            </Name>
            <Address />
            <EthBalance />
            <Socials />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    </header>
  );
}