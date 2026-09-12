import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Cormorant_Garamond, DM_Sans } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { HeistProvider } from "@/lib/store";
import "./globals.css";

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
});

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-barlow",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

export const metadata: Metadata = {
  title: "Street Heists",
  description:
    "A short comedy-heist mystery. Inspect provided clues, make one accusation, and crack the case.",
  applicationName: "Street Heists",
  appleWebApp: {
    capable: true,
    title: "Street Heists",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: "/keyhole.svg",
    apple: "/keyhole.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#EEF2F6",
  width: "device-width",
  initialScale: 1,
  // Allow pinch-zoom for accessibility; do not lock maximumScale.
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable} ${serif.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <HeistProvider>
          <AppShell>{children}</AppShell>
        </HeistProvider>
      </body>
    </html>
  );
}
