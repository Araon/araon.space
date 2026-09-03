import Link from "next/link";
import { ReactNode } from "react";
import clsx from "clsx";

type NavLinkProps = {
  href: string;
  children: ReactNode;
  active: boolean;
};

export default function NavLink({ href, children, active }: NavLinkProps) {
  return (
    <Link
      className={clsx(
        "flex min-h-[44px] items-center rounded-lg px-4 py-2 text-sm transition-colors hover:text-primary",
        active ? "bg-secondaryA text-primary" : "text-secondary",
      )}
      href={href}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
