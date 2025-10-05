import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/lib/auth";

// Helper to get `id` from request URL
function getIdFromUrl(req: Request) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  return parts[parts.length - 1]; // last segment is the id
}

// GET single vault item
export async function GET(req: Request) {
  const id = getIdFromUrl(req);

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("vault");

  const item = await db.collection("vaultItems").findOne({
    _id: new ObjectId(id),
    email: session.user?.email,
  });

  return NextResponse.json(item);
}

// DELETE vault item
export async function DELETE(req: Request) {
  const id = getIdFromUrl(req);

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const client = await clientPromise;
  const db = client.db("vault");

  await db.collection("vaultItems").deleteOne({
    _id: new ObjectId(id),
    email: session.user?.email,
  });

  return NextResponse.json({ success: true });
}

// PUT (update) vault item
export async function PUT(req: Request) {
  const id = getIdFromUrl(req);

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const { _id, ...rest } = data; // ignore _id if provided

  const client = await clientPromise;
  const db = client.db("vault");

  await db.collection("vaultItems").updateOne(
    { _id: new ObjectId(id), email: session.user?.email },
    { $set: rest }
  );

  return NextResponse.json({ success: true });
}
