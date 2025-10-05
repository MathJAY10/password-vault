import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { _authOptionsForInternalUse as authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET single vault item
export async function GET(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

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
export async function DELETE(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

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
export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = await context.params;

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _id: _, ...rest } = data; // ignore _id

  const client = await clientPromise;
  const db = client.db("vault");

  await db.collection("vaultItems").updateOne(
    { _id: new ObjectId(id), email: session.user?.email },
    { $set: rest }
  );

  return NextResponse.json({ success: true });
}
