import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json([], { status: 401 });

  const client = await clientPromise;
  const db = client.db("vault");

  const items = await db
    .collection("vaultItems")
    .find({ email: session.user?.email })
    .toArray();

  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const client = await clientPromise;
  const db = client.db("vault");

  await db.collection("vaultItems").insertOne({
    ...data,
    email: session.user?.email,
    createdAt: new Date(),
  });

  return NextResponse.json({ success: true });
}
