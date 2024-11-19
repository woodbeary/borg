import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only run on admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const adminToken = request.cookies.get('adminToken')?.value;
    
    // Check for admin token in cookie
    if (adminToken === process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      return NextResponse.next();
    }
    
    // If no valid token, show login page
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*'
}; 