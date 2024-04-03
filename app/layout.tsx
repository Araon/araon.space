import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import clsx from "clsx";
import { PHProvider, PostHogPageview } from "@/providers/PostHog";
import { Suspense } from "react";

import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Home | Araon",
  description: "loves cs, electronics, retro and bikes",
  openGraph: {
    images: [
      {
        url: `https://ik.imagekit.io/ara0n/Blog_Images/why_are_you_still_awake.jpeg`,
        alt: "araon.space",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <PHProvider>
        <body
          className={clsx(
            inter.className,
            "width-full bg-primary text-primary antialiased",
          )}
        >
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Navigation />
            <div
              className={
                "mx-auto max-w-[700px] px-6 pb-24 pt-16 md:px-6 md:pb-44 md:pt-20"
              }
            >
              {children}
            </div>
          </ThemeProvider>
          <Analytics />
        </body>
      </PHProvider>
    </html>
  );
}
