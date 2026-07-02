import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { allProjects, Project } from ".contentlayer/generated";
import Halo from "@/components/ui/Halo";

export const metadata: Metadata = {
  title: "Works | Araon",
  description: "Here are some of the side-projects I've worked on.",
};

export default function Blog() {
  const sortedProjects = allProjects
    .slice()
    .sort((a, b) => b.time.localeCompare(a.time));

  return (
    <div className="mx-auto max-w-[700px]">
      <div className="flex flex-col gap-16 md:gap-24 ">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="animate-in text-3xl font-bold tracking-tight">
              Build fast, Ship fast.
            </h1>
            <p
              className="animate-in text-secondary"
              style={{ "--index": 1 } as React.CSSProperties}
            >
              Here are some of the side-projects I&apos;ve worked on.
            </p>
          </div>
        </div>
        {sortedProjects[0] && (
          <div
            className="flex animate-in flex-col gap-4 rounded-xl border border-secondary p-6"
            style={{ "--index": 2 } as React.CSSProperties}
          >
            <span className="text-xs font-medium uppercase tracking-wider text-tertiary">Featured Project</span>
            <Link href={`/projects/${sortedProjects[0].slug}`} className="group block">
              <div className="aspect-video w-full overflow-clip rounded-lg border border-secondary bg-tertiary">
                <Image
                  src={sortedProjects[0].image}
                  alt={sortedProjects[0].title}
                  width={700}
                  height={394}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="mt-4 space-y-2">
                <h2 className="text-xl font-bold text-primary group-hover:underline">{sortedProjects[0].title}</h2>
                <p className="text-secondary">{sortedProjects[0].description}</p>
                {sortedProjects[0].tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {sortedProjects[0].tags.slice(0, 6).map((tag: string) => (
                      <span key={tag} className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          </div>
        )}

        <ul
          className="animated-list flex animate-in flex-col"
          style={{ "--index": 3 } as React.CSSProperties}
        >
          {sortedProjects.slice(1).map((project) => (
            <li
              key={project.slug}
              className="flex flex-col gap-4 py-6 transition-opacity first:pt-0 last:pb-0 md:flex-row md:gap-6"
            >
              <Link
                href={`/projects/${project.slug}`}
                className="aspect-video w-full select-none overflow-clip rounded-lg border border-secondary bg-tertiary md:w-2/5"
              >
                <Halo strength={10}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="h-full w-full object-cover"
                  />
                </Halo>
              </Link>
              <div className="w-full space-y-2 md:w-3/5">
                <div>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {project.title}
                  </Link>
                  <time className="text-secondary"> · {project.time}</time>
                </div>

                <p className="line-clamp-3 text-tertiary">
                  {project.description}
                </p>

                {project.tags && (
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.slice(0, 4).map((tag: string) => (
                      <span
                        key={tag}
                        className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                    {project.tags.length > 4 && (
                      <span className="text-xs text-tertiary">
                        +{project.tags.length - 4}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
