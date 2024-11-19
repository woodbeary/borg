import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { adminDb } from "@/app/lib/firebase/admin";

export async function DELETE(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const adminToken = authHeader?.split('Bearer ')[1];

    if (adminToken !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Definition ID is required' 
      }, { status: 400 });
    }

    await adminDb.collection('definitions').doc(id).delete();

    return NextResponse.json({ 
      success: true, 
      message: 'Definition deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting definition:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to delete definition' 
    }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const adminToken = authHeader?.split('Bearer ')[1];

    if (adminToken !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      return NextResponse.json({ 
        success: false,
        message: 'Unauthorized' 
      }, { status: 401 });
    }

    const body = await request.json();
    const { id, term, definition } = body;

    if (!id || !term || !definition) {
      return NextResponse.json({ 
        success: false,
        message: 'Missing required fields' 
      }, { status: 400 });
    }

    await adminDb.collection('definitions').doc(id).update({
      term,
      definition,
      updatedAt: new Date().toISOString()
    });

    return NextResponse.json({ 
      success: true,
      message: 'Definition updated successfully' 
    });
    
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ 
      success: false,
      message: 'Failed to update definition' 
    }, { status: 500 });
  }
} 