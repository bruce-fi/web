import { Button } from '@heroui/button'
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal'
import { Image } from '@heroui/image'
import React from 'react'
import { useStaking } from '@/hooks/query/useStaking'
import { DECIMALS_MOCK_TOKEN } from '@/lib/constants'
import { useAccountBalanceAI } from '@/hooks/query/useAccountBalanceAI'

export default function ModalListTokenAI({
  isOpen,
  setIsOpen
}: {
  isOpen: boolean;
  setIsOpen: () => void;
}) {
  const { sData } = useStaking();

  const mockUSDC = sData?.find((pool) => pool.nameToken === 'USDC') ?? null;
  const mockUSDT = sData?.find((pool) => pool.nameToken === 'USDT') ?? null;
  const mockDAI = sData?.find((pool) => pool.nameToken === 'DAI') ?? null;
  const mockWETH = sData?.find((pool) => pool.nameToken === 'WETH') ?? null;
  const mockUNI = sData?.find((pool) => pool.nameToken === 'UNI') ?? null;

  const { bNormalized: bnUSDC } = useAccountBalanceAI({ token: mockUSDC?.addressToken as HexAddress, decimal: DECIMALS_MOCK_TOKEN });
  const { bNormalized: bnUSDT } = useAccountBalanceAI({ token: mockUSDT?.addressToken as HexAddress, decimal: DECIMALS_MOCK_TOKEN });
  const { bNormalized: bnDAI } = useAccountBalanceAI({ token: mockDAI?.addressToken as HexAddress, decimal: DECIMALS_MOCK_TOKEN });
  const { bNormalized: bnWETH } = useAccountBalanceAI({ token: mockWETH?.addressToken as HexAddress, decimal: DECIMALS_MOCK_TOKEN });
  const { bNormalized: bnUNI } = useAccountBalanceAI({ token: mockUNI?.addressToken as HexAddress, decimal: DECIMALS_MOCK_TOKEN });

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      className='pb-5'
    >
      <ModalContent>
        <ModalHeader>
          List Token
        </ModalHeader>
        <ModalBody>
          <div className='flex flex-col gap-4 w-full'>
            <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between gap-2 border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700/50 p-2 flex items-center justify-center group-hover:bg-gray-700 transition-all">
                  <Image
                    src={mockUSDC?.logo}
                    alt={`${mockUSDC?.nameToken} logo`}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-300">{mockUSDC?.nameToken}</span>
                  <span className="text-xs text-gray-500">Token</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-white">
                  {bnUSDC ? Number(bnUSDC).toFixed(2) : '0.0000'}
                </span>
                <span className="text-xs text-gray-500">Balance</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between gap-2 border border-gray-700 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700/50 p-2 flex items-center justify-center group-hover:bg-gray-700 transition-all">
                  <Image
                    src={mockUSDT?.logo}
                    alt={`${mockUSDT?.nameToken} logo`}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-300">{mockUSDT?.nameToken}</span>
                  <span className="text-xs text-gray-500">Token</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-white">
                  {bnUSDT ? Number(bnUSDT).toFixed(2) : '0.0000'}
                </span>
                <span className="text-xs text-gray-500">Balance</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between gap-2 border border-gray-700 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700/50 p-2 flex items-center justify-center group-hover:bg-gray-700 transition-all">
                  <Image
                    src={mockDAI?.logo}
                    alt={`${mockDAI?.nameToken} logo`}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-300">{mockDAI?.nameToken}</span>
                  <span className="text-xs text-gray-500">Token</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-white">
                  {bnDAI ? Number(bnDAI).toFixed(2) : '0.0000'}
                </span>
                <span className="text-xs text-gray-500">Balance</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between gap-2 border border-gray-700 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700/50 p-2 flex items-center justify-center group-hover:bg-gray-700 transition-all">
                  <Image
                    src={mockWETH?.logo}
                    alt={`${mockWETH?.nameToken} logo`}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-300">{mockWETH?.nameToken}</span>
                  <span className="text-xs text-gray-500">Token</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-white">
                  {bnWETH ? Number(bnWETH).toFixed(2) : '0.0000'}
                </span>
                <span className="text-xs text-gray-500">Balance</span>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-4 flex items-center justify-between gap-2 border border-gray-700 hover:border-blue-500/50 transition-all group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-700/50 p-2 flex items-center justify-center group-hover:bg-gray-700 transition-all">
                  <Image
                    src={mockUNI?.logo}
                    alt={`${mockUNI?.nameToken} logo`}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-300">{mockUNI?.nameToken}</span>
                  <span className="text-xs text-gray-500">Token</span>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-lg font-bold text-white">
                  {bnUNI ? Number(bnUNI).toFixed(2) : '0.0000'}
                </span>
                <span className="text-xs text-gray-500">Balance</span>
              </div>
            </div>
          </div>
          <Button
            onPress={setIsOpen}
            className='mt-4'
          >
            Close
          </Button>
        </ModalBody>
      </ModalContent >
    </Modal >
  )
}