import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ninetynineclub-api.onrender.com';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleProxyRequest(request, params.path, 'DELETE');
}

async function handleProxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    // Path'i oluştur
    const path = pathSegments.join('/');
    const targetUrl = `${API_BASE_URL}/${path}`;
    
    // Query parametrelerini al
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    // Headers'ı hazırla
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    // Authorization header'ı kopyala
    const authHeader = request.headers.get('Authorization');
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    // X-Request-ID header'ı kopyala
    const requestIdHeader = request.headers.get('X-Request-ID');
    if (requestIdHeader) {
      headers['X-Request-ID'] = requestIdHeader;
    }

    // Body'yi al (GET ve DELETE dışında)
    let body: string | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      try {
        body = await request.text();
      } catch (error) {
        // Body yoksa boş bırak
        body = undefined;
      }
    }

    // API isteğini yap
    const response = await fetch(fullUrl, {
      method,
      headers,
      body: body && body.length > 0 ? body : undefined,
    });

    // Response data'yı al
    const responseData = await response.text();
    
    // Response headers'ını kopyala
    const responseHeaders = new Headers();
    
    // CORS headers'ını ekle
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Request-ID');
    responseHeaders.set('Access-Control-Allow-Credentials', 'true');

    // Content-Type'ı kopyala
    const contentType = response.headers.get('content-type');
    if (contentType) {
      responseHeaders.set('content-type', contentType);
    }

    // Response'u döndür
    return new NextResponse(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('Proxy request failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Proxy request failed', 
        message: error instanceof Error ? error.message : 'Unknown error',
        target: `${API_BASE_URL}/${pathSegments.join('/')}`
      },
      { status: 500 }
    );
  }
}

// OPTIONS request handler for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Request-ID',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
} 