import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const url = request.nextUrl;

  // For local development, use localhost
  const isLocalhost = hostname.includes('localhost');
  
  if (isLocalhost) {
    // Local development - no subdomain routing
    return NextResponse.next();
  }

  // Extract subdomain
  // Example: admin.tuordenya.com -> subdomain = 'admin'
  const parts = hostname.split('.');
  const subdomain = parts.length >= 3 ? parts[0] : null;

  // Handle different subdomains
  if (subdomain === 'admin') {
    // Route admin.tuordenya.com -> /admin
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = '/admin';
      return NextResponse.rewrite(url);
    }
  } else if (subdomain === 'backoffice') {
    // Route backoffice.tuordenya.com -> /backoffice
    if (!url.pathname.startsWith('/backoffice')) {
      url.pathname = `/backoffice${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  } else if (subdomain && subdomain !== 'www') {
    // Any other subdomain is a restaurant slug
    // Route pizza-roma.tuordenya.com -> /pizza-roma
    // We'll need to look up tenant by slug
    if (!url.pathname.startsWith(`/${subdomain}`)) {
      url.pathname = `/${subdomain}${url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)',
  ],
};
