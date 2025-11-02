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
    // Note: credentials must be 'include' to send/receive cookies
    const response = await fetch(backendCallbackUrl, {
      method: 'GET',
      headers: {
        'Cookie': request.headers.get('cookie') || '',
      },
      redirect: 'manual', // Don't follow redirects automatically
      credentials: 'include', // Include cookies in request
    });
    
    console.log('🔵 [Frontend Callback] Backend response status:', response.status);
    
    // Get all headers - including Set-Cookie which might not be in headers
    const allHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });
    console.log('🔵 [Frontend Callback] All backend response headers:', Object.keys(allHeaders));
    console.log('🔵 [Frontend Callback] Backend response headers:', {
      location: response.headers.get('location'),
      'set-cookie': response.headers.get('set-cookie') ? 'Present' : 'Missing',
      contentType: response.headers.get('content-type'),
      allHeaders: allHeaders,
    });
    
    // If backend redirects, get the redirect location
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      console.log('🔵 [Frontend Callback] Backend redirect location:', location);
      
      if (location) {
        // Backend has set cookies in Set-Cookie header
        // We need to extract and forward them to the browser
        // Note: fetch() in Node.js doesn't expose Set-Cookie headers easily
        // We need to check the raw headers
        
        // Try to get all Set-Cookie headers from the response
        // Since fetch doesn't expose Set-Cookie, we need to access response.headers directly
        const setCookieHeaders: string[] = [];
        
        // Get Set-Cookie header(s) - fetch() in Node.js combines multiple Set-Cookie headers
        // The header value might contain multiple cookies separated by commas
        const setCookieHeader = response.headers.get('set-cookie');
        console.log('🔵 [Frontend Callback] Raw Set-Cookie header:', setCookieHeader);
        
        if (setCookieHeader) {
          // HTTP allows multiple Set-Cookie headers, but fetch() might combine them
          // Try to split by looking for cookie patterns: name=value; attribute1; attribute2
          // Multiple cookies might be separated by patterns like ", name=" or just comma
          
          // Better approach: Use a proper cookie parser
          // Look for pattern where a new cookie starts: ", cookieName="
          // But be careful - cookie values can contain commas!
          
          // Split by ", " followed by a pattern that looks like a cookie name
          // This regex looks for ", " followed by word characters and "="
          const cookiePattern = /,\s*([a-zA-Z_][a-zA-Z0-9_]*)=/g;
          let lastIndex = 0;
          let match;
          
          while ((match = cookiePattern.exec(setCookieHeader)) !== null) {
            if (match.index > lastIndex) {
              // Extract cookie from lastIndex to match.index
              const cookieStr = setCookieHeader.substring(lastIndex, match.index);
              if (cookieStr.trim()) {
                setCookieHeaders.push(cookieStr.trim());
              }
            }
            lastIndex = match.index + 2; // Skip ", "
          }
          
          // Add the last cookie
          if (lastIndex < setCookieHeader.length) {
            const lastCookie = setCookieHeader.substring(lastIndex);
            if (lastCookie.trim()) {
              setCookieHeaders.push(lastCookie.trim());
            }
          }
          
          // If no matches found, treat entire string as one cookie
          if (setCookieHeaders.length === 0) {
            setCookieHeaders.push(setCookieHeader);
          }
        }
        
        // Also check all headers for set-cookie (case-insensitive)
        response.headers.forEach((value, key) => {
          if (key.toLowerCase() === 'set-cookie' && !setCookieHeaders.includes(value)) {
            setCookieHeaders.push(value);
          }
        });
        
        console.log('🔵 [Frontend Callback] ===== COOKIE PROCESSING START =====');
        console.log('🔵 [Frontend Callback] Found Set-Cookie headers:', setCookieHeaders.length);
        console.log('🔵 [Frontend Callback] Raw Set-Cookie headers:', setCookieHeaders);
        
        // Create redirect response
        const redirectUrl = new URL(location);
        const redirectResponse = NextResponse.redirect(redirectUrl);
        
        let cookiesProcessed = 0;
        
        // Forward all Set-Cookie headers to the browser
        // Extract cookie values and set them properly for the browser
        setCookieHeaders.forEach((cookieHeader, index) => {
          console.log(`🔵 [Frontend Callback] Processing cookie header ${index + 1}:`, cookieHeader.substring(0, 100) + '...');
          // Parse the cookie header (format: name=value; attributes)
          // Note: Multiple cookies might be in one header, separated by patterns
          // Each cookie starts with name=value and ends before next name=value
          
          // Split cookies more carefully - look for pattern: name=value; attr1; attr2
          // Multiple cookies are typically comma-separated, but cookie values can have commas
          // Better: Split by looking for "; Path=" or similar attributes that mark cookie end
          
          // Simple approach: Split by comma only if followed by a pattern like "; Max-Age=" or "; Expires="
          // This is not perfect but should work for most cases
          
          // For now, treat each entry as a separate cookie string
          // Each should be in format: name=value; attribute1=value1; attribute2; ...
          const cookieString = cookieHeader.trim();
          
          // Parse cookie name and value (before first semicolon or comma)
          const nameValueMatch = cookieString.match(/^([^=]+)=([^;,]+)/);
          if (nameValueMatch) {
            const name = nameValueMatch[1].trim();
            const value = nameValueMatch[2].trim();
            
            if (name && value) {
              // Parse attributes from the full cookie string
              // IMPORTANT: Set domain to backend domain (localhost) so cookies work for backend requests
              const cookieOptions: any = {
                httpOnly: cookieString.includes('HttpOnly'),
                secure: cookieString.includes('Secure'),
                sameSite: cookieString.includes('SameSite=None') ? 'none' : 
                         cookieString.includes('SameSite=Strict') ? 'strict' : 
                         cookieString.includes('SameSite=Lax') ? 'lax' : 'lax',
                path: '/',
                // CRITICAL: Set domain to 'localhost' (without port) so cookies work for both ports
                // This allows cookies to be sent to localhost:9000 even though we're on localhost:3000
                domain: 'localhost',
              };
              
              // Extract Max-Age or Expires
              const maxAgeMatch = cookieString.match(/Max-Age=(\d+)/);
              const expiresMatch = cookieString.match(/Expires=([^;,]+)/);
              
              if (maxAgeMatch) {
                cookieOptions.maxAge = parseInt(maxAgeMatch[1]);
              } else if (expiresMatch) {
                // Convert expires to maxAge
                const expiresDate = new Date(expiresMatch[1].trim());
                const now = new Date();
                cookieOptions.maxAge = Math.max(0, Math.floor((expiresDate.getTime() - now.getTime()) / 1000));
              }
              
              // Set cookie on redirect response
              // NOTE: Setting domain to 'localhost' allows cookies to work across ports
              // However, Next.js may not allow setting cookies for different domains
              // If this doesn't work, we'll need to use an API proxy for all backend requests
              try {
                redirectResponse.cookies.set(name, value, cookieOptions);
                cookiesProcessed++;
                console.log(`🔵 [Frontend Callback] ✅ Set cookie: ${name}`, {
                  valueLength: value.length,
                  valuePreview: value.substring(0, 30) + '...',
                  httpOnly: cookieOptions.httpOnly,
                  secure: cookieOptions.secure,
                  sameSite: cookieOptions.sameSite,
                  maxAge: cookieOptions.maxAge,
                  path: cookieOptions.path,
                  domain: cookieOptions.domain,
                });
              } catch (cookieError: any) {
                console.error(`🔵 [Frontend Callback] ❌ Failed to set cookie ${name}:`, cookieError.message);
              }
            } else {
              console.log(`🔵 [Frontend Callback] ⚠️ Failed to parse cookie from header ${index + 1}`);
            }
          }
        });
        
        console.log('🔵 [Frontend Callback] ===== COOKIE PROCESSING COMPLETE =====');
        console.log('🔵 [Frontend Callback] Summary:', {
          totalHeaders: setCookieHeaders.length,
          cookiesProcessed,
          redirectTo: location,
        });
        
        // Verify cookies are set in response
        const responseCookies = redirectResponse.cookies.getAll();
        console.log('🔵 [Frontend Callback] Cookies in redirect response:', {
          count: responseCookies.length,
          names: responseCookies.map(c => c.name),
        });
        
        console.log('🔵 [Frontend Callback] Redirecting to:', location);
        return redirectResponse;
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
    
    // If successful but no redirect, redirect to root
    console.log('🔵 [Frontend Callback] No redirect from backend, redirecting to root');
    return NextResponse.redirect(new URL('/', request.url));
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

