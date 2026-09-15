import { NextRequest, NextResponse } from "next/server";

// Southern Wisconsin service area: Walworth, Rock, Jefferson, Waukesha, Kenosha counties.
// Biases results toward this region without excluding addresses outside it.
const SERVICE_AREA_VIEWBOX = "-88.9,43.1,-87.8,42.3";

type NominatimResult = {
  display_name: string;
  lat: string;
  lon: string;
  address?: Record<string, string>;
};

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 3) {
    return NextResponse.json({ results: [] });
  }

  const params = new URLSearchParams({
    format: "jsonv2",
    q,
    countrycodes: "us",
    addressdetails: "1",
    limit: "5",
    viewbox: SERVICE_AREA_VIEWBOX,
    bounded: "0"
  });

  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: {
        // Nominatim's usage policy requires a valid identifying User-Agent for server-side requests.
        "User-Agent": "NDSES-Website/1.0 (info@ndses.com)",
        "Accept-Language": "en"
      }
    });

    if (!response.ok) {
      return NextResponse.json({ results: [] }, { status: 502 });
    }

    const data = (await response.json()) as NominatimResult[];
    const results = data.map((item) => ({
      label: item.display_name,
      lat: Number(item.lat),
      lon: Number(item.lon),
      county: item.address?.county?.replace(/ County$/, "") ?? null,
      state: item.address?.state ?? null
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Geocode request failed", error);
    return NextResponse.json({ results: [] }, { status: 502 });
  }
}
