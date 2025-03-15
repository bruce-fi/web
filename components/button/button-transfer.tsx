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
  toAddress: string;
  addressToken: string;
  amount: string;
  bRefetch: () => void;
  disabled: boolean;
}

export default function ButtonTransfer({
  toAddress,
  addressToken,
  amount,
  bRefetch,
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
      functionName: 'approve',
      args: [address, valueToBigInt(dAmount + 10)],
    },
    {
      address: addressToken,
      abi: MockTokenABI,
      functionName: 'transfer',
      args: [toAddress, valueToBigInt(dAmount)],
    }
  ] as unknown as ContractFunctionParameters[];

  const handleError = useCallback((err: TransactionError) => {
    setError(err);
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback((response: TransactionResponse) => {
    setTransactionData(response);
    setIsModalOpen(true);
    bRefetch();
  }, [bRefetch]);

  const handleStatusChange = useCallback((status: { statusName: string }) => {
    setTransactionStatus(status.statusName);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const buttonText = "Transfer";

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
            className="z-0 group relative text-sm inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 gap-2 w-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover mt-2 rounded-[20px] h-10"
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
        name='swap'
      />
    </div>
  );
}