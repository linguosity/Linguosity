import { z } from 'zod';

export const schema = z.object({
  overallImpression: z.string(),
  receptiveLanguage: z.object({
    comprehension: z.string(),
    following_directions: z.string(),
    vocabulary: z.string(),
  }),
  expressiveLanguage: z.object({
    sentence_structure: z.string(),
    vocabulary_use: z.string(),
    narrative_skills: z.string(),
  }),
  pragmaticSkills: z.string(),
  recommendations: z.array(z.string()),
});

export const systemPrompt = 
  "Analyze the language information provided and generate a structured assessment for a speech therapy report. Include an overall impression, evaluation of receptive language (comprehension, following directions, vocabulary), expressive language (sentence structure, vocabulary use, narrative skills), pragmatic skills, and recommendations.";