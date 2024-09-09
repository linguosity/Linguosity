import { z } from 'zod';

export const systemPrompt = `Extract the header information for a speech and language therapy report. If the input doesn't contain all required information, use placeholder text like 'Not provided' for missing fields.`;

export const HeaderInfo = z.object({
  Name: z.string(),
  Birthday: z.string(),
  DateOfEvaluation: z.string(),
  DateOfReport: z.string(),
  Parents: z.string(),
  Eligibility: z.string(),
  Age: z.string(),
  Grade: z.string(),
  Evaluator: z.string(),
});

export type HeaderInfoType = z.infer<typeof HeaderInfo>;