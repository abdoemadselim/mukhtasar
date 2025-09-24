import { lru } from "tiny-lru";
const cache = lru(1000, 1000 * 60 * 10);

// Cloudflare Worker for mukhtasar.pro URL routing
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event))
})

async function handleRequest(request, event) {
  const url = new URL(request.url)
  const path = url.pathname
  const domain = url.hostname

  console.log(request.url);

  logRequest(path, 'Worker intercepted')

  // Handle API subdomain
  if (domain === 'api.mukhtasar.pro') {
    return handleApiRequest(request, event)
  }

  // Handle Vercel-specific requests (vercel analytics or speed insights requests)
  if (path.startsWith("/_vercel")) {
    return fetch(request.url)
  }

  const isMainDomain = domain === 'mukhtasar.pro' || domain === 'www.mukhtasar.pro'

  if (isMainDomain) {
    if (shouldRouteToFrontend(path)) {
      logRequest(path, 'Routing to frontend', { domain })
      return fetch(request)
    }

    logRequest(path, 'Handling redirect for alias', { domain })
    return handleRedirect(request, event, domain)
  } else {
    // Custom domain logic
    logRequest(path, 'Custom domain detected', { domain })
    return handleCustomDomain(request, event, domain)
  }
}

async function handleApiRequest(request, event) {
  const url = new URL(request.url)
  const path = url.pathname

  logRequest(path, 'API request', { domain: 'api.mukhtasar.pro' })

  // Simply pass the request through to the backend
  return fetch(request)
}

function validateAliasFormat(alias) {
  if (!alias || alias.length > 30 || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(alias)) {
    logRequest(alias, 'Redirects to not found page for not valid alias')
    return Response.redirect(`https://mukhtasar.pro/pages/not-found`, 302)
  }
}

async function handleCustomDomain(request, event, domain) {
  const url = new URL(request.url)
  const path = url.pathname

  // For custom domains, we expect the path to be the alias (e.g., customdomain.com/abc123)
  // Root path (/) should redirect to the main site or show an error
  if (path === '/' || path === '') {
    logRequest('/', 'Custom domain root access', { domain })
    return Response.redirect(`https://mukhtasar.pro/pages/not-found`, 302)
  }

  return redirectUrl(path, event, request, domain)
}

async function redirectUrl(path, event, request, domain = "mukhtasar.pro") {
  // Extract alias from path (remove leading slash)
  const alias = path.slice(1).split('/')[0] // Take only first path segment

  validateAliasFormat(alias)

  logRequest(alias, 'Looking up alias ', { domain })

  // Use domain-specific cache key
  const cacheKey = `${domain}:${alias}`
  let longUrl = cache.get(cacheKey)

  if (!longUrl) {
    // Backend API call with custom domain context
    const backendUrl = `https://api.mukhtasar.pro/public/url/${domain}/${alias}`
    const backendResponse = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
        'X-Real-IP': request.headers.get('CF-Connecting-IP') || '',
        'X-Custom-Domain': domain,
        'Accept': 'application/json',
        'Referer': request.headers.get('Referer') || ''
      }
    })

    if (backendResponse.status === 200) {
      const data = await backendResponse.json()
      longUrl = data.data.url
      cache.set(cacheKey, longUrl)
    } else {
      return Response.redirect(`https://mukhtasar.pro/pages/not-found`, 302)
    }
  }

  // Schedule analytics with custom domain context
  event.waitUntil(sendAnalytics(alias, request, event, domain))

  logRequest(alias, 'Redirecting', {
    domain: domain,
    destination: longUrl
  })

  return Response.redirect(longUrl, 302)
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

async function handleRedirect(request, event, domain) {
  const url = new URL(request.url)
  const path = url.pathname

  return redirectUrl(path, event, request, domain)
}

async function sendAnalytics(alias, request, event, domain = 'mukhtasar.pro') {
  try {
    const analyticsUrl = `https://api.mukhtasar.pro/ui/analytics/`

    await fetch(analyticsUrl, {
      method: 'POST',
      headers: {
        "Authorization": `Bearer ${WORKER_SECRET}`,
        'Content-Type': 'application/json',
        'User-Agent': request.headers.get('User-Agent') || 'Cloudflare-Worker',
        'X-Forwarded-For': request.headers.get('CF-Connecting-IP') || '',
        'X-Real-IP': request.headers.get('CF-Connecting-IP') || '',
        'X-Custom-Domain': domain
      },
      body: JSON.stringify({
        alias,
        domain: domain,
      })
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

