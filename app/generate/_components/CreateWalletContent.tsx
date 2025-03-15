import Loading from '@/components/loader/loading';
import ModalApi from '@/components/modal/modal-api';
import { useCreateWalletAI } from '@/hooks/mutation/api/useCreateWalletAI'
import { Button } from '@heroui/button'
import { Snippet } from '@heroui/snippet';
import React, { useCallback } from 'react'
import { useAccount } from 'wagmi'

export default function CreateWalletContent({
  addressAI
}: {
  addressAI: HexAddress
}) {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const { address } = useAccount();

  const { mutation: mCreateWallet, result: rCreateWallet } = useCreateWalletAI()

  const handleCreate = () => {
    mCreateWallet.mutate({
      user_address: address as string
    })
  }

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal">
        You need to create a wallet AI first to automate the staking.
      </p>
      {addressAI ? (
        <Snippet
          variant='flat'
          color='primary'
          className='w-fit'
          title="Your Wallet Address"
          hideSymbol
          onCopy={() => setIsModalOpen(true)}
        >
          {addressAI.toString()}
        </Snippet>
      ) : (
        <Button
          type="button"
          className="w-fit transition-colors"
          variant="solid"
          color="primary"
          disabled={mCreateWallet.isPending || mCreateWallet.isSuccess}
          onPress={handleCreate}
        >
          {mCreateWallet.isSuccess ? "Wallet Created" : "Create Wallet"}
        </Button>
      )}
      <ModalApi
        isOpen={isModalOpen}
        setIsOpen={closeModal}
        title="Create Wallet"
        status={mCreateWallet.status}
        data={rCreateWallet?.address || ""}
        openText="Your wallet address is:"
        processName="wallet"
      />
      {mCreateWallet.isPending && (<Loading />)}
    </div>
  )
}
