import { NextResponse, type NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isApiRoute = pathname.startsWith('/api');
  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute && token.role !== 'ADMIN') {
    if (isApiRoute) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/learn/:path*',
    '/progress/:path*',
    '/bookmarks/:path*',
    '/settings/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
    '/api/queue/:path*',
    '/api/review/:path*',
    '/api/bookmarks/:path*',
    '/api/units/:path*',
    '/api/settings/:path*',
    '/api/words/:path*',
  ],
};
