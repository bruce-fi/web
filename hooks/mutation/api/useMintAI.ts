import { useMutation } from "@tanstack/react-query";
import apiAgent from "@/lib/api-agent";
import { useState } from "react";
import { useAccount } from "wagmi";

type Status = "idle" | "loading" | "success" | "error";

export const useMintAI = () => {
  const { address } = useAccount();
  const [result, setResult] = useState<{ txhash: string } | null>(null);

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

  const mutation = useMutation({
    mutationFn: async ({
      asset_id,
      amount,
    }: {
      asset_id: string;
      amount: string;
    }) => {
      try {
        setSteps([{ step: 1, status: "idle" }]);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        const result = await apiAgent.post("action/mint", { user_address: address, asset_id: asset_id, amount: amount });
        setResult(result);

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
        console.error("Error", e);

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

  return { steps, mutation, result };
};