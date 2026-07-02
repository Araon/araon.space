/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/server";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const postTitle = searchParams.get("title");
  const postImage = searchParams.get("image");
  let postSummery = searchParams.get("summery");

  if (postSummery === "null" || postSummery === undefined) {
    postSummery = "";
  }

  const baseURL = "https://araon.space/";

  const imageURL = `${baseURL}${postImage}`;

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          position: "relative",
        }}
      >
        <img
          src={imageURL}
          style={{
            height: "100%",
            width: "100%",
            objectFit: "cover",
          }}
          alt="open-graph"
        />
        {/* gradient */}
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            display: "flex",
            height: "100%",
            width: "100%",
            background:
              "linear-gradient(10deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            justifyContent: "flex-end",
            height: "100%",
            width: "100%",
            padding: "50px 70px",
            color: "#fff",
          }}
        >
          <h1
            style={{
              fontSize: "60px",
              width: "100%",
              fontWeight: "bold",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {postTitle}
          </h1>
          <p
            style={{
              fontSize: "30px",
              width: "100%",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }}
          >
            {postSummery}
          </p>
        </div>

        <div
          style={{
            right: 42,
            bottom: 42,
            position: "absolute",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              width: 14,
              height: 14,
              background: "white",
              borderRadius: "50",
            }}
          />
          <span
            style={{
              marginLeft: 8,
              fontSize: 20,
              color: "white",
            }}
          >
            araon.space
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
