'use client';

import Image from 'next/image';
import useSWR from 'swr';

import fetcher from '@/lib/fetcher';

type Track = {
  title: string;
  artist: string;
  url: string;
  coverImage: string;
  playedAt?: string;
};

function formatPlayedAt(playedAt?: string) {
  if (!playedAt) {
    return 'recently';
  }

  return new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(playedAt));
}

export default function RecentTracks() {
  const { data: tracks, error } = useSWR<Track[]>(
    '/api/spotify/recently-played',
    fetcher,
  );

  if (error) {
    return <p className="text-sm text-tertiary">Could not load music.</p>;
  }

  if (!tracks) {
    return (
      <div className="grid gap-3">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="h-[58px] animate-pulse rounded-lg bg-tertiary"
          />
        ))}
      </div>
    );
  }

  return (
    <ul className="animated-list grid gap-3">
      {tracks.slice(0, 4).map((track) => (
        <li key={`${track.title}-${track.playedAt}`} className="transition-opacity">
          <a
            href={track.url}
            target="_blank"
            rel="noopener noreferrer"
            className="grid grid-cols-[48px_1fr_auto] items-center gap-3 rounded-lg border border-secondary p-2 no-underline transition-colors hover:bg-tertiary"
          >
            <Image
              src={track.coverImage}
              alt=""
              width={48}
              height={48}
              className="aspect-square rounded-md object-cover"
            />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium text-primary">
                {track.title}
              </span>
              <span className="block truncate text-sm text-secondary">
                {track.artist}
              </span>
            </span>
            <time className="hidden whitespace-nowrap text-xs text-tertiary sm:block">
              {formatPlayedAt(track.playedAt)}
            </time>
          </a>
        </li>
      ))}
    </ul>
  );
}
