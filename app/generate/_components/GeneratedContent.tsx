import { Button } from "@heroui/button";
import { Image } from '@heroui/image'
import { Card } from '@heroui/card'
import { Chip } from '@heroui/chip'
import { ArrowDown, ChartArea, DollarSign, Loader2 } from 'lucide-react'
import { formatPercent, formatUSD, normalizeAPY } from '@/lib/helper'
import { useStaking } from "@/hooks/query/useStaking";
import { Staking } from "@/types/staking";
import { useEffect, useState } from "react";
import { useStakeAI } from "@/hooks/mutation/api/useStakeAI";
import { useAccount } from "wagmi";
import Loading from "@/components/loader/loading";
import { useAccountBalanceAI } from "@/hooks/query/useAccountBalanceAI";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";
import ModalTransactionCustom from "@/components/modal/modal-transaction-custom";
import ModalStake from "@/components/modal/modal-stake";

export default function GeneratedContent({
  risk,
  protocolId
}: {
  risk: string;
  protocolId: string;
}) {
  const { sData } = useStaking();
  const { mutation, result } = useStakeAI();
  const { address } = useAccount();

  const [isModalTransactionOpen, setIsModalTransactionOpen] = useState<boolean>(false);

  const [curStaking, setCurStaking] = useState<Staking | null>(null);
  const { bNormalized } = useAccountBalanceAI({ token: curStaking?.addressToken as HexAddress, decimal: DECIMALS_MOCK_TOKEN });

  useEffect(() => {
    if (!sData) return;

    let findStaking = sData.find((item) => {
      return item.idProtocol?.trim() === protocolId.replace(/"/g, "")
    });

    if (!findStaking) {
      findStaking = sData.find((item) => {
        return item.nameToken?.trim() === protocolId.replace(/"/g, "")
      })
    }

    setCurStaking(findStaking || null);
  }, [sData, protocolId]);

  console.log("curStaking", curStaking);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [amountStaked, setAmountStaked] = useState<string>("0");

  const handleStake = async () => {
    mutation.mutateAsync({
      user_address: address!,
      asset_id: curStaking?.nameToken.toLowerCase() || '',
      protocol: curStaking?.nameProject?.toLowerCase() || '',
      spender: curStaking?.addressStaking || "",
      amount: amountStaked,
    }, {
      onSuccess: () => {
        setIsModalTransactionOpen(true);
        
        setTimeout(() => (window.location.reload()), 5000);
      }
    })
  }

  const handleConfirmStake = () => {
    handleStake();
    setIsModalOpen(false);
  };

  const closeModalTransaction = () => setIsModalTransactionOpen(false);

  return (
    <div className="max-w-sm md:max-w-6xl">
      {(mutation.isPending) && <Loading />}
      <p className="text-neutral-800 dark:text-neutral-200 text-sm md:text-lg font-normal mb-4">
        You classified as <span className="font-semibold">{risk.includes("low") ? "Conservative" : risk.includes("medium") ? "Balanced" : risk.includes("high") ? "Aggressive" : ""}</span> risk. here&apos;s our recommended staking option:
      </p>
      {sData && curStaking && (
        <Card className="p-4 bg-background/50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-4 min-w-24 justify-center">
              <Image
                src={sData && curStaking?.logo}
                alt={sData && curStaking?.nameToken}
                className="min-w-12 min-h-12 opacity-100 p-1 w-12 h-12 rounded-full ring-2 ring-offset-2 ring-slate-100"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {sData && curStaking?.nameProject}
                </h3>
                <p className="text-sm text-slate-500">{sData && curStaking?.nameToken}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 items-center justify-center">
              {sData && curStaking?.categories.map((category: string, idx: number) => (
                <Chip key={idx} variant='bordered' color='primary' className='text-xs px-1'>
                  {category.replace('-', ' ')}
                </Chip>
              ))}
            </div>

            <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-8">
              <div>
                <div className="flex items-center gap-2">
                  <ChartArea className="w-4 h-4" />
                  <span className="text-sm font-medium text-slate-600">APY</span>
                </div>
                <p className="text-lg font-bold">
                  {formatPercent(normalizeAPY(sData && curStaking?.apy))}
                </p>
              </div>
              <div className="">
                <div className="flex items-center gap-2 justify-end md:justify-start">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium text-slate-600">TVL</span>
                </div>
                <p className="text-lg font-bold text-end md:text-start">
                  {formatUSD(normalizeAPY(sData && curStaking?.tvl))}
                </p>
              </div>
            </div>

            <div className="flex gap-2 md:ml-auto">
              <Button
                variant="bordered"
                className="flex-1 md:flex-none flex items-center justify-center gap-2"
                onPress={() => setIsModalOpen(true)}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Stake</span>}
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
      <ModalStake
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmStake}
        amount={amountStaked}
        setAmount={setAmountStaked}
        tokenName={curStaking?.nameToken || ""}
        isLoading={mutation.isPending}
        maxAmount={bNormalized}
      />
      <ModalTransactionCustom
        isOpen={isModalTransactionOpen}
        setIsOpen={closeModalTransaction}
        status={mutation.status || ""}
        data={result?.txhash || ""}
        name='stake'
      />
    </div>
  )
}
