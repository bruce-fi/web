import React, { useCallback, useState } from 'react';
import { Card, CardHeader, CardBody } from '@heroui/card';
import { useCurAccount } from '@/hooks/query/useCurAccount';
import { Image } from '@heroui/image';
import { Skeleton } from '@heroui/skeleton';
import { Button } from '@heroui/button';
import { CheckCircle, Copy, ExternalLink, Wallet } from 'lucide-react';
import { Chip } from '@heroui/chip';
import { WalletComponents } from '../wallet';
import ModalListToken from '../modal/modal-list-token';
import { useCurAIAccount } from '@/hooks/query/useCurAIAccount';
import { truncateAddress } from '@/lib/helper';
import ModalListTokenAI from '../modal/modal-list-token-ai';

export default function CardPortfolio({
  isAIWallet,
  setIsAIWallet
}: {
  isAIWallet: boolean
  setIsAIWallet: (value: boolean) => void
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isModalOpenAI, setIsModalOpenAI] = useState<boolean>(false);
  const [copied, setCopied] = useState(false);

  const {
    curAddress,
    curAvatar,
    curName,
    isDisconnected,
    isLoading: isAccountLoading
  } = useCurAccount();

  const {
    curAddressAI,
    curAvatarAI,
    isLoadingAI: isAccountLoadingAI
  } = useCurAIAccount();

  const handleCopyAddress = () => {
    const addressToCopy = isAIWallet ? curAddressAI : curAddress;
    if (addressToCopy) {
      navigator.clipboard.writeText(addressToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getAddressDisplay = () => {
    const addressToDisplay = isAIWallet ? curAddressAI : curAddress;
    if (!addressToDisplay) return '';
    return `${addressToDisplay.slice(0, 6)}...${addressToDisplay.slice(-4)}`;
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const closeModalAI = useCallback(() => {
    setIsModalOpenAI(false);
  }, []);

  const handleSwitchWallet = () => {
    setIsAIWallet(!isAIWallet);
  };

  if (isAccountLoading || isAccountLoadingAI) {
    return (
      <Card className="w-full bg-background/50 p-10 gap-10">
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-2 flex-1">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`w-full bg-background/50 overflow-hidden`}>
      <CardBody className="relative p-6 items-center flex justify-center">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl" />

        <div className="flex flex-col gap-6 items-center max-w-sm">
          {!isDisconnected && (
            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-75 blur group-hover:opacity-100 transition duration-300" />
                <Image
                  src={isAIWallet ? (curAvatarAI || "/default-avatar.svg") : (curAvatar || "/default-avatar.svg")}
                  alt={isAIWallet ? curAddressAI : curName}
                  className="relative w-24 h-24 rounded-full border-2 border-gray-700 object-cover"
                />
              </div>

              <div className="text-center">
                <CardHeader className="p-0">
                  <h3 className="text-2xl font-bold text-white">
                    {isAIWallet ? truncateAddress(curAddressAI) : curName || truncateAddress(curAddress as HexAddress)}
                  </h3>
                </CardHeader>
                <span className={`inline-flex items-center px-3 py-1 mt-2 rounded-full text-sm font-medium ${isDisconnected
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  }`}>
                  {isDisconnected ? 'Disconnected' : 'Connected'}
                </span>
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col gap-4">
            {isDisconnected ? (
              <WalletComponents />
            ) : (
              <div className="space-y-4 max-w-[250px] sm:max-w-none">
                <div className="p-4 rounded-xl bg-transparent border-1 border-gray-700">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <span className="text-sm text-gray-400">Wallet Address</span>
                    <div className="flex items-center gap-2">
                      <Chip variant="flat" color="primary" size="sm">
                        {getAddressDisplay()}
                      </Chip>
                      <Button
                        variant="bordered"
                        size="sm"
                        onPress={handleCopyAddress}
                        className="text-gray-400 hover:text-white rounded-full min-w-10 min-h-10"
                      >
                        {copied ? (
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="bordered"
                        size="sm"
                        onPress={() =>
                          window.open(
                            `https://basescan.org/address/${isAIWallet ? curAddressAI : curAddress}`,
                            '_blank'
                          )
                        }
                        className="text-gray-400 hover:text-white rounded-full min-w-10 min-h-10"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-transparent border-1 border-gray-700">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2">
                    <span className="text-sm text-gray-400">List Token</span>
                    <div className="flex items-center gap-2">
                      <Button
                        color='primary'
                        variant='flat'
                        size='sm'
                        className="w-full"
                        onPress={isAIWallet ? () => setIsModalOpenAI(true) : () => setIsModalOpen(true)}
                      >
                        View Token
                      </Button>
                    </div>
                  </div>
                </div>

                <ModalListTokenAI
                  isOpen={isModalOpenAI}
                  setIsOpen={closeModalAI}
                />

                <ModalListToken
                  isOpen={isModalOpen}
                  setIsOpen={closeModal}
                />

                <Button
                  color='primary'
                  variant='solid'
                  size='lg'
                  className="w-full flex items-center gap-2"
                  onPress={handleSwitchWallet}
                >
                  <Wallet className="h-4 w-4" />
                  {isAIWallet ? 'Switch to Main Wallet' : 'Switch to AI Wallet'}
                </Button>
                <span className='break-words text-sm'>Note: Switch to AI Wallet to see your staking data.</span>
              </div>
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
}