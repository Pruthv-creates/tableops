"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { toast } from "@/shared/components/ui/use-toast";
import { Loader2, MapPin, Info } from "lucide-react";

interface GoogleMapsImportProps {
  onImport: (data: any) => void;
}

function extractFromFullUrl(url: string) {
  // Works only on full Google Maps URLs like:
  // https://www.google.com/maps/place/Blue+Tokai+Coffee/@12.93,...
  const placeMatch = url.match(/\/place\/([^/@?]+)/);
  let name = "";
  if (placeMatch?.[1]) {
    const raw = decodeURIComponent(placeMatch[1].replace(/\+/g, " ")).trim();
    if (raw && !/^[\d\-.,]+$/.test(raw) && raw.length > 2) {
      name = raw;
    }
  }

  // Try extracting address components from the URL if present
  const coordMatch = url.match(/@([-\d.]+),([-\d.]+)/);

  return { name, hasCoords: !!coordMatch };
}

export const GoogleMapsImport = ({ onImport }: GoogleMapsImportProps) => {
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);

  const isFullUrl = url.includes("google.com/maps") && url.includes("/place/");
  const isShortUrl = url.includes("share.google") || url.includes("goo.gl");

  const handleFetch = () => {
    if (!url.trim()) return;

    if (isShortUrl) {
      return toast({
        title: "Short links not supported",
        description: "Use the full URL from your browser's address bar. Open Maps → tap Share → Copy Link to maps.google.com",
        variant: "destructive"
      });
    }

    if (!isFullUrl) {
      return toast({
        title: "Invalid URL",
        description: "Paste the full Google Maps URL from your browser address bar (starts with google.com/maps/place/...).",
        variant: "destructive"
      });
    }

    setFetching(true);
    try {
      const { name } = extractFromFullUrl(url);
      onImport({
        name: name || "",
        rating: null,
        mobile: "",
        image: "",
        address: { line1: "", area: "", city: "", state: "", pincode: "" }
      });

      setUrl("");
      toast({
        title: name ? `✅ "${name}" loaded` : "⚠️ Name not found",
        description: name
          ? "Verify and fill in remaining details, then save."
          : "Please type the restaurant name manually."
      });
    } finally {
      setFetching(false);
    }
  };

  return (
    <Card className="rounded-[24px] shadow-sm border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-5 w-full flex flex-col gap-4">
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <MapPin size={20} className="text-indigo-500" /> Google Maps Import
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Paste the <strong>full browser address bar URL</strong> from Google Maps to auto-fill the restaurant name.
        </p>
      </div>

      {/* How-to hint */}
      <div className="flex items-start gap-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 rounded-xl p-3 text-xs text-blue-700 dark:text-blue-300">
        <Info size={14} className="mt-0.5 shrink-0" />
        <span>
          Open the restaurant on <strong>Google Maps</strong> in your browser → copy the URL from the address bar (looks like{" "}
          <code className="bg-blue-100 dark:bg-blue-900/40 px-1 rounded">
            google.com/maps/place/Name/@...
          </code>
          )
        </span>
      </div>

      {/* Short link warning */}
      {isShortUrl && (
        <div className="text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-xl p-2">
          ❌ Short share links don't contain the restaurant data. Use the full URL instead.
        </div>
      )}

      <div className="flex gap-2">
        <Input
          placeholder="https://www.google.com/maps/place/..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleFetch()}
          className="bg-white/50 dark:bg-[#020617]/50 border-slate-200 dark:border-white/10 rounded-xl text-xs"
        />
        <Button
          onClick={handleFetch}
          disabled={fetching || !url}
          className="rounded-xl shrink-0"
        >
          {fetching ? <Loader2 className="animate-spin" size={18} /> : "Load"}
        </Button>
      </div>
    </Card>
  );
};
