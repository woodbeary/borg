import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { moderateContent } from "@/app/lib/gemini";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { term, definition } = await request.json();

    // Moderate content using Gemini
    const moderation = await moderateContent(term, definition);

    const docRef = await adminDb.collection("definitions").add({
      term,
      definition,
      createdAt: new Date(),
      authorId: session.user.id,
      authorName: session.user.name,
      status: moderation.approved ? 'approved' : 'pending',
      moderationReason: moderation.reason
    });

    return NextResponse.json({ 
      id: docRef.id,
      status: moderation.approved ? 'approved' : 'pending',
      message: moderation.approved 
        ? 'Definition approved and published!'
        : 'Definition submitted for review.'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating definition:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 