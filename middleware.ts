import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from 'next/headers';

const ADMIN_EMAILS = ["your.email@example.com"]; // Add admin emails here

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const sessionToken = request.cookies.get('next-auth.session-token');
    
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // You might want to validate the session token here
    // For now, we'll just check if it exists
    
    return NextResponse.next();
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: "/admin/:path*",
}; 