import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import apiAgent from "@/lib/api-agent";
import { CreateWalletResponse } from "@/types/api/create-wallet";
import { useAccount } from "wagmi";

type Status = "idle" | "loading" | "success" | "error";

export const useCreateWalletAI = () => {
  const { address } = useAccount();

  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([{ step: 1, status: "idle" }]);

  const [result, setResult] = useState<CreateWalletResponse | null>(null);

  const mutation = useMutation({
    mutationFn: async ({ user_address }: { user_address: string }) => {
      setSteps([{ step: 1, status: "loading" }]);
      const response = await apiAgent.post("action/create-wallet", { user_address: user_address });
      apiAgent.post("action/get-eth-faucet", { user_address: address });
      return response as CreateWalletResponse;
    },
    onSuccess: (data) => {
      setResult(data);
      setSteps([{ step: 1, status: "success" }]);
    },
    onError: (e: unknown) => {
      console.error("Error", e);
      setResult(null);
      setSteps([{ step: 1, status: "error", error: (e as Error).message }]);
    },
  });

  return {
    steps,
    mutation,
    result,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess
  };
};