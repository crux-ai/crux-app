import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

// 1. Specify protected and public routes
const protectedRoutes = ['/dashboard'];

export default async function middleware(request: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookieStore = cookies();
  const token = cookieStore.get('cruxSessionToken')?.value ?? null;
  const validToken = (token !== '' && token !== null);

  // 4. Optimistic validation
  if (isProtectedRoute && !validToken) {
    return NextResponse.redirect(new URL('/login', request.nextUrl));
  }

  // 5. CSRF protection
  // To implement this call /auth/refresh
  if (request.method === 'GET') {
    const response = NextResponse.next();
    // const token = request.cookies.get('cruxSessionToken')?.value ?? null;
    // if (token !== null) {
    //   // Only extend cookie expiration on GET requests since we can be sure
    //   // a new session wasn't set when handling the request.
    //   response.cookies.set('session', token, {
    //     path: '/',
    //     maxAge: 60 * 60 * 24 * 30,
    //     sameSite: 'lax',
    //     httpOnly: true,
    //     secure: process.env.NODE_ENV === 'production',
    //   });
    // }
    return response;
  }

  const originHeader = request.headers.get('Origin');
  // NOTE: You may need to use `X-Forwarded-Host` instead
  const hostHeader = request.headers.get('Host');
  if (originHeader === null || hostHeader === null) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  let origin: URL;
  try {
    origin = new URL(originHeader);
  } catch {
    return new NextResponse(null, {
      status: 403,
    });
  }
  if (origin.host !== hostHeader) {
    return new NextResponse(null, {
      status: 403,
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
