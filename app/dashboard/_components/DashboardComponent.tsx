"use client";

import React, { useState, useEffect } from 'react';
import CardStaking from '@/components/card/card-staking';
import ChartStaking from '@/components/chart/chart-staking';
import CardPortfolio from '@/components/card/card-portfolio';
import { useStaking } from '@/hooks/query/useStaking';
import { readContract } from 'wagmi/actions';
import { useWagmiConfig } from '@/lib/wagmi';
import { MockStakingABI } from '@/lib/abis/MockStakingABI';
import { useAddressAI } from '@/hooks/query/useAddressAI';
import { normalize } from '@/lib/bignumber';
import { DECIMALS_MOCK_TOKEN } from '@/lib/constants';
import { Staking, StakingPositionList } from '@/types/staking';

export default function DashboardComponent() {
  const { sData, sRefetch } = useStaking();
  const [isAIWallet, setIsAIWallet] = useState(false);
  const { addressAI } = useAddressAI();
  const wagmiConfig = useWagmiConfig();
  const [combinedStakingData, setCombinedStakingData] = useState<StakingPositionList>([]);

  useEffect(() => {
    if (!sData || !addressAI) return;

    const fetchStakingData = async () => {
      const results = await Promise.all(
        sData.map(async (pool: Staking) => {
          const rawData = await readContract(wagmiConfig, {
            address: pool.addressStaking as HexAddress,
            abi: MockStakingABI,
            functionName: "stakes",
            args: [addressAI],
          }) as [bigint, bigint, bigint, boolean];

          return {
            amountStaked: normalize(Number(rawData[0]), DECIMALS_MOCK_TOKEN),
            numberOfDays: Number(rawData[1]),
            registrationTimestamp: Number(rawData[2]),
            isValid: rawData[3],
            pool: pool
          };
        })
      );

      setCombinedStakingData(results.filter(result => result.isValid));
    };

    fetchStakingData();
  }, [sData, addressAI, wagmiConfig]);

  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl justify-center items-center">
      <div className="flex flex-col lg:flex-row gap-4 w-full justify-center">
        <CardPortfolio isAIWallet={isAIWallet} setIsAIWallet={setIsAIWallet} />
        <ChartStaking />
      </div>

      {isAIWallet && (
        <div className="flex flex-col gap-4 w-full">
          {combinedStakingData?.map((pool, idx) => (
            <CardStaking key={idx} pool={pool} sRefetch={sRefetch}/>
          ))}
        </div>
      )}
    </div>
  );
}