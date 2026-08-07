"use client";

import posthog from "posthog-js";

export default function ResumeLink() {
  return (
    <a
      href="/resume/soumik_ghosh_26_01_13.pdf"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        posthog.capture("resume_download_clicked", {
          location: "about_page",
          resume_file: "soumik_ghosh_26_01_13.pdf",
        })
      }
      className="inline-flex w-fit items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" x2="8" y1="13" y2="13" />
        <line x1="16" x2="8" y1="17" y2="17" />
        <line x1="10" x2="8" y1="9" y2="9" />
      </svg>
      View Resume
    </a>
  );
}
