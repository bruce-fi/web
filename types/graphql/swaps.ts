import { z } from "zod";

export const SwapsResponseSchema = z.object({
  user: z.string(),
  amount: z.string(),
  tokenIn: z.string(),
  tokenOut: z.string(),
  transactionHash: z.string(),
});

export type SwapsResponse = z.infer<typeof SwapsResponseSchema>;