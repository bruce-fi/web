'use client';

import { OPTIFinanceABI } from '@/lib/abis/OPTIFinanceABI';
import { MockTokenABI } from '@/lib/abis/MockTokenABI';
import { denormalize, valueToBigInt } from '@/lib/bignumber';
import { ADDRESS_OPTIFINANCE } from '@/lib/constants';
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

interface ButtonSwapProps {
  fromToken: { addressToken: string } | null;
  toToken: { addressToken: string } | null;
  bFromRefetch: () => void;
  bToRefetch: () => void;
  validateSwap: () => boolean;
  addressTokenIn: string;
  addressTokenOut: string;
  amount: string;
  decimals: number;
  disabled: boolean;
}

export default function ButtonSwap({
  fromToken,
  toToken,
  bFromRefetch,
  bToRefetch,
  validateSwap,
  addressTokenIn,
  addressTokenOut,
  amount,
  decimals,
  disabled
}: ButtonSwapProps) {
  const [transactionStatus, setTransactionStatus] = useState<string | null>(null);
  const [transactionData, setTransactionData] = useState<TransactionResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<TransactionError | null>(null);

  const dAmount = denormalize(amount || 0, decimals);

  const contracts = [
    {
      address: addressTokenIn,
      abi: MockTokenABI,
      functionName: 'approve',
      args: [ADDRESS_OPTIFINANCE, valueToBigInt(dAmount + 10)],
    },
    {
      address: ADDRESS_OPTIFINANCE,
      abi: OPTIFinanceABI,
      functionName: 'swap',
      args: [addressTokenIn, addressTokenOut, valueToBigInt(dAmount)],
    }
  ] as unknown as ContractFunctionParameters[];

  const handleError = useCallback((err: TransactionError) => {
    setError(err);
    setIsModalOpen(true);
  }, []);

  const handleSuccess = useCallback((response: TransactionResponse) => {
    setTransactionData(response);
    setIsModalOpen(true);
    bFromRefetch();
    bToRefetch();
  }, [bFromRefetch, bToRefetch]);

  const handleStatusChange = useCallback((status: { statusName: string }) => {
    setTransactionStatus(status.statusName);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const buttonText = !fromToken 
    ? 'Select From Token' 
    : !toToken 
    ? 'Select To Token' 
    : !amount 
    ? 'Enter Amount' 
    : validateSwap() 
    ? 'Swap' 
    : 'Insufficient Balance';

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
            className="z-0 group relative text-sm inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 gap-2 w-full [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover mt-2 rounded-[20px] h-12"
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