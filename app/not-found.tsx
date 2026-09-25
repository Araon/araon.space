import Link from "@/components/ui/Link";
import Image from "next/image";
import { Metadata } from "next";

import notfound from "public/gallery/404.png";

export const metadata: Metadata = {
  title: "404 | Araon",
  description: "Uh oh! This page does not exist",
};

const Custom404 = (): JSX.Element => (
  <div className="flex flex-col gap-6">
    <div>
      <h1>404 - Page not found</h1>
      <p className="mt-2 text-secondary">
        Uh oh! This page does not exist. Maybe you clicked an old link or
        misspelled it.
      </p>
    </div>
    <figure className="relative -mx-6 aspect-[5/6] overflow-hidden bg-black md:-mx-8 md:rounded-xl">
      <Image
        src={notfound}
        alt="Calvin and Hobbes sitting beneath a star-filled sky"
        fill
        priority
        sizes="(max-width: 768px) 100vw, 700px"
        className="object-cover object-left"
      />
      <figcaption className="sr-only">
        A starry night illustration with the message: If people sat outside
        and looked at the stars each night, I bet they&apos;d live a lot
        differently.
      </figcaption>
    </figure>
    <Link href="/" underline>
      Return home
    </Link>
  </div>
);

export default Custom404;
