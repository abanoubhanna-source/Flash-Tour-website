import { NextResponse } from 'next/server';
import servicesFallback from '@/data/services.json';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { parseServiceContent } from '@/lib/cms/services/schema';

// قراءة البيانات (عشان نعرضها في الموقع والداش بورد)
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from('published_content_entries')
      .select('id,slug,title,sort_order,data')
      .eq('content_type', 'service')
      .order('sort_order');
    if (error || !data?.length) return NextResponse.json(servicesFallback);
    return NextResponse.json(data.map((entry) => {
      const content = parseServiceContent(entry.data);
      return { id: content.slug || entry.slug, title: content.title || entry.title, desc: content.description, img: content.image.url };
    }));
  } catch {
    return NextResponse.json(servicesFallback);
  }
}
