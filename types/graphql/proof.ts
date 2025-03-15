import { z } from "zod";

export const ProofResponseSchema = z.object({
  taskIndex: z.string(),
  signature: z.string(),
  task_stakingAddress: z.string(),
  task_accountAddress: z.string(),
  transactionHash: z.string(),
});

export type ProofResponse = z.infer<typeof ProofResponseSchema>;