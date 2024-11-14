import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase/admin";
import { moderateContent } from "@/app/lib/gemini";

export async function POST(request: Request) {
  try {
    const { term, definition, recaptchaToken } = await request.json();

    // Verify reCAPTCHA token here
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`
    });

    const recaptchaResult = await recaptchaResponse.json();
    if (!recaptchaResult.success) {
      return NextResponse.json({ error: "Invalid CAPTCHA" }, { status: 400 });
    }

    // Moderate content using Gemini
    const moderation = await moderateContent(term, definition);

    const docRef = await adminDb.collection("definitions").add({
      term,
      definition,
      createdAt: new Date(),
      authorName: "Anonymous BORGer",
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