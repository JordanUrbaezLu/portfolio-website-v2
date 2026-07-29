import { Chroma } from "@/components/ui/Chroma";

/**
 * Section headings carry a channel code rather than a decorative 01/02/03 —
 * these sections are not a sequence, so numbering them would assert an order
 * that isn't there. The code is a label, the way a patch bay is labelled.
 */
export function SectionHead({
  code,
  title,
  note,
}: {
  code: string;
  title: string;
  note?: string;
}) {
  return (
    <div className="silkscreen pt-6">
      <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
        <span className="label">{code}</span>
        <h2 className="display-lg text-[clamp(1.875rem,4.5vw,3.25rem)]">
          <Chroma>{title}</Chroma>
        </h2>
        {note && (
          <p className="ml-auto max-w-[38ch] text-[0.9375rem] leading-snug text-dim">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
