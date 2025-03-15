import React, { useState } from 'react';
import { Button } from '@heroui/button';
import { Card } from '@heroui/card';
import { ChartArea, DollarSign, ArrowDown, ArrowUp, ExternalLink, Clock, Calendar, Loader2 } from 'lucide-react';
import { Tooltip } from '@heroui/tooltip';
import { formatPercent, formatUSD, normalizeAPY } from '@/lib/helper';
import { urlSepoliaBasescan } from '@/lib/utils';
import { StakingPosition } from '@/types/staking';
import { Image } from '@heroui/image';
import { Chip } from '@heroui/chip';
import { useUnstakeAI } from '@/hooks/mutation/api/useUnstakeAI';
import { useAccount } from 'wagmi';
import ModalTransactionCustom from '../modal/modal-transaction-custom';
import { useStakeAI } from '@/hooks/mutation/api/useStakeAI';
import ModalStake from '../modal/modal-stake';
import { useAccountBalanceAI } from '@/hooks/query/useAccountBalanceAI';
import { DECIMALS_MOCK_TOKEN } from '@/lib/constants';

const StatItem = ({
  icon: Icon,
  label,
  value,
  subValue,
  className = ""
}: {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>,
  label: string,
  value: string | number,
  subValue?: string,
  className?: string
}) => (
  <div className={`rounded-lg  ${className}`}>
    <div className="flex items-center gap-2 mb-2">
      <div className="p-2 rounded-full bg-primary/10">
        <Icon className="w-4 h-4 text-primary" />
      </div>
      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</span>
    </div>
    <p className="text-lg font-bold">{value}</p>
    {subValue && (
      <p className="text-xs text-slate-500 mt-1">{subValue}</p>
    )}
  </div>
);

const CardStaking = ({ pool }: { pool: StakingPosition; sRefetch: () => void }) => {
  const { address } = useAccount();

  const [isModalStakeOpen, setIsModalStakeOpen] = useState<boolean>(false);
  const [isModalUnstakeOpen, setIsModalUnstakeOpen] = useState<boolean>(false);
  const closeModalStake = () => setIsModalStakeOpen(false);
  const closeModalUnstake = () => setIsModalUnstakeOpen(false);

  const now = new Date().getTime() / 1000;
  const durationStaked = now - pool.registrationTimestamp;
  const durationInHours = Math.floor(durationStaked / 3600);
  const durationInDays = Math.floor(durationStaked / 86400);

  const { mutation: mStakeAI, result: rStakeAI } = useStakeAI();
  const { mutation: mUnstakeAI, result: rUnstakeAI } = useUnstakeAI();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [amountStaked, setAmountStaked] = useState<string>("0");

  const { bNormalized } = useAccountBalanceAI({ token: pool.pool.addressToken as HexAddress, decimal: DECIMALS_MOCK_TOKEN });

  const handleStake = () => {
    mStakeAI.mutate({
      user_address: address as HexAddress,
      asset_id: pool.pool.nameToken.toLowerCase(),
      protocol: pool.pool.nameProject.toLowerCase(),
      spender: pool.pool.addressStaking,
      amount: amountStaked,
    }, {
      onSuccess: () => {
        setIsModalStakeOpen(true)
        if (isModalStakeOpen === false) {
          window.location.reload()
        }
      }
    })
  }

  const handleConfirmStake = () => {
    handleStake();
    setIsModalOpen(false);
  };

  const handleUnstake = () => {
    mUnstakeAI.mutate({
      user_address: address as HexAddress,
      protocol: pool.pool.nameProject.toLowerCase()
    }, {
      onSuccess: () => {
        setIsModalUnstakeOpen(true)
        if (isModalUnstakeOpen === false) {
          window.location.reload()
        }
      }
    })
  }

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-all bg-background/50 duration-300">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full animate-pulse" />
              <Image
                src={pool.pool.logo || "/placeholder.png"}
                alt={pool.pool.nameToken}
                className="w-12 h-12 rounded-full ring-4 ring-offset-4 ring-primary/20"
              />
            </div>
            <div>
              <h3 className="text-2xl font-bold">
                {pool.pool.nameProject}
              </h3>
              <p className="text-sm text-slate-500">{pool.pool.nameToken}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 md:ml-auto">
            {pool.pool.categories.map((category, idx) => (
              <Chip
                key={idx}
                variant="flat"
                className="capitalize px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 transition-colors duration-200"
              >
                {category.replace('-', ' ')}
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <StatItem
              icon={ChartArea}
              label="Current APY"
              value={formatPercent(normalizeAPY(pool.pool.apy))}
              subValue="Annual Percentage Yield"
            />
            <StatItem
              icon={DollarSign}
              label="Total Value Locked"
              value={formatUSD(normalizeAPY(pool.pool.tvl))}
              subValue="Platform Liquidity"
            />
            <StatItem
              icon={DollarSign}
              label="Your Stake"
              value={`${Number(pool.amountStaked).toFixed(2)} ${pool.pool.nameToken}`}
              subValue="Current Position"
            />
            <StatItem
              icon={Clock}
              label="Stake Duration"
              value={`${durationInDays < 1 ? durationInHours + " hours" : durationInDays + " days"}`}
              subValue="Total Period"
            />
            <StatItem
              icon={Calendar}
              label="Started On"
              value={new Date(pool.registrationTimestamp * 1000).toLocaleDateString()}
              subValue="Registration Date"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <Tooltip content="Stake additional tokens with ai wallet">
            <Button
              className="min-h-12 flex-1"
              color='primary'
              onPress={() => setIsModalOpen(true)}
              disabled={mStakeAI.isPending}
            >
              {mStakeAI.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Stake</span>}
              <ArrowDown className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="Withdraw your staked tokens to ai wallet">
            <Button
              variant="bordered"
              className="min-h-12 flex-1"
              color='warning'
              disabled={mUnstakeAI.isPending}
              onPress={handleUnstake}
            >
              {mUnstakeAI.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Unstake</span>}
              <ArrowUp className="w-4 h-4" />
            </Button>
          </Tooltip>
          <Tooltip content="View contract on blockchain explorer">
            <Button
              variant="flat"
              className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
              onPress={() => window.open(urlSepoliaBasescan({ address: pool.pool.addressStaking, type: "address" }), '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      </div>
      <ModalTransactionCustom
        isOpen={isModalStakeOpen}
        setIsOpen={closeModalStake}
        status={mStakeAI.status || ""}
        data={rStakeAI?.txhash || ""}
        name='stake'
      />
      <ModalTransactionCustom
        isOpen={isModalUnstakeOpen}
        setIsOpen={closeModalUnstake}
        status={mUnstakeAI.status || ""}
        data={rUnstakeAI?.txhash || ""}
        name='unstake'
      />
      <ModalStake
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStake}
        amount={amountStaked}
        setAmount={setAmountStaked}
        tokenName={pool.pool.nameToken}
        isLoading={mStakeAI.isPending}
        maxAmount={bNormalized}
      />
    </Card>
  );
};

export default CardStaking;