/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { connectToDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import cloudinary from "@/lib/cloudinary";

/** GET /api/products — Public, with pagination + search */
export async function GET(request: NextRequest) {
  try {
    await connectToDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") ?? "10", 10)),
    );

    const filter: Record<string, unknown> = {};
   if (category) {
     const mongoose = (await import("mongoose")).default;
     if (mongoose.isValidObjectId(category)) {
       filter.category = category;
     } else {
       const categoryDoc = await Category.findOne({ slug: category }); 
       if (categoryDoc) filter.category = categoryDoc._id;
       else filter.category = null;
     }
   }
    if (featured === "true") filter.featured = true;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { partNumber: { $regex: search, $options: "i" } },
      ];
    }


    const [products, total, inStockCount, outOfStockCount] = await Promise.all([
      Product.find(filter)
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit),

      Product.countDocuments(filter),

      Product.countDocuments({ ...filter, inStock: true }),
      Product.countDocuments({ ...filter, inStock: false }),
    ]);

    return NextResponse.json({
      products,
      total,
      page,
      inStockCount,
      outOfStockCount,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("GET /api/products:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/** POST /api/products — Admin only */
export async function POST(request: NextRequest) {
  const auth = requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    await connectToDB();

    const formData = await request.formData();

    const name = (formData.get("name") as string | null)?.trim();
    const description =
      (formData.get("description") as string | null)?.trim() ?? "";
    const partNumber = (formData.get("partNumber") as string | null)?.trim();
    const category = formData.get("category") as string | null;
    const imageFile = formData.get("image") as File | null;
    const inStock = formData.get("inStock") !== "false";
    const featured = formData.get("featured") === "true";

    if (!name || !partNumber) {
      return NextResponse.json(
        { error: "Name and part number are required" },
        { status: 400 },
      );
    }

    let image: string | null = null;
    let imagePublicId: string | null = null;

    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const uploaded = await new Promise<{
        secure_url: string;
        public_id: string;
      }>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { folder: "products", resource_type: "image" },
            (err, result) => {
              if (err || !result)
                return reject(err ?? new Error("Upload failed"));
              resolve(result as { secure_url: string; public_id: string });
            },
          )
          .end(buffer);
      });
      image = uploaded.secure_url;
      imagePublicId = uploaded.public_id;
    }

    const product = await Product.create({
      name,
      description,
      partNumber,
      image: image || "",
      imagePublicId,
      category: category || null,
      inStock,
      featured,
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/products:", error);
    return NextResponse.json(
      {
        error:
          error.name === "ValidationError"
            ? error.message
            : "Internal server error",
      },
      { status: 500 },
    );
  }
}
