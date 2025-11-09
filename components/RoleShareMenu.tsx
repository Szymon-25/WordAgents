"use client";

import { useState } from "react";
import { GameParams } from "@/types";
import { getShareUrl, copyToClipboard } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Copy, Share2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoleShareMenuProps {
  params: GameParams;
  seed: string;
  className?: string;
}

export function RoleShareMenu({ params, seed, className }: RoleShareMenuProps) {
  const [open, setOpen] = useState(false);

  const masterUrl = getShareUrl({ ...params, seed, role: "master" });
  const guesserUrl = getShareUrl({ ...params, seed, role: "guesser" });

  const handleCopy = async (role: "master" | "guesser") => {
    const url = role === "master" ? masterUrl : guesserUrl;
    await copyToClipboard(url);
  };

  return (
    <div className={cn("relative inline-block text-left z-50", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(o => !o)}
        className="font-semibold flex items-center gap-2 bg-white/70 hover:bg-white/90 backdrop-blur-sm"
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Share2 className="h-4 w-4" />
        <span className="hidden sm:inline">Share links</span>
        <span className="sm:hidden">Share</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </Button>
      {open && (
        <div
          role="menu"
          className="absolute z-50 mt-2 origin-top-right rounded-lg border border-gray-300 bg-gray-100 text-gray-900 shadow-lg p-2 flex flex-col gap-1 min-w-0 w-max"
          style={{ maxWidth: "calc(100vw - 2rem)" }}
        >
          <button
            type="button"
            onClick={() => handleCopy("master")}
            className={cn(
              "group flex items-center justify-between gap-2 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-gray-200 active:bg-gray-300 text-gray-900"
            )}
          >
            <span className="flex items-center gap-2">
              <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" /> Spymaster
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleCopy("guesser")}
            className={cn(
              "group flex items-center justify-between gap-2 w-full rounded-md px-3 py-2 text-sm font-medium transition-colors",
              "hover:bg-gray-200 active:bg-gray-300 text-gray-900"
            )}
          >
            <span className="flex items-center gap-2">
              <Copy className="h-4 w-4 group-hover:scale-110 transition-transform" /> Guesser
            </span>
          </button>
        </div>
      )}
    </div>
  );
}

export default RoleShareMenu;
