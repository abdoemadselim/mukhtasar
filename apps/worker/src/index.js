import { lru } from "tiny-lru";
const cache = lru(1000, 1000 * 60 * 10);

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request, event))
})

async function handleRequest(request, event) {
  const url = new URL(request.url)
  const path = url.pathname
  const domain = url.hostname

  logRequest(path, 'Worker intercepted')

  if (domain === 'api.mukhtasar.site') {
    return handleApiRequest(request, event)
  }

  const isMainDomain = domain === 'mukhtasar.site' || domain === 'www.mukhtasar.site'

  if (isMainDomain) {
    if (shouldRouteToFrontend(path)) {
      logRequest(path, 'Routing to frontend', { domain })
      return fetch(request)
    }

    logRequest(path, 'Handling redirect for alias', { domain })
    return handleRedirect(request, event, domain)
  } else if (domain.endsWith('.mukhtasar.site')) {
    // Other subdomains (mail autoconfig, autodiscover, DKIM, etc.) — pass through
    return fetch(request)
  } else {
    logRequest(path, 'Custom domain detected', { domain })
    return handleCustomDomain(request, event, domain)
  }
}

async function handleApiRequest(request, event) {
  const url = new URL(request.url)
  const path = url.pathname
  const method = request.method

  logRequest(path, 'API request', { domain: 'api.mukhtasar.site' })

  const urlPattern = /^\/(?:api|ui)\/url\/([^\/]+)\/([^\/]+)$/
  const match = path.match(urlPattern)
  if (match && (method === 'DELETE' || method === 'PATCH')) {
    const domain = match[1]
    const alias = match[2]

    const response = await fetch(request)

    if (response.ok) {
      const cacheKey = `${domain}:${alias}`
      cache.delete(cacheKey)
      logRequest(alias, 'Cache invalidated after backend operation', {
        domain,
        method,
        cacheKey
      })
    }

    return response
  }

  return fetch(request)
}

function validateAliasFormat(alias) {
  if (!alias || alias.length > 30 || !/^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$|^[a-zA-Z0-9]$/.test(alias)) {
    logRequest(alias, 'Redirects to not found page for not valid alias')
    return Response.redirect(`https://mukhtasar.site/pages/not-found`, 302)
  }
}

async function handleCustomDomain(request, event, domain) {
  const url = new URL(request.url)
  const path = url.pathname

  if (path === '/' || path === '') {
    logRequest('/', 'Custom domain root access', { domain })
    return Response.redirect(`https://mukhtasar.site/pages/not-found`, 302)
  }

  return redirectUrl(path, event, request, domain)
}

async function redirectUrl(path, event, request, domain = "mukhtasar.site") {
  const alias = path.slice(1).split('/')[0]

  validateAliasFormat(alias)

  logRequest(alias, 'Looking up alias ', { domain })

  const cacheKey = `${domain}-${alias}`
  let longUrl = cache.get(cacheKey)

  if (!longUrl) {
    const backendUrl = `https://api.mukhtasar.site/public/url/${domain}/${alias}`
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
      return Response.redirect(`https://mukhtasar.site/pages/not-found`, 302)
    }
  }

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

async function sendAnalytics(alias, request, event, domain = 'mukhtasar.site') {
  try {
    const analyticsUrl = `https://api.mukhtasar.site/ui/analytics/`

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
