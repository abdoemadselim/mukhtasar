import { lru } from "tiny-lru";
const cache = lru(1000, 1000 * 60 * 5);

// Cloudflare Worker for mukhtasar.pro URL routing
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event))
})

async function handleRequest(request, event) {
  const url = new URL(request.url)
  const path = url.pathname

  console.log('Worker intercepted:', path)

  if (path.startsWith("/_vercel")) {
    return fetch(request)
  }

  if (shouldRouteToFrontend(path)) {
    console.log('Routing to frontend:', path)
    return fetch(request)
  }

  console.log('Handling redirect for:', path)
  return handleRedirect(request, event)
}

function shouldRouteToFrontend(path) {
  const frontendPaths = [
    '/pages/',
    '/auth/',
    '/dashboard',
    '/_next/',
    '/favicon.ico',
    '/robots.txt',
    '/sitemap.xml',
  ]

  const staticExtensions = [
    '.js', '.css', '.png', '.jpg', '.jpeg', '.gif',
    '.svg', '.ico', '.woff', '.woff2', '.ttf', '.map', '.webp'
  ]

  if (path === '/') {
    return true
  }

  for (const frontendPath of frontendPaths) {
    if (path.startsWith(frontendPath)) {
      return true
    }
  }

  for (const ext of staticExtensions) {
    if (path.endsWith(ext)) {
      return true
    }
  }

  return false
}

async function handleRedirect(request, event) {
  try {
    const url = new URL(request.url)
    const alias = url.pathname.slice(1)

    if (!alias) {
      return Response.redirect(url.origin, 302)
    }

    console.log('Looking up alias:', alias)

    let longUrl = cache.get(alias)

    if (!longUrl) {
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

      if (backendResponse.status === 200) {
        const data = await backendResponse.json()
        longUrl = data.data.url
        cache.set(alias, longUrl)
      } else if (backendResponse.status === 404) {
        return Response.redirect(`${url.origin}/pages/not-found`, 302)
      } else {
        return fetch(request)
      }
    }

    // ✅ Correctly schedule analytics without blocking redirect
    event.waitUntil(sendAnalytics(alias, request))

    return Response.redirect(longUrl, 302)
  } catch (error) {
    console.error('Worker error:', error)
    return fetch(request)
  }
}

async function sendAnalytics(alias, request) {
  const analyticsUrl = `https://api.mukhtasar.pro/ui/analytics/`

  await fetch(analyticsUrl, {
    method: 'POST',
    headers: {
      "Authorization": "Bearer Randompasswordisherenooneknowsabout123",
      'Content-Type': 'application/json',
      'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
      'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
      'X-Real-IP': request.headers.get('CF-Connecting-IP') || ''
    },
    body: JSON.stringify({ alias })
  })
}