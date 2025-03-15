"use client";

import React, { useState, useMemo } from "react";
import { useSwapsHistory } from "@/hooks/query/graphql/useSwapsHistory";
import { useTransfersHistory } from "@/hooks/query/graphql/useTransfersHistory";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { CheckCircle, Copy, ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import { Pagination } from "@heroui/pagination";
import { Skeleton } from "@heroui/skeleton";
import { truncateAddress } from "@/lib/helper";
import { normalize } from "@/lib/bignumber";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";
import { useStaking } from "@/hooks/query/useStaking";
import { Image } from "@heroui/image";
import { useStakedsHistory } from "@/hooks/query/graphql/useStakedsHistory";
import { useWithdrawsHistory } from "@/hooks/query/graphql/useWithdrawsHistory";
import { SwapsResponse } from "@/types/graphql/swaps";
import { TransfersResponse } from "@/types/graphql/transfers";
import { StakedsResponse } from "@/types/graphql/stakeds";
import { WithdrawsResponse } from "@/types/graphql/withdraws";
import { urlSepoliaBasescan } from "@/lib/utils";
import { Link } from "@heroui/link";

type HistoryType = "transfers" | "swaps" | "stakeds" | "withdraws";

export default function HistoryCard() {
  const { address } = useAccount();
  const { sData } = useStaking();

  const [selectedType, setSelectedType] = useState<HistoryType>("transfers");
  const { dTransfers, tLoading, tRefetch } = useTransfersHistory({
    address: address?.toLowerCase() as `0x${string}`,
  });
  const { dSwaps, sLoading, sRefetch } = useSwapsHistory({
    address: address?.toLowerCase() as `0x${string}`,
  });
  const { dStakeds, sLoading: sLoadingStaked, sRefetch: sRefetchStaked } = useStakedsHistory({
    address: address?.toLowerCase() as `0x${string}`,
  });
  const { dWithdraws, sLoading: sLoadingWithdraws, sRefetch: sRefetchWithdraw } = useWithdrawsHistory({
    address: address?.toLowerCase() as `0x${string}`,
  });

  const [page, setPage] = useState(1);
  const rowsPerPage = 4;

  const [copied, setCopied] = useState(false);

  const handleCopyAddress = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const items = useMemo(() => {
    let data: (TransfersResponse | SwapsResponse | StakedsResponse | WithdrawsResponse)[] = [];
    if (selectedType === "transfers") data = dTransfers;
    if (selectedType === "swaps") data = dSwaps;
    if (selectedType === "stakeds") data = dStakeds;
    if (selectedType === "withdraws") data = dWithdraws;
    const start = (page - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [page, selectedType, dTransfers, dSwaps, dStakeds, dWithdraws]);

  const totalPages = Math.ceil(
    (selectedType === "transfers" ? dTransfers.length :
      selectedType === "swaps" ? dSwaps.length :
        selectedType === "stakeds" ? dStakeds.length :
          dWithdraws.length) / rowsPerPage
  );

  const handleRefetch = () => {
    if (selectedType === "transfers") tRefetch();
    if (selectedType === "swaps") sRefetch();
    if (selectedType === "stakeds") sRefetchStaked();
    if (selectedType === "withdraws") sRefetchWithdraw();
  };

  const handleTypeChange = (value: string) => {
    setSelectedType(value as HistoryType);
    setPage(1);
  };

  const findLogoToken = (token: string) => {
    return sData && sData.find((t) => t.addressToken.toLowerCase() === token.toLowerCase())?.logo;
  }

  const renderTransactionHash = (hash: string) => {
    return (
      <div className="flex flex-row items-center gap-1">
        {truncateAddress(hash)}
        <Button
          variant="ghost"
          size="sm"
          onPress={() => handleCopyAddress(hash)}
          className="text-gray-400 hover:text-white rounded-full min-w-6 min-h-6"
        >
          {copied ? (
            <CheckCircle className="h-4 w-4 text-emerald-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <Link
          href={urlSepoliaBasescan({ 
            address: hash, 
            type: 'transaction' 
          })}
          target='_blank'
          rel='noopener noreferrer'
          className='underline underline-offset-1 cursor-pointer text-sm text-center text-white'
        >
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white rounded-full min-w-6 min-h-6"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  };

  const renderTableCell = (item: TransfersResponse | SwapsResponse | StakedsResponse | WithdrawsResponse, key: string) => {
    if (selectedType === "transfers") {
      const transferItem = item as TransfersResponse;
      switch (key) {
        case "from":
          return truncateAddress(transferItem.from);
        case "to":
          return truncateAddress(transferItem.to);
        case "value":
          return normalize(transferItem.value, DECIMALS_MOCK_TOKEN);
        case "transactionHash":
          return renderTransactionHash(transferItem.transactionHash);
        default:
          return "";
      }
    } else if (selectedType === "swaps") {
      const swapItem = item as SwapsResponse;
      switch (key) {
        case "user":
          return truncateAddress(swapItem.user);
        case "amount":
          return normalize(swapItem.amount, DECIMALS_MOCK_TOKEN);
        case "tokenIn":
          return <Image src={findLogoToken(swapItem.tokenIn)} alt="Token In" className="h-6 w-6 bg-white rounded-full" />;
        case "tokenOut":
          return <Image src={findLogoToken(swapItem.tokenOut)} alt="Token Out" className="h-6 w-6 bg-white rounded-full" />;
        case "transactionHash":
          return renderTransactionHash(swapItem.transactionHash);
        default:
          return "";
      }
    } else if (selectedType === "stakeds") {
      const stakedItem = item as StakedsResponse;
      switch (key) {
        case "amount":
          return normalize(stakedItem.amount, DECIMALS_MOCK_TOKEN);
        case "staker":
          return truncateAddress(stakedItem.staker);
        case "transactionHash":
          return renderTransactionHash(stakedItem.transactionHash);
        default:
          return "";
      }
    } else if (selectedType === "withdraws") {
      const withdrawItem = item as WithdrawsResponse;
      switch (key) {
        case "amount":
          return normalize(withdrawItem.amount, DECIMALS_MOCK_TOKEN);
        case "withdrawer":
          return truncateAddress(withdrawItem.withdrawer);
        case "transactionHash":
          return renderTransactionHash(withdrawItem.transactionHash);
        default:
          return "";
      }
    }
  };

  const getColumns = () => {
    if (selectedType === "transfers") {
      return ["from", "to", "value", "transactionHash"];
    } else if (selectedType === "swaps") {
      return ["user", "amount", "tokenIn", "tokenOut", "transactionHash"];
    } else if (selectedType === "stakeds") {
      return ["amount", "staker", "transactionHash"];
    } else if (selectedType === "withdraws") {
      return ["amount", "withdrawer", "transactionHash"]
    } else {
      return [];
    }
  };

  const renderSkeletonRows = () => {
    return Array(rowsPerPage).fill(null).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        {getColumns().map((column) => (
          <TableCell key={`${column}-${index}`}>
            <Skeleton className="w-24 h-6 rounded-lg" />
          </TableCell>
        ))}
      </TableRow>
    ));
  };

  return (
    <Card className="w-full max-w-xl bg-background/50">
      <CardHeader className="flex items-center justify-between pb-4">
        <span className="text-2xl font-bold">Transaction History</span>
        <div className="flex items-center gap-4">
          <Select
            value={selectedType}
            onChange={(e) => handleTypeChange(e.target.value)}
            variant="bordered"
            className="w-32"
          >
            <SelectItem key="transfers" value="transfers">Transfers</SelectItem>
            <SelectItem key="swaps" value="swaps">Swaps</SelectItem>
            <SelectItem key="stakeds" value="takeds">Stakeds</SelectItem>
            <SelectItem key="withdraws" value="withdraws">Withdraws</SelectItem>
          </Select>
          <Button variant="bordered" onPress={handleRefetch} disabled={tLoading || sLoading}>
            {tLoading || sLoading || sLoadingStaked || sLoadingWithdraws ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardBody>
        <Table
          aria-label="Transaction history table"
          bottomContent={
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={totalPages}
                onChange={setPage}
              />
            </div>
          }
          classNames={{ wrapper: "min-h-[222px] bg-transparent" }}
        >
          <TableHeader>
            {getColumns().map((column) => (
              <TableColumn key={column}>{column}</TableColumn>
            ))}
          </TableHeader>
          <TableBody>
            {(tLoading || sLoading || sLoadingStaked || sLoadingWithdraws) ? (
              renderSkeletonRows()
            ) : (
              items.map((item) => (
                <TableRow key={item.transactionHash}>
                  {getColumns().map((column) => (
                    <TableCell key={column}>
                      {renderTableCell(item, column)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardBody>
    </Card>
  );
}