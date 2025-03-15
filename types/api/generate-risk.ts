import { z } from "zod";

export const GenerateRiskResponseSchema = z.object({
  risk: z.string(),
});

export type GenerateRiskResponse = z.infer<typeof GenerateRiskResponseSchema>;