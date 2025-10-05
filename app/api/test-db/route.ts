// app/api/test-db/route.ts
import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("vault");
    const collections = await db.listCollections().toArray();
    return NextResponse.json({ status: "connected", collections });
  } catch (err) {
    return NextResponse.json({ status: "error", error: err });
  }
}
