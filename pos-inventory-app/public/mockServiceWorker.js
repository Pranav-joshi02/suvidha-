/* eslint-disable */
/* tslint:disable */

/**
 * Mock Service Worker (MSW) v2.0.0
 * @see https://github.com/mswjs/msw
 * - Please do not modify this file directly.
 * - This file has been automatically generated from the MSW library.
 */

self.addEventListener('install', function () {
  self.skipWaiting()
})

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('message', async function (event) {
  const clientId = event.source.id

  if (!clientId || !self.clients) {
    return
  }

  const client = await self.clients.get(clientId)

  if (!client) {
    return
  }

  const allClients = await self.clients.matchAll({
    type: 'window',
  })

  switch (event.data) {
    case 'KEEPALIVE_REQUEST': {
      sendToClient(client, {
        type: 'KEEPALIVE_RESPONSE',
      })
      break
    }

    case 'INTEGRITY_CHECK_REQUEST': {
      sendToClient(client, {
        type: 'INTEGRITY_CHECK_RESPONSE',
        payload: {
          v2: true,
        },
      })
      break
    }

    case 'MOCK_ACTIVATE': {
      self.__isMockActive = true
      sendToClient(client, {
        type: 'MOCKING_ENABLED',
        payload: true,
      })
      break
    }

    case 'MOCK_DEACTIVATE': {
      self.__isMockActive = false
      break
    }

    case 'CLIENT_CLOSED': {
      const remainingClients = allClients.filter((client) => {
        return client.id !== clientId
      })

      if (remainingClients.length === 0) {
        self.registration.unregister()
      }

      break
    }
  }
})

self.addEventListener('fetch', function (event) {
  const { request } = event
  const acceptHeader = request.headers.get('accept') || ''

  const parsedUrl = new URL(request.url)

  if (parsedUrl.pathname === '/mockServiceWorker.js') {
    return
  }

  if (acceptHeader.includes('text/html')) {
    return
  }

  if (!self.__isMockActive) {
    return
  }

  event.respondWith(handleRequest(event, request))
})

async function handleRequest(event, request) {
  const client = await event.target.clients.get(event.clientId)

  if (!client) {
    return passthrough(request)
  }

  const requestId = crypto.randomUUID()

  client.postMessage({
    type: 'REQUEST',
    payload: {
      id: requestId,
      method: request.method,
      url: request.url,
      headers: Object.fromEntries(request.headers.entries()),
      cache: request.cache,
      mode: request.mode,
      credentials: request.credentials,
      destination: request.destination,
      integrity: request.integrity,
      redirect: request.redirect,
      referrer: request.referrer,
      referrerPolicy: request.referrerPolicy,
      body: await request.clone().text(),
      keepalive: request.keepalive,
    },
  })

  return new Promise((resolve) => {
    const handleMessage = function (event) {
      if (
        event.data &&
        event.data.type === 'RESPONSE' &&
        event.data.payload.id === requestId
      ) {
        self.removeEventListener('message', handleMessage)

        if (event.data.payload.type === 'MOCK_RESPONSE') {
          resolve(
            new Response(event.data.payload.body, {
              status: event.data.payload.status,
              statusText: event.data.payload.statusText,
              headers: new Headers(event.data.payload.headers),
            })
          )
        }

        if (event.data.payload.type === 'PASSTHROUGH') {
          resolve(passthrough(request))
        }
      }
    }

    self.addEventListener('message', handleMessage)
  })
}

function sendToClient(client, message) {
  return new Promise((resolve, reject) => {
    const channel = new MessageChannel()

    channel.port1.onmessage = (event) => {
      if (event.data && event.data.error) {
        return reject(event.data.error)
      }

      resolve(event.data)
    }

    client.postMessage(message, [channel.port2])
  })
}

async function passthrough(request) {
  const response = await fetch(request)
  return response
}