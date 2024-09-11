import { z, ZodObject } from 'zod';
import * as articulation from './articulation';
import * as language from './language';
import * as fluency from './fluency';
import * as header from './header';  // Add this line to import the header module

export interface ReportSection {
  schema: ZodObject<any>;
  systemPrompt: string;
}

export interface ReportStructures {
  [key: string]: ReportSection;
}

export const reportStructures: ReportStructures = {
  header: {
    schema: header.HeaderInfo,
    systemPrompt: header.systemPrompt,
  },
  articulation: {
    schema: articulation.schema,
    systemPrompt: articulation.systemPrompt,
  },
  language: {
    schema: language.schema,
    systemPrompt: language.systemPrompt,
  },
  fluency: {
    schema: fluency.schema,
    systemPrompt: fluency.systemPrompt,
  },
  // Add other sections here in the same format
};