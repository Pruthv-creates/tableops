"use client";

import { Button } from "@/shared/components/ui/button";
import { Card } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { toast } from "@/shared/components/ui/use-toast";

interface BulkImportProps {
  onImport: (data: any[]) => void;
}

export const BulkImport = ({ onImport }: BulkImportProps) => {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      
      const lines = text.split('\n');
      if (lines.length < 2) return toast({ title: "Invalid File", description: "CSV must have headers and at least one row.", variant: "destructive" });
      
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
      const results = [];
      const regex = /,(?=(?:(?:[^"]*"){2})*[^"]*$)/;
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(regex).map(v => v.trim().replace(/^"|"$/g, ''));
        const obj: any = {};
        headers.forEach((h, index) => {
          obj[h] = values[index];
        });
        
        results.push({
          name: obj.name || "Imported Restaurant",
          owner: obj.owner || "Unknown",
          mobile: obj.mobile || "N/A",
          type: obj.type || "Cafe",
          image: obj.image || "",
          address: {
            line1: obj.address_line1 || "",
            area: obj.address_area || "",
            city: obj.address_city || "",
            state: obj.address_state || "",
            pincode: obj.address_pincode || ""
          }
        });
      }
      
      onImport(results);
    };
    reader.readAsText(file);
  };

  return (
    <Card className="rounded-[24px] shadow-sm dark:shadow-none border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5 backdrop-blur-xl p-5 w-full flex flex-col gap-4">
      <div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
          <span className="text-xl">📁</span> Bulk Import (CSV)
        </h3>
        <p className="text-sm text-slate-500 max-w-full my-2">Upload a flat CSV to add hundreds of listings instantly.</p>
        <p className="text-[10px] text-slate-500 mt-2 font-mono bg-white/50 dark:bg-white/10 p-2 rounded-xl border border-slate-200 dark:border-white/5 truncate" title="name, owner, mobile, type, image, address_line1, address_area, address_city, address_state, address_pincode">
          <strong className="text-slate-800 dark:text-slate-300">Format:</strong> name, owner, mobile, type, image, address_...
        </p>
      </div>
      <Input 
        type="file" 
        accept=".csv" 
        onChange={handleFileUpload} 
        className="cursor-pointer bg-white/50 dark:bg-[#020617]/50 border-white/20 dark:border-white/10 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 h-auto py-2" 
      />
    </Card>
  );
};
