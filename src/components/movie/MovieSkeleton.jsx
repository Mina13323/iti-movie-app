import React from "react";
import { cn } from "@/lib/utils";

export default function MovieSkeleton({ className }) {
  return (
    <div className={cn("group relative flex flex-col rounded-md", className)}>
      <div className="aspect-[2/3] w-full bg-muted/20 animate-pulse rounded-md border border-border/5 shadow-sm" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-3/4 bg-muted/30 animate-pulse rounded-sm" />
        <div className="flex gap-2">
          <div className="h-2 w-1/4 bg-muted/20 animate-pulse rounded-sm" />
          <div className="h-2 w-1/4 bg-muted/20 animate-pulse rounded-sm" />
        </div>
      </div>
    </div>
  );
}
