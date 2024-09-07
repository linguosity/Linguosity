// src/types/ai.ts
import { z } from 'zod';

export const AIResponseSchema = z.object({
  id: z.string(),
  parsed_content: z.union([
    z.string(),
    z.object({
      outline: z.array(z.string())
    })
  ]),
  report_content_id: z.string().nullable(),
  created_at: z.string().nullable(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;