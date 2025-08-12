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
    // Path ve hedef URL'yi oluştur (gerekiyorsa '/api' prefix'ini ekle ve iki kez eklenmesini önle)
    const path = pathSegments.join('/');

    const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
    const baseHasApi = /\/api(\/|$)/.test(normalizedBase);

    // Path'teki olası leading 'api/' parçasını temizle
    const cleanedPath = path.replace(/^api\//, '');

    const targetUrl = baseHasApi
      ? `${normalizedBase}/${cleanedPath}`
      : `${normalizedBase}/api/${cleanedPath}`;
    
    // Query parametrelerini al
    const searchParams = request.nextUrl.searchParams;
    const queryString = searchParams.toString();
    const fullUrl = queryString ? `${targetUrl}?${queryString}` : targetUrl;

    // Headers'ı kopyala (Content-Type dahil), bazı sunucuya özel headerları çıkar
    const forwardHeaders = new Headers();
    request.headers.forEach((value, key) => {
      // Host ve Content-Length hedef için ayarlanmalı, kopyalamayalım
      if (key.toLowerCase() === 'host' || key.toLowerCase() === 'content-length') return;
      forwardHeaders.set(key, value);
    });

    // Body'yi aktar (GET ve DELETE dışında). FormData/stream bozulmasın diye stream'i forward et
    let requestBody: ReadableStream<Uint8Array> | undefined;
    if (method !== 'GET' && method !== 'DELETE') {
      requestBody = request.body ?? undefined;
    }

    // API isteğini yap
    const fetchOptions: RequestInit & { duplex?: 'half' } = {
      method,
      headers: forwardHeaders,
      body: requestBody,
    };
    // Node.js ortamında ReadableStream forward ediyorsak duplex gerekli olabilir
    if (requestBody) {
      fetchOptions.duplex = 'half';
    }

    const response = await fetch(fullUrl, fetchOptions as RequestInit);

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
        target: (() => {
          const normalizedBase = API_BASE_URL.replace(/\/+$/, '');
          const baseHasApi = /\/api(\/|$)/.test(normalizedBase);
          const p = pathSegments.join('/');
          const cleaned = p.replace(/^api\//, '');
          return baseHasApi ? `${normalizedBase}/${cleaned}` : `${normalizedBase}/api/${cleaned}`;
        })()
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