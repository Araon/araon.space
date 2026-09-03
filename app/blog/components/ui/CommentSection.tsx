"use client";

import { FormEventHandler, useCallback, useState } from "react";
import Halo from "@/components/ui/Halo";

export default function CommentSection({ postId }: { postId: string }) {
  const [isSuccess, setIsSuccess] = useState<boolean | undefined>();
  const [isCommentSubmitted, setIsCommentSubmitted] = useState(false);

  const onSubmit: FormEventHandler = useCallback(
    async (event) => {
      event.preventDefault();

      const target = event.target as HTMLFormElement;
      const data = new FormData(target);

      const author = data.get("name")?.toString().trim() ?? "";
      const content = data.get("comment")?.toString().trim() ?? "";

      const body = JSON.stringify({
        postId,
        author,
        content,
      });

      const headers = new Headers({
        "Content-Type": "application/json; charset=utf-8",
      });

      try {
        const response = await fetch(`/api/prisma/postComments`, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers,
          body,
        });

        if (response.status === 201) {
          setIsSuccess(true);
          setIsCommentSubmitted(true);
        } else {
          setIsSuccess(false);
        }
      } catch {
        setIsSuccess(false);
      }
    },
    [postId],
  );

  const message =
    isSuccess === false ? (
      <p className="text-center text-sm text-red-500">
        Oh no! Something went wrong.
      </p>
    ) : isSuccess ? (
      <p className="text-center text-sm text-green-500">
        Your comment has been added!
      </p>
    ) : (
      <p className="font-primary text-dark mb-4 py-10 text-xl dark:text-white">
        Join the discussion — leave a thought
      </p>
    );

  return (
    <div className="bg-dark flex w-full flex-col rounded-lg p-6">
      {message}
      {!isCommentSubmitted && (
        <form onSubmit={onSubmit} className="flex flex-col space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-l text-dark mb-4 font-medium dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              className="block min-h-[44px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-zinc-950 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Name"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="comment"
              className="text-l text-dark mb-2 font-medium dark:text-white"
            >
              Comment
            </label>
            <textarea
              name="comment"
              id="comment"
              rows={2}
              className="block min-h-[44px] w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-zinc-950 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="What do you think? I'd love to hear your thoughts..."
            />
          </div>
          <Halo strength={0} className="rounded-lg">
            <button
              type="submit"
              className="group relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-red-200 via-red-300 to-yellow-200 p-0.5 text-sm font-medium text-gray-900 focus:outline-none focus:ring-4 focus:ring-red-100 group-hover:from-red-200 group-hover:via-red-300 group-hover:to-yellow-200 dark:text-white dark:hover:text-gray-900 dark:focus:ring-red-400"
            >
              <span className="relative inline-flex min-h-[44px] items-center rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-zinc-950">
                Post Comment
              </span>
            </button>
          </Halo>
        </form>
      )}
    </div>
  );
}
