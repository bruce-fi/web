'use client';

import { MockTokenABI } from '@/lib/abis/MockTokenABI';
import { denormalize, valueToBigInt } from '@/lib/bignumber';
import { DECIMALS_MOCK_TOKEN } from '@/lib/constants';
import {
  Transaction,
  TransactionButton
} from '@coinbase/onchainkit/transaction';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';
import { useCallback, useState } from 'react';
import type { ContractFunctionParameters } from 'viem';
import Loading from '../loader/loading';
import ButtonConnectWallet from './button-connect-wallet';
import ModalTransaction from '../modal/modal-transaction';
import { useAccount } from 'wagmi';

interface ButtonSwapProps {
  bgColor: string;
  addressToken: HexAddress;
  buttonText: string;
  amount: string;
  disabled: boolean;
}

export default function ButtonMint({
  bgColor,
  addressToken,
  buttonText,
  amount,
  disabled
}: ButtonSwapProps) {
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<TransactionError | null>(null);
  const { address } = useAccount();

  const dAmount = denormalize(amount || 0, DECIMALS_MOCK_TOKEN);

  const contracts = [
    {
      address: addressToken,
      abi: MockTokenABI,
      functionName: 'mint',
      args: [address, valueToBigInt(dAmount)],
    }
  ] as unknown as ContractFunctionParameters[];

  const handleError = useCallback((err: TransactionError) => {
    setError(err);
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback((response: TransactionResponse) => {
    setTransactionData(response);
    setIsModalOpen(true);
  }, []);

  const handleStatusChange = useCallback((status: { statusName: string }) => {
    setTransactionStatus(status.statusName);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  return (
    <div>
      {(transactionStatus === "transactionPending" || 
        transactionStatus === "transactionLegacyExecuted") && <Loading />}
      
      <Transaction
        contracts={contracts}
        chainId={84532}
        onError={handleError}
        onSuccess={handleSuccess}
        onStatus={handleStatusChange}
      >
        <ButtonConnectWallet>
          <TransactionButton
            className={`${bgColor} h-14 min-h-14 z-0 group w-full text-sm relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none text-default-foreground data-[hover=true]:opacity-hover flex-1`}
            text={buttonText}
            disabled={disabled}
          />
        </ButtonConnectWallet>
      </Transaction>

      <ModalTransaction
        isOpen={isModalOpen}
        setIsOpen={closeModal}
        status={transactionStatus || ""}
        data={transactionData || { transactionReceipts: [] }}
        errorMessage={error || undefined}
        name='mint'
      />
    </div>
  );
}