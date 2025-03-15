import { MockTokenABI } from "@/lib/abis/MockTokenABI";
import { denormalize, valueToBigInt } from "@/lib/bignumber";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";
import { useWagmiConfig } from "@/lib/wagmi";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { erc20Abi } from "viem";
import { useAccount } from "wagmi";
import {
  waitForTransactionReceipt,
  writeContract,
} from "wagmi/actions";

type Status = "idle" | "loading" | "success" | "error";

export const useTransfer = () => {
  const { address: userAddress } = useAccount();
  const wagmiConfig = useWagmiConfig();

  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([
    {
      step: 1,
      status: "idle",
    },
  ]);

  const [txHash, setTxHash] = useState<HexAddress | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      toAddress,
      addressToken,
      amount,
    }: {
      toAddress: HexAddress;
      addressToken: HexAddress;
      amount: string;
    }) => {
      try {
        // Reset steps
        setSteps([{ step: 1, status: "idle" }]);

        if (!amount || !userAddress) {
          throw new Error("Invalid parameters");
        }

        const dAmount = denormalize(amount || "0", DECIMALS_MOCK_TOKEN);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const approveHash = await writeContract(wagmiConfig, {
          address: addressToken,
          abi: erc20Abi,
          functionName: "approve",
          args: [
            userAddress,
            valueToBigInt(dAmount + 10),
          ],
        });

        await waitForTransactionReceipt(wagmiConfig, {
          hash: approveHash,
        });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        const txHash = await writeContract(wagmiConfig, {
          address: addressToken,
          abi: MockTokenABI,
          functionName: "transfer",
          args: [
            toAddress,
            dAmount,
          ],
        });

        setTxHash(txHash);

        const result = await waitForTransactionReceipt(wagmiConfig, {
          hash: txHash,
        });

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        return result;
      } catch (e) {
        console.error("Bid Error", e);

        setSteps((prev) =>
          prev.map((step) => {
            if (step.status === "loading") {
              return { ...step, status: "error", error: (e as Error).message };
            }
            return step;
          })
        );

        throw e;
      }
    },
  });

  return { steps, mutation, txHash };
};