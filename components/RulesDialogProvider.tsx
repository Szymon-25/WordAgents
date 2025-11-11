"use client";

import * as React from "react";
import RulesCarousel from "./RulesCarousel";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type RulesContextType = {
  open: () => void;
  close: () => void;
  isOpen: boolean;
};

const RulesContext = React.createContext<RulesContextType | null>(null);

export function useRules() {
  const ctx = React.useContext(RulesContext);
  if (!ctx) {
    throw new Error("useRules must be used within RulesDialogProvider");
  }
  return ctx;
}

export function RulesDialogProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);

  return (
    <RulesContext.Provider value={{ open, close, isOpen }}>
      {children}
      <RulesDialog isOpen={isOpen} onClose={close} />
    </RulesContext.Provider>
  );
}

function RulesDialog({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const dialogRef = React.useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;

    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const focusableSelector =
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === "Tab") {
        if (!dialog) return;
        const nodes = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector)).filter(
          (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length
        );
        if (nodes.length === 0) {
          e.preventDefault();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Focus the dialog container
    requestAnimationFrame(() => dialog?.focus());

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="rules-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div
        ref={dialogRef}
        tabIndex={-1}
        className="relative z-10 w-full max-w-3xl mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-lg bg-white border border-border p-4">
          <div className="flex justify-center items-center gap-4">
            {/* <h2 id="rules-dialog-title" className="text-[#110b66] text-lg font-semibold">
              How to play?
            </h2> */}
            <div className="ml-auto">
              <button onClick={onClose} aria-label="Close rules">
                <X className="h-6 w-6 text-[#110b66]" />
              </button>
            </div>
          </div>

          <div className="mt-0">
            <RulesCarousel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RulesDialogProvider;
