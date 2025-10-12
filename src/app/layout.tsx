import "./globals.css";

export const metadata = {
  title: "Jason Moynihan — Portfolio",
  description: "Clean, modern portfolio with glass UI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-[100svh] antialiased selection:bg-accent-500/20 selection:text-accent-600 scrollbar-thin">
        {children}
      </body>
    </html>
  );
}
