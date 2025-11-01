import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js API Route Handler for Google OAuth Callback
 * This proxies the callback to the backend server and handles the redirect
 */
export async function GET(request: NextRequest) {
  console.log('🔵 [Frontend Callback] Google OAuth callback received');
  console.log('🔵 [Frontend Callback] Request URL:', request.url);
  console.log('🔵 [Frontend Callback] Request headers:', {
    cookie: request.headers.get('cookie') ? 'Present' : 'Missing',
    userAgent: request.headers.get('user-agent'),
  });

  try {
    // Get the backend API URL from environment
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000';
    console.log('🔵 [Frontend Callback] Backend URL:', backendUrl);
    
    // Get all query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    console.log('🔵 [Frontend Callback] Query params:', {
      code: searchParams.get('code') ? 'Present' : 'Missing',
      scope: searchParams.get('scope'),
      authuser: searchParams.get('authuser'),
      prompt: searchParams.get('prompt'),
      fullQueryString: queryString,
    });
    
    // Build backend callback URL with all query params
    const backendCallbackUrl = `${backendUrl}/api/auth/google/callback${queryString ? `?${queryString}` : ''}`;
    console.log('🔵 [Frontend Callback] Calling backend:', backendCallbackUrl);
    
    // Forward the request to the backend using fetch
    const response = await fetch(backendCallbackUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      redirect: 'manual', // Don't follow redirects automatically
    });
    
    console.log('🔵 [Frontend Callback] Backend response status:', response.status);
    console.log('🔵 [Frontend Callback] Backend response headers:', {
      location: response.headers.get('location'),
      'set-cookie': response.headers.get('set-cookie') ? 'Present' : 'Missing',
      contentType: response.headers.get('content-type'),
    });
    
    // If backend redirects, get the redirect location
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      console.log('🔵 [Frontend Callback] Backend redirect location:', location);
      
      if (location) {
        // Backend is redirecting to frontend dashboard
        console.log('🔵 [Frontend Callback] Redirecting to:', location);
        return NextResponse.redirect(location);
      }
    }
    
    // If there's an error, redirect to login with error
    if (response.status >= 400) {
      const responseText = await response.text();
      console.error('🔵 [Frontend Callback] Backend error response:', {
        status: response.status,
        statusText: response.statusText,
        body: responseText,
      });
      
      let errorData = {};
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        console.error('🔵 [Frontend Callback] Failed to parse error response as JSON');
      }
      
      const errorMessage = (errorData as any)?.error?.message || 'Authentication failed';
      console.error('🔵 [Frontend Callback] Redirecting to login with error:', errorMessage);
      
      return NextResponse.redirect(
        new URL(`/signin?error=${encodeURIComponent(errorMessage)}`, request.url)
      );
    }
    
    // If successful but no redirect, redirect to dashboard
    console.log('🔵 [Frontend Callback] No redirect from backend, redirecting to dashboard');
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (error: any) {
    console.error('🔵 [Frontend Callback] Error:', {
      message: error?.message,
      stack: error?.stack,
      name: error?.name,
    });
    // Redirect to login page with error
    return NextResponse.redirect(
      new URL(`/signin?error=${encodeURIComponent(error?.message || 'Authentication failed')}`, request.url)
    );
  }
}

