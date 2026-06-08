import mongoose from "mongoose";
import dns from "dns";
import { env } from "../env.js";

dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const globalForMongoose = globalThis as unknown as {
  mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
};

globalForMongoose.mongoose = globalForMongoose.mongoose || { conn: null, promise: null };

export async function connectDB(): Promise<typeof mongoose | null> {
  const uri = env.MONGODB_URI;
  if (!uri) {
    if (env.NODE_ENV === "production") {
      throw new Error("Please define the MONGODB_URI environment variable");
    }
    return null;
  }

  if (globalForMongoose.mongoose.conn) {
    return globalForMongoose.mongoose.conn;
  }

  if (!globalForMongoose.mongoose.promise) {
    globalForMongoose.mongoose.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
  }

  try {
    globalForMongoose.mongoose.conn = await globalForMongoose.mongoose.promise;
  } catch (e) {
    globalForMongoose.mongoose.promise = null;
    throw e;
  }

  return globalForMongoose.mongoose.conn;
}
