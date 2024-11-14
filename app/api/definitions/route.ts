import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { term, definition } = await request.json();

    // Just return success for now
    return NextResponse.json({ 
      id: 'dummy-id',
      status: 'approved',
      message: 'Definition approved and published!'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
} 