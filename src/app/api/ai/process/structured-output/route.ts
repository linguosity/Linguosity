import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { zodResponseFormat } from "openai/helpers/zod";
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const HeaderInfo = z.object({
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

export async function POST(request: Request) {
  console.log('Structured Output API route called');
  const { input } = await request.json();
  console.log('Received input:', input);

  try {
    console.log('Calling OpenAI API');
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-mini-2024-07-18",
      messages: [
        { role: "system", content: "Extract the header information for a speech and language therapy report. If the input doesn't contain all required information, use placeholder text like 'Not provided' for missing fields." },
        { role: "user", content: input },
      ],
      response_format: zodResponseFormat(HeaderInfo, "headerInfo"),
    });

    console.log('OpenAI API response received');
    console.log('OpenAI response:', JSON.stringify(completion, null, 2));

    const headerInfo = completion.choices[0].message.parsed;
    console.log('Parsed header info:', headerInfo);

    console.log('Storing in Supabase');
    const { data, error } = await supabase
      .from('ai_parsed_content')
      .insert({
        parsed_content: JSON.stringify(headerInfo),
        report_content_id: null,
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Supabase response:', JSON.stringify(data, null, 2));

    console.log('Sending response');
    return NextResponse.json(headerInfo);
  } catch (error: any) {
    console.error('Error in structured output API:', error);
    let errorMessage = 'Failed to process input';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    console.error('Error message:', errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}