import { z } from "zod";

export const GenerateStakingResponseSchema = z.object({
  response: z.array(
    z.object({
      id_project: z.string(),
    })
  ),
  thread_id: z.string(),
  processing_time: z.number(),
});

export type GenerateStakingResponse = z.infer<typeof GenerateStakingResponseSchema>;