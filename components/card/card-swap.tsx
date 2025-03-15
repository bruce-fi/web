"use client"

import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowDownUp,
  ChevronDown
} from 'lucide-react';
import { Button } from '@heroui/button';
import { Modal, ModalContent, ModalHeader, ModalBody } from '@heroui/modal';
import { Avatar } from '@heroui/avatar';
import { Card, CardBody } from '@heroui/card';
import { useStaking } from '@/hooks/query/useStaking';
import { useAccountBalance } from '@/hooks/query/useAccountBalance';
import ButtonSwap from '../button/button-swap';

interface Token {
  idProtocol: string;
  addressToken: string;
  nameToken: string;
  logo: string;
  apy: number;
  chain: string;
}

const SwapCard: React.FC = () => {
  const { sData } = useStaking();

  const [fromToken, setFromToken] = useState<Token | null>(sData && sData[0] ? sData[0] : null);
  const [toToken, setToToken] = useState<Token | null>(sData && sData[1] ? sData[1] : null);
  const [fromAmount, setFromAmount] = useState<string>('');
  const [isTokenModalOpen, setIsTokenModalOpen] = useState<'from' | 'to' | null>(null);

  useEffect(() => {
    if (sData && sData.length >= 2) {
      setFromToken(sData[0]);
      setToToken(sData[1]);
    }
  }, [sData]);

  const { bNormalized: bFrom, bRefetch: bFromRefetch } = useAccountBalance({
    token: fromToken?.addressToken as HexAddress,
    decimal: 6
  });
  const { bNormalized: bTo, bRefetch: bToRefetch } = useAccountBalance({
    token: toToken?.addressToken as HexAddress,
    decimal: 6
  });

  useEffect(() => {
    if (fromToken) bFromRefetch();
    if (toToken) bToRefetch();
  }, [fromToken, toToken, bFromRefetch, bToRefetch]);

  const handleTokenSelect = (token: Token) => {
    if (isTokenModalOpen === 'from') {
      if (token.idProtocol !== toToken?.idProtocol) {
        setFromToken(token);
      }
    } else if (isTokenModalOpen === 'to') {
      if (token.idProtocol !== fromToken?.idProtocol) {
        setToToken(token);
      }
    }
    setIsTokenModalOpen(null);
  };

  const swapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const estimatedOutput = useMemo(() => {
    if (!fromAmount || !fromToken || !toToken) return '';

    const convertedAmount = (
      parseFloat(fromAmount)
    ).toFixed(6);

    return convertedAmount;
  }, [fromAmount, fromToken, toToken]);

  const validateSwap = () => {
    const fromBalance = parseFloat(bFrom?.toString() || '0');
    const fromAmountNum = parseFloat(fromAmount || '0');

    return (
      !!fromToken &&
      !!toToken &&
      !!fromAmount &&
      fromAmountNum > 0 &&
      fromAmountNum <= fromBalance
    );
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="p-0.2 rounded-[20px] bg-background/50">
        <CardBody>
          <div className='flex flex-col relative gap-2'>
            <div className="p-5 py-7 rounded-[20px] border-1 border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <div className='flex flex-col items-start'>
                  <span className='text-gray-400'>Sell</span>
                  <input
                    type="string"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*\.?\d*$/.test(value)) {
                        setFromAmount(value);
                      }
                    }}
                    className="text-2xl font-bold w-full bg-transparent outline-none py-2"
                  />
                  <span className="text-right text-sm text-gray-500">
                    Balance: {bFrom || '0.00'}
                  </span>
                </div>
                <Button
                  variant="faded"
                  onPress={() => setIsTokenModalOpen('from')}
                >
                  {fromToken ? (
                    <div className="flex items-center">
                      <Avatar
                        src={fromToken.logo}
                        alt={fromToken.nameToken}
                        className="w-6 h-6 mr-2"
                      />
                      {fromToken.nameToken}
                    </div>
                  ) : (
                    'Select Token'
                  )}
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </div>
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full z-10 p-1">
              <Button
                isIconOnly
                variant="solid"
                onPress={swapTokens}
                className="rounded-2xl p-2 w-12 h-12 min-w-12 bg-background"
              >
                <ArrowDownUp size={20} />
              </Button>
            </div>

            <div className="p-5 py-7 rounded-[20px] border-1 border-gray-600">
              <div className="flex justify-between items-center mb-2">
                <div className='flex flex-col items-start'>
                  <span className='text-gray-400'>Buy</span>
                  <input
                    type="string"
                    placeholder="0.00"
                    value={estimatedOutput}
                    readOnly
                    className="text-2xl font-bold w-full bg-transparent outline-none py-2"
                  />
                  <span className="text-right text-sm text-gray-500">
                    Balance: {bTo || '0.00'}
                  </span>
                </div>
                <Button
                  variant="faded"
                  onPress={() => setIsTokenModalOpen('to')}
                >
                  {toToken ? (
                    <div className="flex items-center">
                      <Avatar
                        src={toToken.logo}
                        alt={toToken.nameToken}
                        className="w-6 h-6 mr-2"
                      />
                      {toToken.nameToken}
                    </div>
                  ) : (
                    'Select Token'
                  )}
                  <ChevronDown size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </div>

          <ButtonSwap
            fromToken={fromToken as Token}
            toToken={toToken as Token}
            bFromRefetch={bFromRefetch}
            bToRefetch={bToRefetch}
            validateSwap={validateSwap}
            addressTokenIn={fromToken?.addressToken as string}
            addressTokenOut={toToken?.addressToken as string}
            amount={fromAmount}
            decimals={6}
            disabled={!validateSwap()}
          />
        </CardBody>
      </Card>

      <Modal
        isOpen={!!isTokenModalOpen}
        onOpenChange={() => setIsTokenModalOpen(null)}
      >
        <ModalContent>
          <ModalHeader>
            Select {isTokenModalOpen === 'from' ? 'From' : 'To'} Token
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-4">
              {sData && sData.map((token, idx) => (
                <Button
                  key={idx}
                  variant="bordered"
                  color="default"
                  onPress={() => handleTokenSelect(token)}
                  className="flex flex-row justify-center items-center p-3"
                  isDisabled={
                    (isTokenModalOpen === 'from' && token.idProtocol === toToken?.idProtocol) ||
                    (isTokenModalOpen === 'to' && token.idProtocol === fromToken?.idProtocol)
                  }
                >
                  <Avatar
                    src={token.logo}
                    alt={token.nameToken}
                    className="w-4 h-4"
                  />
                  <div className="text-center">
                    <h4 className="font-semibold">{token.nameToken}</h4>
                  </div>
                </Button>
              ))}
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SwapCard;