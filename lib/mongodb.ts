/* eslint-disable @typescript-eslint/no-explicit-any */

import mongoose from "mongoose";

if (!process.env.MONGODB_URI) {
  throw new Error("Missing MONGODB_URI");
}

// Type augmentation for global
declare global {
  // eslint-disable-next-line no-var
  var mongoose:
    | {
        conn: typeof mongoose | null;
        promise: Promise<typeof mongoose> | null;
      }
    | undefined;
}

// Use a typed variable
const cached: {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
} = (global as any).mongoose ?? { conn: null, promise: null };

if (!(global as any).mongoose) {
  (global as any).mongoose = cached;
}

export async function connectToDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      dbName: "ikwell",
      bufferCommands: false,
      maxPoolSize: 10,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
