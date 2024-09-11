import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';
import { reportStructures, ReportSection } from '@/lib/reportStructures';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received body:', JSON.stringify(body, null, 2));

    const { input, section } = body;
    console.log('Extracted section:', section);

    if (!section) {
      throw new Error(`Missing section parameter`);
    }

    const sectionData = reportStructures[section.toLowerCase()] as ReportSection | undefined;

    if (!sectionData) {
      console.log('Available sections:', Object.keys(reportStructures));
      throw new Error(`Invalid section: ${section}`);
    }

    const { schema, systemPrompt } = sectionData;

    console.log('Using system prompt:', systemPrompt);

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      response_format: zodResponseFormat(schema, `${section}Info`),
    });

    const sectionInfo = completion.choices[0].message.parsed;
    console.log('Parsed section info:', sectionInfo);

    // Insert data into Supabase
    const { data, error } = await supabase
      .from('ai_parsed_content')
      .insert({
        parsed_content: sectionInfo as Database['public']['Tables']['ai_parsed_content']['Insert']['parsed_content'],
        report_content_id: null,
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Data stored in Supabase:', data);

    return NextResponse.json(sectionInfo);
  } catch (error: any) {
    console.error(`Error in API:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}