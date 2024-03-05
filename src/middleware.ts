import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import appendHeaderTitle from './utils/middleware/hooks/appendHeaderProps';
import protectedURLs from './utils/middleware/hooks/protectedURLs';

export async function middleware(req: NextRequest) {
  const requestHeaders = new Headers(req.headers);

  const { redirect, response } = protectedURLs({ req, requestHeaders });

  if (redirect) {
    return response;
  }

  appendHeaderTitle({ req, requestHeaders });

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ['/((?!.*\\.).*)', '/api/(.*)']
};
