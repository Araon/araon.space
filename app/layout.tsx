import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import clsx from "clsx";
import { PHProvider, PostHogPageview } from "@/providers/PostHog";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";

const inter = localFont({
  src: "../public/fonts/google/inter-400.ttf",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: "../public/fonts/google/space-grotesk-400.ttf",
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = localFont({
  src: "../public/fonts/google/space-mono-400.ttf",
  variable: "--font-space-mono",
  display: "swap",
});

const matrixSans = localFont({
  src: "../public/fonts/matrix-sans/MatrixSansPrint-Regular.woff2",
  variable: "--font-matrix-sans",
});

export const metadata: Metadata = {
  title: "Home | Araon",
  description: "Code • Camera • Chaos",
  metadataBase: new URL("https://araon.space"),
  openGraph: {
    title: "araon.space",
    description: "Code • Camera • Chaos",
    images: [
      {
        url: `https://ik.imagekit.io/ara0n/Blog_Images/why_are_you_still_awake.jpeg`,
        alt: "araon.space",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "araon.space",
    description: "Code • Camera • Chaos",
    images: [
      `https://ik.imagekit.io/ara0n/Blog_Images/why_are_you_still_awake.jpeg`,
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://ik.imagekit.io" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Araon's Blog RSS Feed"
          href="/api/rss"
        />
        <link
          rel="alternate"
          type="application/json"
          title="Araon's Blog JSON Feed"
          href="/api/rss/json"
        />
      </head>
      <body
        className={clsx(
          inter.className,
          spaceGrotesk.variable,
          spaceMono.variable,
          matrixSans.variable,
          "width-full bg-primary text-primary antialiased",
        )}
      >
        <PHProvider>
          <Suspense>
            <PostHogPageview />
          </Suspense>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navigation />
            <main
              id="main-content"
              className={
                "mx-auto max-w-[700px] px-6 pb-24 pt-16 md:px-8 md:pb-44 md:pt-20"
              }
            >
              {children}
            </main>
          </ThemeProvider>
        </PHProvider>
      </body>
    </html>
  );
}
