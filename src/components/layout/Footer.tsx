import { SessionReceipt } from "@/components/instrument/SessionReceipt";
import { profile } from "@/data/profile";

export function Footer({ year }: { year: number }) {
  return (
    <footer className="mt-28 border-t border-rule px-4 py-10 md:mt-36 md:px-5">
      <div className="mx-auto grid max-w-[86rem] gap-x-16 gap-y-10 md:grid-cols-[1fr_auto_auto]">
        <div>
          <p className="display-sm text-base text-paper">{profile.name}</p>
          <p className="label mt-2">
            © {year} · {profile.location}
          </p>
        </div>

        {/* Colophon. On a portfolio arguing about weight, the build is content. */}
        <div className="max-w-[42ch]">
          <p className="label">Colophon</p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-faint">
            Next.js and React. No UI framework, no animation library, no icon
            package — three runtime dependencies in total. One self-hosted
            variable typeface carries every width and weight on the page. No
            analytics, no cookies, no third-party scripts: the telemetry in
            the bar below is read from your own session on your own device
            and never leaves it.
          </p>
        </div>

        <SessionReceipt />
      </div>
    </footer>
  );
}
