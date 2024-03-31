import Image from "next/image";
import { Metadata } from "next";

import Link from "@/components/ui/Link";
import Section from "@/components/Section";
import ConnectLinks from "../../components/ConnectLinks";
// import Workplaces from "./components/Workplaces";
import Gallery from "./components/Gallery";
// import me from "public/gallery/me.jpg"
import meJanlem from "public/gallery/me-janlem.jpg";
// import iitghy from "public/gallery/iitghy.jpg";
import nr from "public/gallery/nishi-riki.jpg"

export const metadata: Metadata = {
  title: "About | Araon",
  description: "very gpu-poor optimist, loves cs, electronics, retro and bikes",
  // "I am a full-stack developer with a knack for radios and hardware.",
};

export default function About() {
  return (
    <div className="flex flex-col gap-16 md:gap-24">
      <div>
        <h1 className="animate-in text-3xl font-bold tracking-tight">
          About Me
        </h1>
        <p
          className="animate-in text-secondary"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          Just a quick glimpse.
        </p>
      </div>
      <div className="mb-8 md:hidden">
        <div
          className="animate-in"
          style={{ "--index": 1 } as React.CSSProperties}
        >
          <Image
            src={meJanlem}
            alt={"Riki and Janlem"}
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
            src={nr}
            alt={"nishi and i"}
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
            <p>Namaste, I&apos;m Araon!</p>

            <p>
              I love building cool things with code and I&apos;m all about ham
              radios, computers, and diving deep into the world of hardware
              geekiness.
            </p>
            <p>
              I sometimes write on{" "}
              <Link className="underline" href="https://rikiphukon.medium.com/">
                Medium
              </Link>{" "}
              about computers, life, etc.
            </p>
            <p>
              When I&apos;m not at my desk I am probably lifting weights,
              practicing my punches, or at the mountains:)
            </p>
          </div>
        </Section>

        <Section heading="Connect" headingAlignment="left">
          <div className="flex w-full flex-col gap-8">
            <p>
              Have a question or just want to chat? Feel free to{" "}
              <Link href="https://twitter.com/kungfukon">text me</Link>. Try
              finding me anywhere else at @kungfukon.
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

        {/* <Section heading="Work" headingAlignment="left">
          <div className="flex w-full flex-col gap-8">
            <p>
              {new Date().getFullYear() - 2022}+ years of professional
              development experience.
            </p>
            <p>
              I started my career freelancing, building simple wordpress websites.
            </p>
            <Workplaces items={workplaces} />
          </div>
        </Section> */}
      </div>
    </div>
  );
}

// const workplaces = [
//   {
//     title: "",
//     company: "",
//     time: "",
//     imageSrc: "",
//     link: "",
//   },
// ];
