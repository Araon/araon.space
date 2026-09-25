import Link from "@/components/ui/Link";
import Image from "next/image";
import { Metadata } from "next";

import notfound from "public/gallery/404.png";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "404 | Araon",
  description: "Uh oh! This page does not exist",
  // Next.js can send its minimal error document before mounting this page.
  // Give that document a dark canvas before styles and the image arrive.
  colorScheme: "dark",
  themeColor: "#0c0c0c",
};

const Custom404 = (): JSX.Element => (
  <div className={styles.page}>
    <figure className={styles.scene}>
      <Image
        src={notfound}
        alt="Calvin and Hobbes sitting beneath a star-filled sky"
        fill
        priority
        unoptimized
        sizes="100vw"
        className={styles.image}
      />
      <figcaption className="sr-only">
        A starry night illustration with the message: If people sat outside
        and looked at the stars each night, I bet they&apos;d live a lot
        differently.
      </figcaption>
    </figure>
    <div className={styles.message}>
      <h1 className="text-lg font-medium">404 — Page not found</h1>
      <Link href="/" className={styles.home} underline>
        Return home
      </Link>
    </div>
  </div>
);

export default Custom404;
