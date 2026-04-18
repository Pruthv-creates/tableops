import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "No URL provided" }, { status: 400 });

    // Follow the redirect with a browser-like User-Agent so Google doesn't serve a stripped page
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      }
    });

    const finalUrl = response.url;

    // Attempt to extract name from the final redirected URL
    // Google Maps full URL format: /maps/place/BUSINESS+NAME/@lat,lng,...
    let name = "";
    let lat = "";
    let lng = "";

    const placeMatch = finalUrl.match(/\/place\/([^/@?]+)/);
    if (placeMatch?.[1]) {
      const raw = decodeURIComponent(placeMatch[1].replace(/\+/g, " ")).trim();
      // Filter out GPS coordinates, random tokens, etc.
      if (raw && !/^[\d\-.,]+$/.test(raw) && raw.length > 2) {
        name = raw;
      }
    }

    const coordMatch = finalUrl.match(/@([-\d.]+),([-\d.]+)/);
    if (coordMatch) {
      lat = coordMatch[1];
      lng = coordMatch[2];
    }

    // If we have an API key, use Google Places Nearby/Text search
    const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
    
    if (GOOGLE_API_KEY) {
      try {
        const searchQuery = name || (lat && lng ? undefined : null);
        let placeDetails = null;

        if (searchQuery) {
          const searchRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(searchQuery)}&inputtype=textquery&fields=name,formatted_address,rating,formatted_phone_number,photos,types&key=${GOOGLE_API_KEY}`
          );
          const searchData = await searchRes.json();
          placeDetails = searchData.candidates?.[0];
        } else if (lat && lng) {
          const nearbyRes = await fetch(
            `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=50&key=${GOOGLE_API_KEY}`
          );
          const nearbyData = await nearbyRes.json();
          placeDetails = nearbyData.results?.[0];
        }

        if (placeDetails) {
          const addrParts = placeDetails.formatted_address?.split(",") ?? [];
          return NextResponse.json({
            name: placeDetails.name || name,
            rating: placeDetails.rating || null,
            mobile: placeDetails.formatted_phone_number || "",
            image: placeDetails.photos?.[0]
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${placeDetails.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
              : "",
            address: {
              line1: addrParts[0]?.trim() || "",
              area: addrParts[1]?.trim() || "",
              city: addrParts[2]?.trim() || "",
              state: addrParts[3]?.trim() || "",
              pincode: addrParts[4]?.trim() || "",
            },
            finalUrl,
            source: "places_api"
          });
        }
      } catch (_) {
        // Fall through to URL-parse fallback
      }
    }

    // Fallback: return only what we could extract — empty string instead of "Unknown"
    return NextResponse.json({
      name: name || "",          // empty string = the form field stays blank & focused
      rating: null,
      mobile: "",
      image: "",
      address: { line1: "", area: "", city: "", state: "", pincode: "" },
      finalUrl,
      source: "url_parse"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
