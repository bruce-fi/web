import { Button } from '@heroui/button'
import { Modal, ModalBody, ModalContent, ModalHeader } from '@heroui/modal'
import React from 'react'
import { Snippet } from '@heroui/snippet'
import Link from 'next/link';
import { urlSepoliaBasescan } from '@/lib/utils';

export default function ModalTransactionCustom({
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
  data: string;
  name: string;
  errorMessage?: string
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
              <span>Your transaction getting error: {errorMessage && errorMessage}</span>
            </>
          ) : (
            <>
              <span>Your {name} is {status}, you can see transaction hash below:</span>
              <span className='text-center'>Transaction Hash:</span>
                <Snippet variant='flat' color="success" hideSymbol className='line-clamp-1 w-auto'>
                  {data && data.length > 20 ? `${data.substring(0, 30)}...` : data}
                </Snippet>
              <Link
                href={urlSepoliaBasescan({ address: data && data, type: 'transaction'})}
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
    </Modal>
  )
}
