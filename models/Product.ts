import mongoose, { Document, Model, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  partNumber: string;
  image: string;
  imagePublicId: string | null;
  category: mongoose.Types.ObjectId | null;
  inStock: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    partNumber: {
      type: String,
      required: [true, "Part number is required"],
      trim: true,
    },
    image: {
      type: String,
      default: "",
    },
    imagePublicId: {
      type: String,
      default: null,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
