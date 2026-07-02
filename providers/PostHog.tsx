// app/providers.tsx
"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const DEPLOY_VERSION =
  process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA ||
  process.env.NEXT_PUBLIC_VERCEL_DEPLOYMENT_ID ||
  `dev-${new Date().toISOString().slice(0, 10)}`;

if (typeof window !== "undefined") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: false,
    capture_exceptions: true,
    capture_performance: {
      network_timing: true,
      web_vitals: true,
    },
  });

  posthog.register({ deploy_version: DEPLOY_VERSION });
}

export function PostHogPageview(): JSX.Element {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      let url = window.origin + pathname;
      if (searchParams && searchParams.toString()) {
        url = url + `?${searchParams.toString()}`;
      }
      posthog.capture("$pageview", {
        $current_url: url,
        deploy_version: DEPLOY_VERSION,
      });
      posthog.people.set({ deploy_version: DEPLOY_VERSION });
    }
  }, [pathname, searchParams]);

  return <></>;
}

export function PHProvider({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
