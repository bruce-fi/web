import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/modal';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { DollarSign, Loader2 } from 'lucide-react';
import { formatUSD } from '@/lib/helper';
import { Link } from '@heroui/link';

interface ModalStakeProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  amount: string;
  setAmount: (value: string) => void;
  tokenName: string;
  isLoading?: boolean;
  maxAmount?: number;
}

const ModalStake = ({
  isOpen,
  onClose,
  onConfirm,
  amount,
  setAmount,
  tokenName,
  isLoading = false,
  maxAmount = 0
}: ModalStakeProps) => {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setAmount(value);
    }
  };

  const isAmountValid = amount !== '' && Number(amount) > 0 && Number(amount) <= maxAmount;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold">Stake {tokenName}</h2>
          <p className="text-sm text-slate-500">Enter the amount you want to stake</p>
        </ModalHeader>
        
        <ModalBody>
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                placeholder="0.00"
                className="pr-16 text-lg"
                startContent={
                  <DollarSign className="text-slate-400 w-4 h-4" />
                }
                endContent={
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">{tokenName}</span>
                  </div>
                }
              />
            </div>
            
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Available to stake:</span>
              <span className="font-medium">
                {formatUSD(maxAmount)} {tokenName}
              </span>
            </div>
            
            <div className="flex gap-2">
              {[25, 50, 75, 100].map((percent) => (
                <Button
                  key={percent}
                  size="sm"
                  variant="flat"
                  className="flex-1"
                  onPress={() => setAmount((maxAmount * (percent / 100)).toString())}
                >
                  {percent}%
                </Button>
              ))}
            </div>

            <p>Goto page faucet if you dont have token by <Link href='/faucet'>click this</Link></p>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="bordered"
            onPress={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            color="primary"
            onPress={onConfirm}
            className="flex-1"
            isDisabled={!isAmountValid || isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              `Stake ${tokenName}`
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ModalStake;