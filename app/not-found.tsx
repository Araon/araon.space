import Link from "@/components/ui/Link";
import Image from "next/image";
import { Metadata } from "next";

import notfound from "public/gallery/404.png";

export const metadata: Metadata = {
  title: "404 | Araon",
  description: "Uh oh! This page does not exist",
};

const Custom404 = (): JSX.Element => (
  <div className="flex flex-col gap-2">
    <h1>404 - Page not found</h1>
    <p className="text-secondary">
      Uh oh! This page does not exists, maybe you clicked an old link or
      misspelled. Please try again…
    </p>
    <Image src={notfound} alt={"lost in space"} priority />
    <div className="h-2" />
    <Link href="/" underline>
      Return home
    </Link>
  </div>
);

export default Custom404;
