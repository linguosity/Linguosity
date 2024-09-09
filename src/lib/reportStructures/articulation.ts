import { z } from 'zod';

export const systemPrompt = `You are a speech-language pathologist writing an articulation assessment report. 
Analyze the given input and provide a structured summary of the client's articulation skills. 
Include information on speech sound errors, error patterns, intelligibility, impact on communication, and recommendations.`;

export const responseSchema = z.object({
  speech_sound_errors: z.array(z.string()),
  error_patterns: z.array(z.string()),
  intelligibility: z.object({
    description: z.string(),
    percentage: z.number().min(0).max(100).optional(),
  }),
  impact_on_communication: z.string(),
  recommendations: z.array(z.string()),
});

export type ArticulationInfo = z.infer<typeof responseSchema>;