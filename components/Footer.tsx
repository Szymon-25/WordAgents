"use client";

import { Heart, Github, Mail } from "lucide-react";

export function Footer() {
  return (
    <div className="relative z-50 rounded-xl border border-border/30 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md shadow-sm p-0.5">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 max-w-screen-2xl mx-auto px-2 py-2">
        {/* Left section - Copyright */}
        <div className="flex items-center gap-2 text-white/80 text-sm">
          <span>Word Agents © 2025</span>
          <span className="hidden sm:inline">•</span>
          <span className="flex items-center gap-1">
            Made with <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" />
          </span>
        </div>

        

        {/* Center section - Links */}
        <div className="text-white/60 text-xs hidden lg:block">
          {/* <a 
            href="https://github.com/Szymon-25/Codenames" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden md:inline">Source Code</span>
          </a> 
          <span className="text-white/30">|</span>*/}
          <a 
            href="mailto:contact@wordagents.com" 
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <Mail className="h-4 w-4" />
            <span className="hidden md:inline">Contact</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
