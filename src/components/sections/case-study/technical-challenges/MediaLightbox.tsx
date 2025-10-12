import Image from "next/image";

interface MediaLightboxProps {
  src: string;
  alt?: string;
  type: "image" | "video";
  open: boolean;
  onClose: () => void;
}

export function MediaLightbox({
  src,
  alt,
  type,
  open,
  onClose,
}: MediaLightboxProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-w-5xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {type === "image" ? (
          <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
            <Image
              src={src}
              alt={alt || "Lightbox image"}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              className="rounded-2xl object-contain"
              quality={90}
            />
          </div>
        ) : (
          <video src={src} controls className="w-full rounded-2xl" />
        )}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/80 text-sm hover:text-white"
        >
          Close
        </button>
      </div>
    </div>
  );
}
