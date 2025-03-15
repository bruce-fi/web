import { z } from "zod";

export const TransfersResponseSchema = z.object({
  from: z.string(),
  to: z.string(),
  value: z.string(),
  transactionHash: z.string(),
});

export type TransfersResponse = z.infer<typeof TransfersResponseSchema>;