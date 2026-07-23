import { z } from "zod";

export const destinationImageSchema = z.object({ assetId: z.uuid().nullable().default(null), url: z.string().trim().max(2000).default(""), alt: z.string().trim().max(180).default("") });
const highlightSchema = z.object({ id: z.string().trim().min(1).max(80), title: z.string().trim().min(1).max(180) });
const galleryItemSchema = z.object({ id: z.string().trim().min(1).max(80), image: destinationImageSchema, caption: z.string().trim().max(240).default("") });
export const destinationContentSchema = z.object({
  name: z.string().trim().min(2).max(120), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), subtitle: z.string().trim().max(180).default(""),
  description: z.string().trim().min(1).max(8000), iconKey: z.string().trim().max(40).default("Compass"), sortOrder: z.number().int().min(0).max(9999).default(0),
  hero: z.object({ eyebrow: z.string().trim().max(120).default("Destination Portfolio"), title: z.string().trim().min(1).max(100), accentTitle: z.string().trim().max(100).default(""), subtitle: z.string().trim().max(500).default(""), image: destinationImageSchema }),
  country: z.object({ code: z.string().trim().max(3).default(""), region: z.string().trim().max(120).default(""), officeLabel: z.string().trim().max(160).default("") }),
  highlights: z.array(highlightSchema).max(30).default([]), gallery: z.array(galleryItemSchema).max(30).default([]),
});
export const destinationSeoSchema = z.object({
  title: z.string().trim().max(70).default(""), description: z.string().trim().max(170).default(""), keywords: z.array(z.string().trim().min(1).max(80)).max(30).default([]), canonicalUrl: z.string().trim().max(500).default(""),
  openGraph: z.object({ title: z.string().trim().max(100).default(""), description: z.string().trim().max(220).default(""), image: z.string().trim().max(2000).default("") }),
});
export const destinationDraftSchema = z.object({ content: destinationContentSchema, seo: destinationSeoSchema });
export const createDestinationSchema = z.object({ name: z.string().trim().min(2).max(120), slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), locale: z.string().trim().regex(/^[a-z]{2}(?:-[A-Z]{2})?$/).default("en") });
export type DestinationContentData = z.infer<typeof destinationContentSchema>; export type DestinationSeoData = z.infer<typeof destinationSeoSchema>; export type DestinationDraftData = z.infer<typeof destinationDraftSchema>;
export function parseDestinationContent(value: unknown): DestinationContentData { const parsed = destinationContentSchema.safeParse(value); return parsed.success ? parsed.data : { name:"Untitled destination",slug:"untitled-destination",subtitle:"",description:"Add a destination description.",iconKey:"Compass",sortOrder:0,hero:{eyebrow:"Destination Portfolio",title:"Untitled",accentTitle:"Destination",subtitle:"",image:{assetId:null,url:"",alt:""}},country:{code:"",region:"",officeLabel:""},highlights:[],gallery:[] }; }
export function parseDestinationSeo(value: unknown): DestinationSeoData { const parsed=destinationSeoSchema.safeParse(value); return parsed.success?parsed.data:{title:"",description:"",keywords:[],canonicalUrl:"",openGraph:{title:"",description:"",image:""}}; }
