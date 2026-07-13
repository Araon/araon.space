"use client";

import posthog from "posthog-js";

type ShareButtonsProps = {
  slug: string;
  title: string;
};

export default function ShareButtons({ slug, title }: ShareButtonsProps) {
  const url = `https://araon.space/blog/${slug}`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;

  const trackShare = (channel: "x" | "native") => {
    posthog.capture("blog_post_shared", {
      blog_slug: slug,
      blog_title: title,
      channel,
    });
  };

  const shareNatively = async () => {
    trackShare("native");
    if (navigator.share) {
      try {
        await navigator.share({ title, text: title, url });
      } catch {
        // A user cancelling the platform share sheet is not an error worth surfacing.
      }
      return;
    }

    await navigator.clipboard?.writeText(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-secondary">Share:</span>
      <a
        href={tweetUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackShare("x")}
        className="flex min-h-[44px] items-center gap-1.5 rounded-lg border border-secondary px-3 py-2 text-sm text-secondary transition-colors hover:border-primary hover:text-primary"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        <span>Post</span>
      </a>
      <button
        type="button"
        onClick={shareNatively}
        className="min-h-[44px] rounded-lg border border-secondary px-3 py-2 text-sm text-secondary transition-colors hover:border-primary hover:text-primary"
      >
        Share link
      </button>
    </div>
  );
}
