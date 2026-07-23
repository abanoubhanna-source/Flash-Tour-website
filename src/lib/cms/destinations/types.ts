import type { Json } from "@/types/database.generated"; import type { DestinationContentData, DestinationSeoData } from "./schema";
export type CmsDestinationSummary={id:string;title:string;slug:string;locale:string;status:"draft"|"published"|"archived";sortOrder:number;updatedAt:string;lockVersion:number};
export type CmsDestinationRevision={id:string;version:number;event:"draft_saved"|"published"|"unpublished"|"archived"|"restored";snapshot:Json;createdAt:string;authorName:string|null};
export type CmsDestinationEditorData=CmsDestinationSummary&{lockVersion:number;content:DestinationContentData;publishedContent:DestinationContentData|null;seo:DestinationSeoData;publishedSeo:DestinationSeoData|null;revisions:CmsDestinationRevision[]};
export type DestinationMutationResult=|{ok:true;lockVersion:number;updatedAt:string;message?:string}|{ok:false;message:string;conflict?:boolean;fieldErrors?:Record<string,string[]>};
