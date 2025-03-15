import { z } from "zod";

export const WithdrawsResponseSchema = z.object({
  amount: z.string(),
  transactionHash: z.string(),
  withdrawer: z.string(),
});

export type WithdrawsResponse = z.infer<typeof WithdrawsResponseSchema>;