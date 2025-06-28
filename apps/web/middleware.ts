import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  const isAuthPath = pathname.startsWith('/auth');
  const isDashboardPath = pathname.startsWith('/dashboard');
  const isLoginRedirect = pathname === '/auth';

  if (isLoginRedirect) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isDashboardPath && !accessToken && !refreshToken) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  if (isAuthPath && (accessToken || refreshToken)) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/auth', '/auth/:path*', '/dashboard/:path*'],
};
