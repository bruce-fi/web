import { z } from "zod";

export const CreateWalletResponseSchema = z.object({
  address: z.string().optional(),
});

export type CreateWalletResponse = z.infer<typeof CreateWalletResponseSchema>;