/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import localFont from "next/font/local";
import Halo from "@/components/ui/Halo";


interface Comment {
  id: string;
  author: string;
  content: string;
}

const ticketingFont = localFont({
  src: "../../../../public/RedditMono-VariableFont_wght.ttf",
  display: "swap",
});

const authorFont = localFont({
  src: "../../../../public/Montserrat-VariableFont_wght.ttf",
  display: "swap",
});



export default function CommentList({ postId }: { postId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchComments = async () => {
      const response = await fetch(`/api/prisma/getComments?postId=${postId}`);
      const data = await response.json();
      setComments(data.comments.reverse());
    };

    fetchComments();
  }, [postId]);

  return (
    <div>
      {comments.length > 0 ? (
        <h2 className="mb-4 text-xl font-semibold">
          Comments ({comments.length})
        </h2>
      ) : null}{" "}
      {comments.map((comment) => (
        <Halo strength={6} className="rounded-md p-3" key={comment.id}>
          <article
            className="mb-1 flex p-2 text-base"
          >
            <img
              className="mr-4 h-14 w-14 rounded-full"
              src={`https://api.dicebear.com/8.x/notionists/svg?seed=${comment.author}&flip=false`}
              alt={`${comment.author}'s profile picture`}
            />
            <div>
              <div className="flex items-center">
                <p
                  className={clsx(
                    authorFont.className,
                    "flex flex-col gap-1 text-lg font-semibold",
                  )}
                >
                  {comment.author}
                </p>
              </div>

              <p
                className={clsx(
                  ticketingFont.className,
                  "flex flex-col gap-1 text-base",
                )}
              >
                {comment.content}
              </p>
            </div>
          </article>
        </Halo>
      ))}
    </div>
  );
}
