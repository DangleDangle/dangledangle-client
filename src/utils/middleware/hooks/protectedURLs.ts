import {
  COOKIE_ACCESS_TOKEN_KEY,
  COOKIE_REDIRECT_URL,
  COOKIE_REFRESH_TOKEN_KEY
} from '@/constants/cookieKeys';
import { NextResponse, type NextRequest } from 'next/server';

interface HandleAdminURLsProps {
  req: NextRequest;
  requestHeaders: Headers;
}

export default function protectedURLs({
  req,
  requestHeaders
}: HandleAdminURLsProps) {
  const accessToken = req.cookies.get(COOKIE_ACCESS_TOKEN_KEY)?.value || '';

  const { pathname, search, origin, basePath } = req.nextUrl;
  if (!accessToken) {
    const noRedirectForEditExtra = req.nextUrl.pathname.startsWith(
      '/admin/shelter/edit/extra'
    );

    if (!noRedirectForEditExtra && req.nextUrl.pathname.startsWith('/admin')) {
      if (!req.cookies.get(COOKIE_REDIRECT_URL)?.value) {
        requestHeaders.append(
          'Set-Cookie',
          `${COOKIE_REDIRECT_URL}=${basePath}${pathname}${search}`
        );
      }
      const signUrl = new URL(`${basePath}/login`, origin);
      return {
        redirect: true,
        response: NextResponse.redirect(signUrl, { headers: requestHeaders })
      };
    }
  }

  if (accessToken) {
    if (req.nextUrl.pathname.startsWith('/logout?force=true')) {
      const response = NextResponse.redirect(`${origin}/login`);
      response.cookies.delete(COOKIE_ACCESS_TOKEN_KEY);
      response.cookies.delete(COOKIE_REFRESH_TOKEN_KEY);
      return {
        redirect: true,
        response
      };
    }

    if (req.nextUrl.pathname.startsWith('/login')) {
      const { origin, basePath } = req.nextUrl;

      const mainReturnUrl = new URL(`${basePath}`, origin);
      return {
        redirect: true,
        response: NextResponse.redirect(mainReturnUrl)
      };
    }
  }

  // redirect 필요 없을 시
  return { redirect: false };
}
