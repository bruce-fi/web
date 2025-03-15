import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal'
import React from 'react'
import { Snippet } from '@heroui/snippet'
import Link from 'next/link';
import { urlSepoliaBasescan } from '@/lib/utils';
import type {
  TransactionError,
  TransactionResponse,
} from '@coinbase/onchainkit/transaction';

export default function ModalTransaction({
  isOpen,
  setIsOpen,
  status,
  data,
  name,
  errorMessage
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  status: string;
  data: TransactionResponse;
  name: string;
  errorMessage?: TransactionError
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className='pb-5'
    >
      <ModalContent>
        <ModalHeader>
          Transaction {status}
        </ModalHeader>
        <ModalBody>
          {errorMessage ? (
            <>
              <span>Your transaction getting error: {errorMessage && errorMessage?.error && errorMessage?.error.shortMessage && errorMessage?.error.shortMessage}</span>
            </>
          ) : (
            <>
              <span>Your {name} is {status}, you can see transaction hash below:</span>
              <span className='text-center'>Transaction Hash:</span>
              {data && data?.transactionReceipts.map((tx: { transactionHash: string }, idx: number) => (
                <Snippet variant='flat' color="success" hideSymbol className='line-clamp-1 w-auto' key={idx}>
                  {tx && tx.transactionHash.length > 20 ? `${tx?.transactionHash.substring(0, 30)}...` : tx?.transactionHash}
                </Snippet>
              ))}
              <Link
                href={urlSepoliaBasescan({ address: data && data?.transactionReceipts[0]?.transactionHash, type: 'transaction' })}
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-1 cursor-pointer text-sm text-center'
              >
                view on basescan
              </Link>
            </>
          )}
          <Button
            onPress={setIsOpen}
            className='mt-4'
          >
            Close
          </Button>
        </ModalBody>
      </ModalContent>
    </Modal >
  )
}
