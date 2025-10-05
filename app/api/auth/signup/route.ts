import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { hash } from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Missing data" }, { status: 400 });

    const client = await clientPromise;
    const db = client.db("vault");

    const exists = await db.collection("users").findOne({ email });
    if (exists) return NextResponse.json({ error: "User exists" }, { status: 400 });

    const hashed = await hash(password, 10);
    await db.collection("users").insertOne({ email, password: hashed, createdAt: new Date() });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
