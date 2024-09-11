import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

async function testFetch(url: string) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return false;
  }
}

export async function GET() {
  console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Supabase Key (first 5 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 5));

  const googleConnectivity = await testFetch('https://www.google.com');
  const supabaseConnectivity = await testFetch(process.env.NEXT_PUBLIC_SUPABASE_URL!);

  console.log('Can connect to Google:', googleConnectivity);
  console.log('Can connect to Supabase URL:', supabaseConnectivity);

  if (!googleConnectivity) {
    return NextResponse.json({ success: false, error: 'Cannot connect to internet' }, { status: 500 });
  }

  if (!supabaseConnectivity) {
    return NextResponse.json({ success: false, error: 'Cannot connect to Supabase URL' }, { status: 500 });
  }

  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('Supabase client created, attempting to query...');

    const { data, error } = await supabase
      .from('ai_parsed_content')
      .select('id')
      .limit(1);

    if (error) throw error;

    console.log('Query successful:', data);

    return NextResponse.json({ success: true, message: 'Supabase connection successful', data });
  } catch (error: any) {
    console.error('Supabase connection test error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return NextResponse.json({ success: false, error: error.message, details: error }, { status: 500 });
  }
}