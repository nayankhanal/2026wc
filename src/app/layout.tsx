import type { Metadata } from "next";
import { Oswald, Inter, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const heading = Oswald({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026 World Cup Wallchart",
  description: "Live, auto-advancing bracket for the 2026 FIFA World Cup — groups, knockout wallchart, and results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border/60 sticky top-0 z-40 backdrop-blur bg-background/80">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 flex items-center justify-between h-16">
            <Link href="/" className="font-heading text-lg sm:text-xl tracking-wide uppercase">
              <span className="text-gradient-gold">2026</span>{" "}
              <span className="text-foreground">World Cup</span>
            </Link>
            <nav className="flex items-center gap-1 sm:gap-2 text-sm font-medium">
              <Link href="/groups" className="px-3 py-2 rounded-md hover:bg-accent transition-colors">
                Groups
              </Link>
              <Link href="/bracket" className="px-3 py-2 rounded-md hover:bg-accent transition-colors">
                Bracket
              </Link>
              <Link
                href="/admin"
                className="px-3 py-2 rounded-md hover:bg-accent transition-colors text-muted-foreground"
              >
                Admin
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border/60 mt-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 text-sm text-muted-foreground flex flex-col sm:flex-row gap-2 sm:justify-between">
            <span>Unofficial fan-made wallchart. Not affiliated with FIFA.</span>
            <span>USA · Canada · Mexico 2026</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
