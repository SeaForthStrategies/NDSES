import { unstable_cache } from "next/cache";
import type { CMSPage, Community, DumpsterSize, GlobalSettings, ServiceNotice } from "@/types/cms";

async function graphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T | null> {
  const endpoint = process.env.WORDPRESS_GRAPHQL_URL;
  if (!endpoint) return null;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 300, tags: ["cms"] }
  });

  if (!response.ok) {
    console.error("WordPress GraphQL request failed", response.status);
    return null;
  }

  const json = await response.json();
  if (json.errors) {
    console.error("WordPress GraphQL returned errors", json.errors);
    return null;
  }
  return json.data as T;
}

export const getWordPressGlobals = unstable_cache(async (): Promise<GlobalSettings | null> => {
  await graphQL("query SiteSettings { generalSettings { title } }");
  return null;
}, ["wordpress-globals"], { tags: ["cms", "globals"], revalidate: 300 });

export async function getWordPressPage(_slug: string): Promise<CMSPage | null> {
  return null;
}

export async function getWordPressCommunities(): Promise<Community[] | null> {
  return null;
}

export async function getWordPressDumpsterSizes(): Promise<DumpsterSize[] | null> {
  return null;
}

export async function getWordPressServiceNotices(): Promise<ServiceNotice[] | null> {
  return null;
}
