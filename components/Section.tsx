import { ReactNode } from "react";
import clsx from "clsx";

type SectionProps = {
  heading: string;
  headingAlignment?: "right" | "left";
  children: ReactNode;
};

export default function Section({
  heading,
  headingAlignment,
  children,
}: SectionProps) {
  return (
    <section className="col-reverse flex flex-col gap-2 md:flex-row md:gap-9">
      <h2
        className={clsx(
          "section-heading shrink-0 text-secondary md:w-32",
          headingAlignment === "right" && "md:text-right",
        )}
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}
