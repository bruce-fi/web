import { z } from "zod";

export const StakedsResponseSchema = z.object({
  amount: z.string(),
  staker: z.string(),
  transactionHash: z.string(),
});

export type StakedsResponse = z.infer<typeof StakedsResponseSchema>;