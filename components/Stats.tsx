"use client";
import Link from "next/link";
import useSWR from "swr";
import { useTheme } from "next-themes";
import clsx from "clsx";

import { FaYoutube, FaGithub } from "react-icons/fa";
import { ArrowTrendingUpIcon } from "@heroicons/react/20/solid";

import FlipNumber from "@/components/FlipNumber";
import fetcher from "@/lib/fetcher";
import { addCommas } from "@/lib/utils";

export function YouTube() {
  const { data: youtubeData, error: youtubeDataError } = useSWR(
    `/api/youtube`,
    fetcher,
  );

  if (youtubeDataError) return <div>failed to load</div>;
  return addCommas(youtubeData?.subscribers);
}

export function GitHub() {
  const { data: githubData, error: githubDataError } = useSWR(
    `/api/github?username=araon`,
    fetcher,
  );

  if (githubDataError) return <div>failed to load</div>;
  return addCommas(githubData?.stars);
}

export default function Stats() {
  const { theme } = useTheme();
  const username = "araon";

  const swrConfig = {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
    refreshInterval: 300000,
    errorRetryCount: 2,
  };

  const { data: githubData } = useSWR(
    `/api/github?username=${username}`,
    fetcher,
    swrConfig
  );
  
  const { data: postsData } = useSWR(
    `/api/prisma/hitsTotal`,
    fetcher,
    swrConfig
  );

  const stars = typeof githubData?.stars === 'number' && Number.isFinite(githubData.stars) && githubData.stars >= 0
    ? githubData.stars
    : undefined;
  const views = typeof postsData?.total === 'number' && Number.isFinite(postsData.total) && postsData.total >= 0
    ? postsData.total
    : undefined;

  return (
    <ul
      className={clsx(
        "animated-list space-y-2",
        theme === "terminal" ? "font-mono tracking-tight" : "",
      )}
      aria-label="Profile statistics"
    >
      <li className="transition-opacity">
        <Link
          className="flex items-center gap-3 no-underline hover:text-primary transition-colors"
          href={"https://github.com/araon"}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={stars === undefined ? 'GitHub repository stars unavailable' : `${stars} GitHub repository stars`}
        >
          <FaGithub className="text-xl" aria-hidden="true" />
          <div>
            <FlipNumber>
              {stars === undefined ? '—' : addCommas(stars)}
            </FlipNumber>
            <span> Repository Stars</span>
          </div>
        </Link>
      </li>
      <li className="transition-opacity">
        <Link 
          className="flex items-center gap-3 hover:text-primary transition-colors" 
          href="/blog"
          aria-label={views === undefined ? 'Total blog views unavailable' : `${views} total blog views`}
        >
          <ArrowTrendingUpIcon className="h-5 w-5" aria-hidden="true" />
          <div>
            <FlipNumber>
              {views === undefined ? '—' : addCommas(views)}
            </FlipNumber>
            <span> Total Blog Views</span>
          </div>
        </Link>
      </li>
    </ul>
  );
}
