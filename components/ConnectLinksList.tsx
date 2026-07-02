"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import ConnectLinks from "./ConnectLinks";

export default function ConnectLinksList() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const isNothing = mounted && resolvedTheme === "nothing";

  return (
    <ul className="animated-list grid flex-grow grid-cols-1 gap-2 md:grid-cols-2">
      {ConnectLinks.map((link) => (
        <li className="col-span-1 transition-opacity" key={link.label}>
          <a
            href={link.href}
            className="inline-grid w-full rounded-lg border border-primary p-4 no-underline transition-opacity"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">
                {isNothing ? link.emoji : link.icon}
              </span>
              {link.label}
              {!isNothing && (
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
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
