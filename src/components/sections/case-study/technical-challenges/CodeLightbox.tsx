import { CopyButton } from "./CopyButton";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeLightboxProps {
  language: string;
  snippet: string;
  caption?: string;
  open: boolean;
  onClose: () => void;
}

export function CodeLightbox({
  language,
  snippet,
  caption,
  open,
  onClose,
}: CodeLightboxProps) {
  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev || "";
      };
    }
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      style={{ zIndex: 10000 }}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
            <span className="text-sm uppercase tracking-wider text-white/50">
              {language}
            </span>
            <div className="flex items-center gap-2">
              <CopyButton text={snippet} />
              <button
                onClick={onClose}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-2 py-1 text-xs text-white/70 hover:bg-white/5 cursor-pointer"
                aria-label="Close"
              >
                <X className="h-3.5 w-3.5" />
                Close
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <SyntaxHighlighter
              language={language.toLowerCase()}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                padding: "1rem",
                background: "transparent",
                fontSize: "14px",
                lineHeight: "1.6",
                height: "100%",
              }}
              codeTagProps={{
                style: {
                  fontFamily: "inherit",
                },
              }}
            >
              {snippet}
            </SyntaxHighlighter>
          </div>
          {caption && (
            <div className="border-t border-white/10 px-4 py-3 text-sm text-white/50">
              {caption}
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
