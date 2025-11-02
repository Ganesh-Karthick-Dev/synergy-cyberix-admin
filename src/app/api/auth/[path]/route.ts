import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Proxy route for all /api/auth/* requests
 * This ensures cookies work properly by proxying through Next.js
 * Routes like /api/auth/profile -> http://localhost:9000/api/auth/profile
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string | string[] }> }
) {
  const resolvedParams = await params;
  const pathParam = Array.isArray(resolvedParams.path) ? resolvedParams.path : [resolvedParams.path];
  return handleProxy(request, pathParam);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string | string[] }> }
) {
  const resolvedParams = await params;
  const pathParam = Array.isArray(resolvedParams.path) ? resolvedParams.path : [resolvedParams.path];
  return handleProxy(request, pathParam);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string | string[] }> }
) {
  const resolvedParams = await params;
  const pathParam = Array.isArray(resolvedParams.path) ? resolvedParams.path : [resolvedParams.path];
  return handleProxy(request, pathParam);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string | string[] }> }
) {
  const resolvedParams = await params;
  const pathParam = Array.isArray(resolvedParams.path) ? resolvedParams.path : [resolvedParams.path];
  return handleProxy(request, pathParam);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string | string[] }> }
) {
  const resolvedParams = await params;
  const pathParam = Array.isArray(resolvedParams.path) ? resolvedParams.path : [resolvedParams.path];
  return handleProxy(request, pathParam);
}

async function handleProxy(request: NextRequest, pathSegments: string[]) {
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
  
  // Handle path segments - can be a string or array
  let path: string;
  if (Array.isArray(pathSegments)) {
    path = pathSegments.join('/');
  } else if (typeof pathSegments === 'string') {
    path = pathSegments;
  } else {
    // Extract from request URL
    const urlPath = request.nextUrl.pathname.replace('/api/auth/', '');
    path = urlPath || '';
  }
  
  // Skip if this is the Google callback (it has its own route)
  // This shouldn't happen since /api/auth/google/callback has its own route handler
  if (path.includes('google/callback') || path === 'google') {
    // Let the specific route handle it - this is a safety check
    console.log('🔵 [API Proxy] Skipping - has dedicated route handler');
    return NextResponse.json({ error: 'Use dedicated route handler' }, { status: 404 });
  }
  
  const queryString = request.nextUrl.searchParams.toString();
  const url = `${backendUrl}/api/auth/${path}${queryString ? `?${queryString}` : ''}`;
  
  console.log('🔵 [API Proxy] ===== PROXY REQUEST START =====');
  console.log('🔵 [API Proxy] Proxying request:', {
    method: request.method,
    originalPath: request.nextUrl.pathname,
    pathSegments,
    resolvedPath: path,
    url,
    hasCookies: !!request.headers.get('cookie'),
    cookieHeader: request.headers.get('cookie')?.substring(0, 100) || 'NONE',
  });

  try {
    const body = request.method !== 'GET' && request.method !== 'HEAD' 
      ? await request.text() 
      : undefined;

    const response = await fetch(url, {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        'Cookie': request.headers.get('cookie') || '',
      },
      body,
      credentials: 'include',
    });

    // Get response data
    const responseData = await response.text();
    let jsonData: any;
    try {
      jsonData = JSON.parse(responseData);
    } catch {
      jsonData = responseData;
    }

    // Create response
    const nextResponse = NextResponse.json(jsonData, {
      status: response.status,
    });

    // Forward Set-Cookie headers from backend to client
    const setCookieHeader = response.headers.get('set-cookie');
    console.log('🔵 [API Proxy] ===== FORWARDING COOKIES =====');
    console.log('🔵 [API Proxy] Set-Cookie header from backend:', setCookieHeader ? setCookieHeader.substring(0, 200) : 'NONE');

    if (setCookieHeader) {
      const cookieStore = cookies();

      // Parse and set cookies using Next.js cookies API
      const cookieStrings = setCookieHeader.split(/,(?=\s*[a-zA-Z_][a-zA-Z0-9_]*=)/);
      console.log('🔵 [API Proxy] Found', cookieStrings.length, 'cookies');

      cookieStrings.forEach((cookieStr, idx) => {
        console.log(`🔵 [API Proxy] Processing cookie ${idx + 1}:`, cookieStr.substring(0, 100) + '...');

        // Parse cookie string to extract name, value, and options
        const parts = cookieStr.split(';').map(s => s.trim());
        const [nameValue] = parts;
        const [name, ...valueParts] = nameValue.split('=');
        const value = valueParts.join('=');

        if (name && value) {
          const cookieOptions: any = {
            httpOnly: cookieStr.includes('HttpOnly'),
            secure: cookieStr.includes('Secure'),
            path: '/',
          };

          // Parse SameSite
          if (cookieStr.includes('SameSite=Strict')) {
            cookieOptions.sameSite = 'strict';
          } else if (cookieStr.includes('SameSite=Lax')) {
            cookieOptions.sameSite = 'lax';
          } else if (cookieStr.includes('SameSite=None')) {
            cookieOptions.sameSite = 'none';
          }

          // Parse Max-Age
          const maxAgeMatch = cookieStr.match(/Max-Age=(\d+)/);
          if (maxAgeMatch) {
            cookieOptions.maxAge = parseInt(maxAgeMatch[1]);
          }

          try {
            cookieStore.set(name.trim(), value.trim(), cookieOptions);
            console.log(`🔵 [API Proxy] ✅ Cookie ${idx + 1} set: ${name.trim()}`);
          } catch (err: any) {
            console.error(`🔵 [API Proxy] ❌ Failed to set cookie ${idx + 1} (${name}):`, err.message);
          }
        }
      });
    }

    console.log('🔵 [API Proxy] ===== PROXY RESPONSE COMPLETE =====');
    console.log('🔵 [API Proxy] Response summary:', {
      status: response.status,
      hasCookies: !!setCookieHeader,
      cookieCount: setCookieHeader ? setCookieHeader.split(',').length : 0,
    });

    return nextResponse;
  } catch (error: any) {
    console.error('🔵 [API Proxy] Error:', error.message);
    return NextResponse.json(
      { error: { message: error.message || 'Proxy error' } },
      { status: 500 }
    );
  }
}

