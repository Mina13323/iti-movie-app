import React from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrailerPlayer({ trailer, title, className }) {
  if (!trailer) {
    return (
      <div className={cn(
        "aspect-video w-full rounded-xl bg-muted border border-dashed border-border flex flex-col items-center justify-center text-muted-foreground",
        className
      )}>
        <Play className="size-16 opacity-20 mb-4" />
        <p className="font-bold uppercase tracking-widest text-sm text-center px-4">
          Trailer unavailable
        </p>
      </div>
    );
  }

  return (
    <div className={cn(
      "relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-border group bg-black",
      className
    )}>
      <iframe 
        src={`https://www.youtube.com/embed/${trailer.key}?autoplay=0&controls=1&rel=0`}
        title={`${title} Trailer`}
        className="w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
