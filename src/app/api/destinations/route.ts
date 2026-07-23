// src/app/api/destinations/route.ts
import { NextResponse } from 'next/server';
import fallback from '@/data/destinations.json';import{createSupabaseServerClient}from'@/lib/supabase/server';import{parseDestinationContent}from'@/lib/cms/destinations/schema';

export async function GET(request:Request) {
  try {
    const slug=new URL(request.url).searchParams.get('slug');const s=await createSupabaseServerClient();let query=s.from('published_content_entries').select('slug,title,sort_order,data').eq('content_type','destination').order('sort_order');if(slug)query=query.eq('slug',slug);const{data,error}=await query;if(error||!data?.length){const rows=slug?fallback.filter(x=>x.id===slug):fallback;return NextResponse.json(slug?rows[0]??null:rows)}const rows=data.map(x=>{const c=parseDestinationContent(x.data);return{id:c.slug,name:c.name,subtitle:c.subtitle,description:c.description,highlights:c.highlights.map(h=>h.title),image:c.gallery[0]?.image.url??'',icon:c.iconKey,hero:c.hero,country:c.country,gallery:c.gallery}});return NextResponse.json(slug?rows[0]:rows);
  } catch {
    const slug=new URL(request.url).searchParams.get('slug');const rows=slug?fallback.filter(x=>x.id===slug):fallback;return NextResponse.json(slug?rows[0]??null:rows);
  }
}
