import React from 'react';
import { WalletComponents } from './wallet';

const WalletConnection = () => {
  return (
    <div className='w-full h-[80vh] flex items-center justify-center p-4'>
      <div className="flex flex-col items-center justify-center gap-2">
        <WalletComponents />
        <p className="text-sm text-default-500">
          Connect your wallet first to access this page!
        </p>
      </div>
    </div>
  );
};

export default WalletConnection;
