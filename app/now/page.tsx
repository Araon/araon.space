import { Metadata } from 'next';

import Link from '@/components/ui/Link';

import RecentTracks from './components/RecentTracks';

export const metadata: Metadata = {
  title: 'Now | Araon',
  description: 'What Araon is focused on right now.',
};

const building = [
  {
    title: 'Local-first AI tools',
    detail:
      'Small browser and desktop experiments where the interesting work happens on the machine, not on somebody else\'s server.',
  },
  {
    title: 'Tiny language models',
    detail:
      'Training small models from scratch, learning CUDA the hard way, and trying to understand what the GPU is actually doing.',
  },
  {
    title: 'Systems-shaped side quests',
    detail:
      'Schedulers, scrapers, simulations, bots, and other projects that start with “what if I just built a small version of this?”',
  },
];

const learning = [
  'CUDA, memory, and why GPUs make simple ideas complicated',
  'Database internals and distributed systems',
  'Local embeddings, semantic search, and browser automation',
  'How to write about technical things without sanding off the weird parts',
];

const currentStack = [
  'Next.js, TypeScript, Python, Postgres, Prisma',
  'PyTorch, CUDA, local embeddings, and small models',
  'Chrome extensions, scrapers, schedulers, bots, and simulation code',
  'An RTX 3080 that keeps teaching me humility',
];

const offline = [
  'Taking more photographs before they disappear into the hard drive',
  'Riding my bike when the weather and my calendar agree',
  'Listening to music loudly enough for Spotify to build a personality profile',
  'Trying to keep games as a way to stay close to old friends, not another backlog',
];

const recentlyShipped = [
  {
    title: 'Lookalike',
    href: '/projects/lookalike',
    detail: 'local semantic tab grouping for Chrome',
  },
  {
    title: 'Micro-LLM',
    href: '/projects/micro-llm',
    detail: 'a tiny language model trained from scratch',
  },
  {
    title: 'Sensex Simulation Engine',
    href: '/projects/sensex-simulation-engine',
    detail: 'market simulation with news sentiment',
  },
];

const avoiding = [
  'Pretending every side project needs to become a startup',
  'Turning every hobby into a content pipeline',
  'Buying another domain before finishing the thing that needed the last one',
];

const openTo = [
  'Backend, infra, AI tooling, hardware, and weird software ideas',
  'Photography walks, music recommendations, and thoughtful internet friendships',
  'Small collaborations where the scope is clear and the curiosity is real',
];

const notOpenTo = [
  'Vague startup pitches',
  'Meetings without a reason',
  'Anything that needs me to pretend I am more polished than I am',
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="animated-list flex flex-col gap-3 text-secondary">
      {items.map((item) => (
        <li key={item} className="transition-opacity">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function NowPage() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <div className="flex animate-in flex-col gap-8">
        <div>
          <p className="animate-in text-secondary nothing-matrix">Right now</p>
          <h1
            className="animate-in text-3xl font-bold tracking-tight text-primary"
            style={{ '--index': 1 } as React.CSSProperties}
          >
            Araon, now
          </h1>
        </div>

        <div
          className="flex max-w-2xl animate-in flex-col gap-5 text-primary"
          style={{ '--index': 2 } as React.CSSProperties}
        >
          <p>
            I am working at ToneTag, building software, and spending the rest of
            my useful attention on small systems projects, local AI experiments,
            writing, photos, music, and the occasional attempt to make sense of
            life through machines.
          </p>
          <p className="text-secondary">
            This is the page I would point to if a friend asked, “what are you
            up to these days?”
          </p>
          <p className="text-sm text-tertiary">
            Updated July 2026 from India. Next update: when this starts lying.
          </p>
        </div>
      </div>

      <section
        className="flex animate-in flex-col gap-6"
        style={{ '--index': 3 } as React.CSSProperties}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-secondary nothing-matrix">Building</h2>
          <Link href="/projects" className="text-sm text-tertiary">
            older work
          </Link>
        </div>

        <div className="grid gap-3">
          {building.map((item) => (
            <div
              key={item.title}
              className="rounded-lg border border-secondary bg-tertiary p-4"
            >
              <h3 className="font-medium text-primary">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-secondary">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        className="grid animate-in gap-12 md:grid-cols-[1fr_1fr]"
        style={{ '--index': 4 } as React.CSSProperties}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-secondary nothing-matrix">Learning</h2>
          <BulletList items={learning} />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-secondary nothing-matrix">Current stack</h2>
          <BulletList items={currentStack} />
        </div>
      </section>

      <section
        className="flex animate-in flex-col gap-5"
        style={{ '--index': 5 } as React.CSSProperties}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-secondary nothing-matrix">Writing</h2>
          <Link href="/blog" className="text-sm text-tertiary">
            latest rambles
          </Link>
        </div>
        <p className="text-primary">
          Lately I keep circling the same themes: computers as a way to
          understand the world, games as memory, grief as a recurring process,
          and the strange optimism required to keep building things anyway.
        </p>
      </section>

      <section
        className="flex animate-in flex-col gap-5"
        style={{ '--index': 6 } as React.CSSProperties}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-secondary nothing-matrix">Recently shipped</h2>
          <Link href="/projects" className="text-sm text-tertiary">
            all work
          </Link>
        </div>
        <ul className="animated-list grid gap-3">
          {recentlyShipped.map((project) => (
            <li key={project.href} className="transition-opacity">
              <Link
                href={project.href}
                className="block rounded-lg border border-secondary p-4 no-underline transition-colors hover:bg-tertiary"
              >
                <span className="font-medium text-primary">
                  {project.title}
                </span>
                <span className="mt-1 block text-sm text-secondary">
                  {project.detail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="grid animate-in gap-12 md:grid-cols-[1fr_1fr]"
        style={{ '--index': 7 } as React.CSSProperties}
      >
        <div className="flex flex-col gap-4">
          <h2 className="text-secondary nothing-matrix">Offline</h2>
          <BulletList items={offline} />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-secondary nothing-matrix">Avoiding</h2>
          <BulletList items={avoiding} />
        </div>
      </section>

      <section
        className="flex animate-in flex-col gap-5"
        style={{ '--index': 8 } as React.CSSProperties}
      >
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-secondary nothing-matrix">Music</h2>
          <Link href="/music" className="text-sm text-tertiary">
            more tracks
          </Link>
        </div>
        <p className="text-primary">
          Current soundtrack is whatever helps me stay at the desk a little
          longer. This changes with whatever I have been looping lately.
        </p>
        <RecentTracks />
      </section>

      <section
        className="grid animate-in gap-6 md:grid-cols-2"
        style={{ '--index': 9 } as React.CSSProperties}
      >
        <div className="rounded-lg border border-primary p-4">
          <h2 className="text-secondary nothing-matrix">Open to</h2>
          <div className="mt-4">
            <BulletList items={openTo} />
          </div>
        </div>

        <div className="rounded-lg border border-primary p-4">
          <h2 className="text-secondary nothing-matrix">Not open to</h2>
          <div className="mt-4">
            <BulletList items={notOpenTo} />
          </div>
        </div>
      </section>

      <footer
        className="animate-in border-t border-secondary pt-6 text-sm text-tertiary"
        style={{ '--index': 10 } as React.CSSProperties}
      >
        Last updated July 2026, from India. Inspired by{' '}
        <Link href="https://nownownow.com/about">nownownow.com</Link>.
      </footer>
    </div>
  );
}
