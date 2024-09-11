import { z } from 'zod';

export const schema = z.object({
  overallImpression: z.string(),
  stutteringFrequency: z.string(),
  stutteringTypes: z.array(z.string()),
  secondaryBehaviors: z.array(z.string()),
  fluencyEnhancingTechniques: z.array(z.string()),
  impact: z.string(),
  recommendations: z.array(z.string()),
});

export const systemPrompt = 
  "Analyze the fluency information provided and generate a structured assessment for a speech therapy report. Include overall impression, stuttering frequency and types, secondary behaviors, fluency enhancing techniques, impact on communication, and recommendations.";