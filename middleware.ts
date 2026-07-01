import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { GUEST_COOKIE } from '@/lib/session-constants';

// V1 has no real auth (NextAuth wiring needs OAuth credentials this project
// doesn't have yet). Every visitor gets a stable anonymous id so scores,
// streaks and cosmetics can be tracked per-browser without a login.
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  if (!request.cookies.get(GUEST_COOKIE)) {
    response.cookies.set(GUEST_COOKIE, crypto.randomUUID(), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    });
  }
  return response;
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico).*)',
};
