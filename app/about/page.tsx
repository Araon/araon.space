import Image from "next/image";
import { Metadata } from "next";

import Link from "@/components/ui/Link";
import Section from "@/components/Section";
import ConnectLinks from "../../components/ConnectLinks";
import Workplaces from "./components/Workplaces";
import Gallery from "./components/Gallery";
import medarjeeling from "public/gallery/me-darjeeling.jpg"
import guitar from "public/gallery/guitar.jpg"

export const metadata: Metadata = {
  title: "Me? | Araon",
  description: "very gpu-poor optimist, loves cs, hardware, retro and bikes",
};

export default function About() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <div>
        <h1 className="animate-in text-3xl font-bold tracking-tight">
          Who Me?
        </h1>
        <p
          className="animate-in text-secondary"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Okay so..
        </p>
      </div>
      <div className="mb-8 md:hidden">
        <div
          className="animate-in"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <Image
            src={medarjeeling}
            alt={"me in darjeeling"}
            width={220}
            height={260}
            className="pointer-events-none relative inset-0 -top-2 h-60 -rotate-6 rounded-2xl bg-gray-400 object-cover shadow-md"
            priority
          />
        </div>

        <div
          className="animate-in"
          style={{ "--index": 2 } as React.CSSProperties}
        >
          <Image
            src={guitar}
            alt={"guitar from k-on"}
            width={220}
            height={260}
            className="pointer-events-none absolute inset-0 -top-40 left-[45%] w-48 rotate-6 rounded-2xl bg-gray-400 object-cover shadow-md md:left-[60%] md:w-56"
            priority
          />
        </div>
      </div>
      <div className="hidden md:block">
        <Gallery />
      </div>
      <div
        className="flex animate-in flex-col gap-16 md:gap-24"
        style={{ "--index": 3 } as React.CSSProperties}
      >
        <Section heading="About" headingAlignment="left">
          <div className="flex flex-col gap-6">
            <p>Hey, I&apos;m Araon!</p>

            <p>
              I love building cool things with code and I&apos;m all about engineering, history, and diving deep into the world of hardware.
            </p>
            <p>
              I sometimes write on my{" "}
              <Link className="underline" href="https://araon.space/blog">
                blog
              </Link>{" "}
              about computers, life and anything that peaks my curiosity.
            </p>
            <p>
              When I&apos;m not at my desk, I am probably taking{" "}
              <Link className="underline" href="https://www.instagram.com/ara0n/">
                photos
              </Link>{" "},
              practicing my punches or riding my bike :)
            </p>
          </div>
        </Section>

        <Section heading="Work" headingAlignment="left">
          <div className="flex w-full flex-col gap-8">
            <p>
              I started my career freelancing for seniors, building simple websites and renting out game servers.
            </p>
            <Workplaces items={workplaces} />
          </div>
        </Section>

        <Section heading="Connect" headingAlignment="left">
          <div className="flex w-full flex-col gap-8">
            <p>
              Have a question or just want to chat? Feel free to{" "}
              <Link href="https://twitter.com/ara0n_">text me</Link>. Try
              finding me anywhere else at @araon.
            </p>
            <ul className="animated-list grid flex-grow grid-cols-1 gap-2 md:grid-cols-2">
              {ConnectLinks.map((link) => (
                <li className="col-span-1 transition-opacity" key={link.label}>
                  <Link
                    href={link.href}
                    className="inline-grid w-full rounded-lg border border-primary p-4 no-underline transition-opacity"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{link.icon}</span>
                      {link.label}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="ml-auto h-5 w-5 text-secondary"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Section>


      </div>
    </div>
  );
}

const workplaces = [
  {
    title: "SDE 1",
    company: "Onlinesales.ai",
    time: "3 Years",
    imageSrc: "",
    link: "https:Onlinesales.ai",
  },
  {
    title: "Intern",
    company: "Matrix",
    time: "1 Year",
    imageSrc: "",
    link: "https://linkedin.com/in/matrix-international-3ab15387",
  },
];
