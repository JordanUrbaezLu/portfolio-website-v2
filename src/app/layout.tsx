import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { profile } from "@/data/profile";

/* One family for the whole site, self-hosted and subset to latin.
   Archivo's wdth axis (62–125) covers every role: condensed for data labels,
   normal for body, expanded for display. A second face for the measurements
   would have cost more bytes than all of this page's JavaScript, on a site
   whose argument is about weight. `tabular-nums` does the job a mono was
   there for. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
  axes: ["wdth"],
});

const title = `${profile.name} — ${profile.role}`;
const description = profile.subhead;

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: title,
    template: `%s · ${profile.name}`,
  },
  description,
  applicationName: `${profile.name} — Portfolio`,
  authors: [{ name: profile.name }],
  creator: profile.name,
  keywords: [
    "Jordan Urbaez-Lu",
    "Senior Software Engineer",
    "Web Performance",
    "Core Web Vitals",
    "React",
    "Next.js",
    "TypeScript",
    "GraphQL",
    "Walmart Global Tech",
    "Frontend Architecture",
  ],
  openGraph: {
    type: "website",
    url: profile.siteUrl,
    title,
    description,
    siteName: `${profile.name} — Portfolio`,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${profile.name} — ${profile.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: profile.siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#08090a",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="min-h-[100svh] bg-void text-paper antialiased">
        {children}
      </body>
    </html>
  );
}
