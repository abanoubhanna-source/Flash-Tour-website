"use client";
import { useEffect, useState } from "react";
import type { PageHeroData, PageSeoData } from "./schema";

type PublishedPage = { hero: PageHeroData; seo: PageSeoData | null };

export function usePublishedPage(path: string) {
  const [data, setData] = useState<PublishedPage | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/pages?path=${encodeURIComponent(path)}`, { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then(setData)
      .catch(() => undefined);
    return () => controller.abort();
  }, [path]);
  return data;
}
