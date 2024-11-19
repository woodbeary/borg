import { NextResponse } from "next/server";
import { adminDb } from "@/app/lib/firebase/admin";
import { moderateContent } from "@/app/lib/gemini";
import type { Definition } from "@/app/types/definitions";
import type { QueryDocumentSnapshot } from "firebase-admin/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { term, definition } = body;
    
    if (!term || !definition) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    const moderation = await moderateContent(term, definition);

    if (!moderation.approved) {
      return NextResponse.json({ 
        success: false,
        message: moderation.reason 
      }, { status: 400 });
    }

    try {
      if (!adminDb) {
        throw new Error('Database not initialized');
      }

      const docData = {
        term,
        definition,
        status: 'approved',
        createdAt: new Date().toISOString(),
        votes: 0
      };

      const docRef = await adminDb.collection('definitions').add(docData);

      if (!docRef?.id) {
        throw new Error('Failed to get document reference');
      }

      return NextResponse.json({ 
        success: true,
        id: docRef.id,
        message: 'Definition added successfully'
      }, { status: 200 });
    } catch (dbError) {
      console.error('Database error:', dbError instanceof Error ? dbError.message : dbError);
      return NextResponse.json({ 
        success: false,
        message: 'Failed to save to database',
        error: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }, { status: 500 });
    }
    
  } catch (error) {
    console.error('POST /api/definitions error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ 
      success: false,
      message: 'An error occurred while processing your request',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 5;
    
    const snapshot = await adminDb
      .collection('definitions')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset((page - 1) * limit)
      .get();

    const definitions = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({
      id: doc.id,
      ...doc.data()
    })) as Definition[];

    return NextResponse.json({ 
      success: true, 
      definitions 
    });
    
  } catch (error) {
    return NextResponse.json({ 
      success: false,
      message: 'Failed to fetch definitions'
    }, { status: 500 });
  }
} 