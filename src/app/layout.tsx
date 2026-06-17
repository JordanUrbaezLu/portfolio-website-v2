import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { profile } from "@/data/profile";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
    "Frontend Engineer",
    "React",
    "Next.js",
    "TypeScript",
    "GraphQL",
    "Web Performance",
    "Core Web Vitals",
    "Portfolio",
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
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: profile.siteUrl,
  },
};

export const viewport: Viewport = {
  themeColor: "#060812",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-[100svh] antialiased scrollbar-thin">
        {children}
      </body>
    </html>
  );
}
