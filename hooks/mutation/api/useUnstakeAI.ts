import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import apiAgent from "@/lib/api-agent";

type Status = "idle" | "loading" | "success" | "error";

export const useUnstakeAI = () => {
  const [steps, setSteps] = useState<
    Array<{
      step: number;
      status: Status;
      error?: string;
    }>
  >([{ step: 1, status: "idle" }]);

  const [result, setResult] = useState<{ txhash: string } | null>(null);

  const mutation = useMutation({
    mutationFn: async ({
      user_address,
      protocol,
    }: {
      user_address: string
      protocol: string
    }) => {
      setSteps([{ step: 1, status: "loading" }]);
      const response = await apiAgent.post("action/unstake", {
        user_address: user_address,
        protocol: protocol,
      });
      return response;
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