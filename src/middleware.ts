import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Zones protégées
  if (pathname.startsWith('/admin')) {
    const authToken = request.cookies.get('auth-token')?.value;

    // Empêche l'accès si pas de token ET si on n'est pas sur /admin/login
    if (!authToken && !pathname.startsWith('/admin/login')) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = '/admin/login';
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
