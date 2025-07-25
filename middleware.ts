import { NextRequest, NextResponse } from 'next/server';

const locales = ['hi', 'en'];
const defaultLocale = 'hi';

// Get the preferred locale from the accept-language header
function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return defaultLocale;

  // Simple locale detection - prioritize Hindi, then English
  if (acceptLanguage.includes('hi')) return 'hi';
  if (acceptLanguage.includes('en')) return 'en';
  
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl;
  
  // Skip middleware for admin routes, API routes, and static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Check if the pathname already starts with a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (!pathnameHasLocale) {
    // Get locale from cookie, then from header, then default
    const cookieLocale = request.cookies.get('language')?.value;
    const locale = (cookieLocale && locales.includes(cookieLocale)) 
      ? cookieLocale 
      : getLocale(request);

    // Redirect to the same path with locale prefix
    const redirectPath = pathname === '/' ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(new URL(redirectPath, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
};
