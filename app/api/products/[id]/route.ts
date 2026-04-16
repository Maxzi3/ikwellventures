/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";
import Product from "@/models/Product";


type RouteContext = { params: Promise<{ id: string }> };

/**
 * GET /api/products/[id]
 * Public — fetch a single product by ID.
 */
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    await connectToDB();
    const product = await Product.findById(id).populate(
      "category",
      "name slug",
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/products/[id]
 * Admin only — update a product, optionally replacing or removing its image.
 */
export async function PUT(request: NextRequest, { params }: RouteContext) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    await connectToDB();

    const existing = await Product.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const formData = await request.formData();
    const imageFile = formData.get("image") as File | null;
    const removeImage = formData.get("removeImage") === "true";

    const updates: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      if (key === "image" || key === "removeImage") continue;
      if (key === "inStock") updates[key] = value !== "false";
      else if (key === "featured") updates[key] = value === "true";
      else updates[key] = value;
    }

    if (imageFile && imageFile.size > 0) {
      if (existing.imagePublicId) {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      }
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploadResult = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "products", resource_type: "image" },
            (error, result) => {
              if (error || !result) return reject(error);
              resolve(result as { secure_url: string; public_id: string });
            },
          )
          .end(buffer);
      });
      updates.image = uploadResult.secure_url;
      updates.imagePublicId = uploadResult.public_id;
    } else if (removeImage) {
      if (existing.imagePublicId) {
        await cloudinary.uploader.destroy(existing.imagePublicId);
      }
      updates.image = "";
      updates.imagePublicId = null;
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    ).populate("category", "name slug");

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    console.error("PUT /api/products/[id] error:", error);
    if (error.name === "ValidationError") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/products/[id]
 * Admin only — delete a product and its Cloudinary image.
 */
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const { id } = await params;
    await connectToDB();

    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.imagePublicId) {
      await cloudinary.uploader.destroy(product.imagePublicId);
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
