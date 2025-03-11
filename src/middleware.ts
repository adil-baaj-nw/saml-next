import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
export function middleware(request: NextRequest) {
  // Check if the request is for the protected API
  if (request.nextUrl.pathname.startsWith('/api/protected')) {
    const session = request.cookies.get('connect.sid');
    
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
  }
  
  return NextResponse.next();
}
