/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import Category from "@/models/Category";


/** GET /api/categories — Public */
/** GET /api/categories */
export async function GET() {
  try {
    await connectToDB();
    
    const categories = await Category.aggregate([
      {
        $lookup: {
          from: "products",           // Make sure this matches your Product collection name
          localField: "_id",
          foreignField: "category",   // Adjust if your Product field is named differently (e.g. categoryId)
          as: "products"
        }
      },
      {
        $addFields: {
          productCount: { $size: "$products" }
        }
      },
      {
        $sort: { name: 1 }
      },
      {
        $project: {
          products: 0   // optional: remove the array
        }
      }
    ]);

    return NextResponse.json({ categories }, { status: 200 });
  } catch (error) {
    console.error("GET /api/categories error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/** POST /api/categories — Admin only */
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const body = await request.json();
    const { name, description } = body as {
      name?: string;
      description?: string;
    };

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Category name is required" },
        { status: 400 },
      );
    }

    const category = await Category.create({ name: name.trim(), description });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/categories error:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Category already exists" },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
