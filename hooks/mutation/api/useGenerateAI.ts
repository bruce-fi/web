import { dataClassify } from "@/data/dataClassify";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import apiAgent from "@/lib/api-agent";
import { useAccount } from "wagmi";
import { useStaking } from "@/hooks/query/useStaking";
import useGenerateContent from "@/hooks/query/api/useGeneratedContent";

type Status = "idle" | "loading" | "success" | "error";

export const useGenerateAI = () => {
  const { address } = useAccount()
  const { sData } = useStaking();

  const { risk, setRisk, protocolId, setProtocolId } = useGenerateContent();

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
    {
      step: 2,
      status: "idle",
    }
  ]);

  const mutation = useMutation({
    mutationFn: async ({
      formattedSubmission
    }: {
      formattedSubmission: string;
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

        const response = await apiAgent.post("generate-risk-profile", { data: formattedSubmission, user_address: address });
        setRisk(response.risk);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 1) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

        const matchingClassification = dataClassify.find(
          (item) => item.risk === response.risk);

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "loading" };
            }
            return item;
          })
        );

        if (matchingClassification) {
          const response = await apiAgent.post("query", { query: matchingClassification.prompt });

          let findStaking = sData?.find((item) => {
            return item.idProtocol?.trim() === response.response[0]?.id_project.replace(/"/g, "")
          });

          if (!findStaking) {
            findStaking = sData?.find((item) => {
              return item.nameToken?.trim() === response.response[0]?.id_project.replace(/"/g, "")
            })
          }

          setProtocolId(response.response[0]?.id_project);
        }

        setSteps((prev) =>
          prev.map((item) => {
            if (item.step === 2) {
              return { ...item, status: "success" };
            }
            return item;
          })
        );

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

  return { steps, mutation, risk, protocolId };
};