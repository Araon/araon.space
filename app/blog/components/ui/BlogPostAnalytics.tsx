"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";

type BlogPostAnalyticsProps = {
  slug: string;
  title: string;
};

export default function BlogPostAnalytics({
  slug,
  title,
}: BlogPostAnalyticsProps) {
  const hasTrackedEngagedRead = useRef(false);

  useEffect(() => {
    posthog.capture("blog_post_viewed", { blog_slug: slug, blog_title: title });

    const onScroll = () => {
      if (hasTrackedEngagedRead.current) return;

      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0 || window.scrollY / scrollableHeight < 0.5) return;

      hasTrackedEngagedRead.current = true;
      posthog.capture("blog_post_engaged", {
        blog_slug: slug,
        blog_title: title,
        engagement: "50_percent_scroll",
      });
      window.removeEventListener("scroll", onScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug, title]);

  return null;
}
