import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal'
import React from 'react'

export default function ModalApi({
  isOpen,
  setIsOpen,
  title,
  status,
  data,
  openText,
  processName,
  errorMessage
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  title: string;
  status: string;
  data: string;
  openText: string;
  processName: string;
  errorMessage?: string;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className='pb-5'
    >
      <ModalContent>
        <ModalHeader>
          {title} {status}
        </ModalHeader>
        <ModalBody>
          <span>Your {processName} is {status}, you can see data below:</span>
          {data ? (
            <span>{openText} {data}</span>
          ) : (
            <span>{errorMessage}</span>
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
