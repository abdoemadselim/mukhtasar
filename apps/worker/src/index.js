import { lru } from "tiny-lru";
const cache = lru(1000, 1000 * 60 * 10);

// Cloudflare Worker for mukhtasar.pro URL routing
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event))
})

async function handleRequest(request, event) {
  const url = new URL(request.url)
  const path = url.pathname
  logRequest(path, 'Worker intercepted')

  // Block access to API UI endpoints (Only accessibly through mukhtasar interface)
  // if (isApiUiPath(path)) {
  //   logRequest(path, 'Blocking API backend /ui/* access')
  //   return new Response(null, { status: 404 }) // no body at all
  // }

  // if (isApiPath(path)) {
  //   logRequest(path, 'Handling API request - redirects to backend')
  //   return fetch(request)
  // }

  if (path.startsWith("/_vercel")) {
    return fetch(request)
  }

  if (shouldRouteToFrontend(path)) {
    logRequest(path, 'Routing to frontend')
    return fetch(request)
  }

  logRequest(path, 'Handling redirect for alias')
  return handleRedirect(request, event)
}

function isApiUiPath(path) {
  // Block all /ui paths that should not be publicly accessible
  return path.startsWith('/ui')
}

function isApiPath(path) {
  // Block all /ui paths that should not be publicly accessible
  return path.startsWith('/api');
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

    // Validate alias format early
    if (!alias || alias.length > 30 || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(alias)) {
      logRequest(alias, 'Redirects to not found page for not valid alias')
      return Response.redirect(`${url.origin}/pages/not-found`, 302)
    }

    logRequest(alias, 'Looking up alias')
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
    event.waitUntil(sendAnalytics(alias, request, event))
    return Response.redirect(longUrl, 302)
  } catch (error) {
    logRequest('error', `Worker error`, { error: error.message })
    return fetch(request)
  }
}

async function sendAnalytics(alias, request, event) {
  try {
    const analyticsUrl = `https://api.mukhtasar.pro/ui/analytics/`

    await fetch(analyticsUrl, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${WORKER_SECRET}`,
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
        'X-Real-IP': request.headers.get('CF-Connecting-IP') || ''
      },
      body: JSON.stringify({ alias })
    })
  } catch (error) {
    logRequest('analytics', 'Analytics failed', { error: error.message })
  }
}

function logRequest(path, action, details = {}) {
  console.log(JSON.stringify({
    timestamp: Date.now(),
    path,
    action,
    ...details
  }))
}

