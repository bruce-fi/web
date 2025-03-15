import React from 'react';
import { useAccount } from 'wagmi';
import { Switch } from '@heroui/switch';
import { Card, CardBody } from '@heroui/card';
import { useAddressAI } from '@/hooks/query/useAddressAI';
import { Image } from '@heroui/image';
import { motion } from 'framer-motion';
import { Chip } from '@heroui/chip';

const AddressSwitcher = ({ onAddressChange }: { onAddressChange: (address: HexAddress) => void }) => {
  const { address } = useAccount();
  const { addressAI } = useAddressAI();
  const [isAIWallet, setIsAIWallet] = React.useState(false);

  const handleToggle = (checked: boolean) => {
    setIsAIWallet(checked);
    onAddressChange(checked ? addressAI as HexAddress : address as HexAddress);
  };

  return (
    <Card className="w-full max-w-md mx-auto mb-4 bg-background/50">
      <CardBody className="pt-6 flex items-center justify-center flex-col">
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-4">
            <motion.div
              animate={{ filter: isAIWallet ? 'grayscale(100%)' : 'grayscale(0%)' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Image
                src={'/default-avatar.svg'}
                alt={'wallet'}
                className="relative w-12 h-12 rounded-full border-2 border-gray-700 object-cover"
              />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-medium">Main Wallet</span>
              <span className="text-sm text-gray-500">
                {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}
              </span>
            </div>
          </div>

          <div>
            <Switch isSelected={isAIWallet} onValueChange={handleToggle} className="ml-4" />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex flex-col items-end">
              <span className="font-medium">AI Wallet</span>
              <span className="text-sm text-gray-500">
                {addressAI ? `${addressAI.slice(0, 6)}...${addressAI.slice(-4)}` : 'Not available'}
              </span>
            </div>
            <motion.div
              animate={{ filter: isAIWallet ? 'grayscale(0%)' : 'grayscale(100%)' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              <Image
                src={'/default-avatar.svg'}
                alt={'wallet'}
                className="relative w-12 h-12 rounded-full border-2 border-gray-700 object-cover"
              />
            </motion.div>
          </div>
        </div>
        <Chip className="mt-1 flex items-center justify-center" color="primary" size="sm" variant='flat'>
          From {isAIWallet ? 'AI Wallet' : 'Main Wallet'} to {isAIWallet ? 'Main Wallet' : 'AI Wallet'}
        </Chip>
      </CardBody>
    </Card>
  );
};

export default AddressSwitcher;