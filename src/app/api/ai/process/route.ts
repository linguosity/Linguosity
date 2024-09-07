import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AIResponseSchema } from '@/types/ai'
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const { input } = await request.json();

  try {
    console.log('Received input:', input);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18", // Changed to a more widely available model
      messages: [
        { role: "system", content: "You are a helpful AI assistant for speech and language therapy report writing. Provide concise responses." },
        { role: "user", content: input },
      ],
      temperature: 0.7,
    });

    console.log('OpenAI response:', JSON.stringify(completion, null, 2));

    const aiResponse = {
      id: completion.id,
      parsed_content: completion.choices[0].message.content || '',
      report_content_id: null,
      created_at: new Date().toISOString(),
    };

    console.log('Constructed aiResponse:', JSON.stringify(aiResponse, null, 2));

    // Store in Supabase
    const { data, error } = await supabase
      .from('ai_parsed_content')
      .insert({
        parsed_content: aiResponse.parsed_content,
        report_content_id: aiResponse.report_content_id,
      })
      .select();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Supabase response:', JSON.stringify(data, null, 2));

    return NextResponse.json(aiResponse);
  } catch (error: any) {
    console.error('Detailed error:', error);
    let errorMessage = 'Failed to process input';
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}