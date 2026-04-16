/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Category from "@/models/Category";
import Product from "@/models/Product";


type RouteContext = { params: { id: string } };

/** GET /api/categories/[id] — Public */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    await connectToDB();

    const category = await Category.findById(params.id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** PUT /api/categories/[id] — Admin only */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const body = (await request.json()) as {
      name?: string;
      description?: string;
    };

    // Regenerate slug if name is being updated
    const updates: Record<string, string> = {};
    if (body.name) {
      updates.name = body.name.trim();
      updates.slug = body.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
    }
    if (body.description !== undefined) {
      updates.description = body.description;
    }

    const category = await Category.findByIdAndUpdate(
      params.id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ category }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/categories/[id] error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category name already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** DELETE /api/categories/[id] — Admin only */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const category = await Category.findByIdAndDelete(params.id);
    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    // Unlink this category from all products that referenced it
    await Product.updateMany(
      { category: params.id },
      { $set: { category: null } },
    );

    return NextResponse.json(
      { message: "Category deleted and unlinked from products" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/categories/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
