// Cloudflare Worker for mukhtasar.pro URL routing
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  const path = url.pathname

  console.log('Worker intercepted:', path)

  if (path.startsWith("/_vercel")) {
    return fetch(request)
  }

  // Route to frontend for specific paths
  if (shouldRouteToFrontend(path)) {
    console.log('Routing to frontend:', path)
    // Let the request pass through to your frontend (no modification needed)
    return fetch(request)
  }

  // Handle short URL redirection
  console.log('Handling redirect for:', path)
  return handleRedirect(request)
}

function shouldRouteToFrontend(path) {
  // Frontend routes - be very specific here
  const frontendPaths = [
    '/pages/',     // Your frontend pages
    '/auth/',
    '/dashboard',  // If you have this route
    '/_next/',     // Next.js assets
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ]

  // Static file extensions
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.map', '.webp']

  // Check exact matches first
  if (path === '/') {
    return true
  }

  // Check if path starts with frontend paths
  for (const frontendPath of frontendPaths) {
    if (path.startsWith(frontendPath)) {
      return true
    }
  }

  // Check if path has static file extension
  for (const ext of staticExtensions) {
    if (path.endsWith(ext)) {
      return true
    }
  }

  // Everything else is treated as a short URL alias
  return false
}

async function handleRedirect(request) {
  try {
    const url = new URL(request.url)
    const alias = url.pathname.slice(1) // Remove leading slash

    // Skip empty aliases
    if (!alias) {
      return Response.redirect(url.origin, 302)
    }

    console.log('Looking up alias:', alias)

    // Call your backend to get the redirect URL
    const backendUrl = `https://api.mukhtasar.pro/${alias}`

    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
        'X-Real-IP': request.headers.get('CF-Connecting-IP') || '',
        'Accept': 'application/json',
        'Referer': request.headers.get('Referer') || ''
      }
    })

    console.log('Backend response status:', backendResponse.status)

    if (backendResponse.status === 200) {
      const data = await backendResponse.json()
      console.log('Redirecting to:', data.data.url)

      // Perform the redirect
      return Response.redirect(data.data.url, 302)
    } else if (backendResponse.status === 404) {
      // URL not found - redirect to frontend 404 page
      console.log('Alias not found, redirecting to 404')
      return Response.redirect(`${url.origin}/pages/not-found`, 302)
    } else {
      // Other errors - let frontend handle it
      console.log('Backend error, falling back to frontend')
      return fetch(request)
    }

  } catch (error) {
    console.error('Worker error:', error)
    // On error, fall back to frontend
    return fetch(request)
  }
}