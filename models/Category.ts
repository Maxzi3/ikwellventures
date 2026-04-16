import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true },
);

// Auto-generate slug from name before saving
CategorySchema.pre("validate", function (this: ICategory) {
  if (this.name && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  }
});

const Category: Model<ICategory> =
  (mongoose.models.Category as Model<ICategory>) ||
  mongoose.model<ICategory>("Category", CategorySchema);

export default Category;
