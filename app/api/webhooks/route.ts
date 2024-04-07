import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_ID = process.env.CHAT_ID

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { postId, content, author } = body;

    console.log("Got data from database: ", body);

    if (!content || !author) {
      return NextResponse.json(
        { error: "Content and author fields are required" },
        { status: 400 },
      );
    }

    const message = `New comment added to your blog!\n\nPost Link: https://araon.space/blog/${postId}\nName: ${author}\nComment: ${content}`;

    // Send the message to Telegram using the bot token and chat ID
    await axios.post(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      chat_id: CHAT_ID,
      text: message,
    });

    return NextResponse.json({ comment: "Comment added" }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
