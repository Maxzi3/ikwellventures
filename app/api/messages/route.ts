/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { requireAdmin } from "@/lib/auth";

/** POST /api/messages — Public */
export async function POST(request: NextRequest) {
  try {
    await connectToDB();

    const body = (await request.json()) as {
      name?: string;
      email?: string;
      subject?: string;
      message?: string;
    };

    const { name, email, subject, message } = body;

    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { error: "name, email, and message are required" },
        { status: 400 },
      );
    }

    const newMessage = await Message.create({ name, email, subject, message });
    return NextResponse.json(
      { message: "Message sent successfully", data: newMessage },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("POST /api/messages error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** GET /api/messages — Admin only */
export async function GET(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const readParam = searchParams.get("read");

    const filter: { read?: boolean } = {};
    if (readParam === "true") filter.read = true;
    if (readParam === "false") filter.read = false;

    const messages = await Message.find(filter).sort({ createdAt: -1 });
    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
