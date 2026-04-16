import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import Message from "@/models/Message";
import { requireAdmin } from "@/lib/auth";

type RouteContext = { params: { id: string } };

/** GET /api/messages/[id] — Admin only. Auto-marks as read. */
export async function GET(request: NextRequest, { params }: RouteContext) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const message = await Message.findByIdAndUpdate(
      params.id,
      { $set: { read: true } },
      { new: true },
    );

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("GET /api/messages/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** PATCH /api/messages/[id] — Admin only. Toggle read status. */
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const body = (await request.json()) as { read?: unknown };

    if (typeof body.read !== "boolean") {
      return NextResponse.json(
        { error: "'read' must be a boolean" },
        { status: 400 },
      );
    }

    const message = await Message.findByIdAndUpdate(
      params.id,
      { $set: { read: body.read } },
      { new: true },
    );

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message }, { status: 200 });
  } catch (error) {
    console.error("PATCH /api/messages/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** DELETE /api/messages/[id] — Admin only. */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const message = await Message.findByIdAndDelete(params.id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/messages/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
