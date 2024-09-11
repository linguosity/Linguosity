import { z } from 'zod';

export const systemPrompt = `Extract the header information for a speech and language therapy report. If the input doesn't contain all required information, use placeholder text like 'Not provided' for missing fields.`;

export const HeaderInfo = z.object({
  Name: z.string(), //1st column full width
  Age: z.string(), //2nd column 1/2 width
  Birthday: z.string(), // 2nd column 1/2 width
  Grade: z.string(), //1st column 1/2
  Parents: z.string(), //2nd column 1/2
  Eligibility: z.string(), 
  DateOfEvaluation: z.string(),
  DateOfReport: z.string(),
  
  Evaluator: z.string(),
});

export type HeaderInfoType = z.infer<typeof HeaderInfo>;